import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
import zipfile

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
import package_release as package
import staging_smoke as smoke


class ReleasePackageTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary.name)
        self.files = {
            'index.html': b'<!doctype html><title>Test</title>',
            'app.js': b'const game = "offline";',
            'sw.js': b"const CACHE='secret-circle-v1';const STAGING_CACHE='secret-circle-v1-staging';const CORE=['./','./index.html','./app.js'];",
            '_headers': b'/*\n  X-Content-Type-Options: nosniff\n',
            'THIRD_PARTY_NOTICES.md': b'Test notices\n'
        }
        meta = {'packageVersion': 'test', 'offlineCache': {
            'production': 'secret-circle-v1', 'staging': 'secret-circle-v1-staging',
            'coreHash': package.offline.core_hash(self.files['sw.js'].decode(), self.files.__getitem__)
        }}
        for name, data in self.files.items():
            (self.root / name).write_bytes(data)
        (self.root / 'release-meta.json').write_text(json.dumps(meta))
        (self.root / 'operator-release.json').write_text('{"private":"NICHT VERÖFFENTLICHEN"}')
        (self.root / 'README.md').write_text('Internal document')
        self.git('init', '-q')
        self.git('add', '.')
        self.git('-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-qm', 'Fixture')
        self.commit = self.git('rev-parse', 'HEAD').decode().strip()

    def tearDown(self):
        self.temporary.cleanup()

    def git(self, *args):
        return subprocess.check_output(['git', *args], cwd=self.root, stderr=subprocess.PIPE)

    def build(self):
        return package.load_commit(root=self.root)

    def test_only_runtime_files_and_exact_commit_are_packaged(self):
        files, manifest = self.build()
        self.assertEqual(set(files), set(self.files))
        self.assertEqual(manifest['commit'], self.commit)
        self.assertNotIn('operator-release.json', files)
        self.assertNotIn('README.md', files)
        site, archive = self.root / 'dist/site', self.root / 'release/app.zip'
        package.write_package(files, manifest, site, archive)
        self.assertEqual(package.verify_site(site, self.commit, self.root), manifest)
        with zipfile.ZipFile(archive) as data:
            self.assertEqual(set(data.namelist()), set(files) | {package.MANIFEST})

    def test_deterministic_archive_and_idempotent_export(self):
        files, manifest = self.build()
        site, archive = self.root / 'dist/site', self.root / 'release/app.zip'
        package.write_package(files, manifest, site, archive)
        before = archive.read_bytes()
        package.write_package(files, manifest, site, archive)
        self.assertEqual(before, archive.read_bytes())

    def test_extra_or_tampered_file_stops_reuse_without_deletion(self):
        files, manifest = self.build()
        for name, content in [('secret.txt', b'private'), ('app.js', b'tampered')]:
            with self.subTest(name=name):
                site, archive = self.root / name.replace('.', '-'), self.root / (name + '.zip')
                package.write_package(files, manifest, site, archive)
                changed = site / name
                changed.write_bytes(content)
                with self.assertRaises(ValueError):
                    package.write_package(files, manifest, site, archive)
                self.assertEqual(changed.read_bytes(), content)

    def test_core_hash_mismatch_is_rejected(self):
        (self.root / 'app.js').write_bytes(b'changed without bump')
        self.git('add', 'app.js')
        self.git('-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-qm', 'Bad core')
        with self.assertRaises(ValueError):
            self.build()

    def test_modified_file_and_forged_manifest_cannot_impersonate_a_git_commit(self):
        import hashlib
        files, manifest = self.build()
        site, archive = self.root / 'site', self.root / 'app.zip'
        package.write_package(files, manifest, site, archive)
        forged = b'/*\n  Content-Security-Policy: unsafe\n'
        (site / '_headers').write_bytes(forged)
        manifest['files']['_headers'] = {'bytes': len(forged), 'sha256': hashlib.sha256(forged).hexdigest()}
        (site / package.MANIFEST).write_bytes(package.manifest_bytes(manifest))
        # Die Selbstprüfsummen allein wären konsistent; der tatsächliche Git-Stand ist anders.
        package.verify_site(site)
        with self.assertRaises(ValueError):
            package.verify_site(site, self.commit, self.root)

    def test_bundled_fonts_require_complete_unchanged_license_texts(self):
        for prefix in package.FONT_LICENSES:
            with self.subTest(font=prefix):
                files = {**self.files, prefix + 'latin.woff2': b'font fixture'}
                with self.assertRaises(ValueError):
                    package.assert_font_notices(files)
                files['THIRD_PARTY_NOTICES.md'] = (ROOT / 'THIRD_PARTY_NOTICES.md').read_bytes()
                package.assert_font_notices(files)
                files['THIRD_PARTY_NOTICES.md'] = files['THIRD_PARTY_NOTICES.md'].replace(b'SIL OPEN FONT LICENSE', b'CHANGED FONT LICENSE')
                with self.assertRaises(ValueError):
                    package.assert_font_notices(files)

    def test_unsafe_paths_and_false_commit_are_rejected(self):
        for name in ['../secret.js', '/app.js', 'tests/data.js', 'scripts/x.js', '.env', 'operator-release.json', 'README.md', 'app.js?x', 'C:/x.js', 'a\\b.js']:
            with self.subTest(name=name), self.assertRaises(ValueError):
                package.safe_name(name)
        _, manifest = self.build()
        with self.assertRaises(ValueError):
            package.check_manifest(manifest, '0' * 40)

    def test_git_symlink_and_escaping_output_are_rejected(self):
        link = subprocess.check_output(['git', 'hash-object', '-w', '--stdin'], cwd=self.root, input=b'../outside.js').decode().strip()
        self.git('update-index', '--add', '--cacheinfo', f'120000,{link},app.js')
        self.git('-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-qm', 'Bad link')
        with self.assertRaises(ValueError):
            self.build()
        from unittest.mock import patch
        with patch.object(package, 'ROOT', self.root):
            with self.assertRaises(ValueError):
                package.output_path('../outside', 'dist')

    def test_deployed_package_verifies_actual_bytes_and_rejects_html_or_wrong_commit(self):
        files, manifest = self.build()
        manifest_result = smoke.FetchResult('', '', 200, 'application/json', {}, package.manifest_bytes(manifest))
        resources = {name: smoke.FetchResult('', '', 200, 'text/plain', {}, value) for name, value in files.items()}
        from unittest.mock import patch
        with patch.object(smoke, 'fetch', return_value=manifest_result), patch.object(smoke, 'load_commit', side_effect=lambda ref: package.load_commit(ref, root=self.root)):
            smoke.verify_deployed_package('https://test.invalid/', self.commit, manifest['cache'], resources)
            resources['app.js'].body = b'altered'
            with self.assertRaises(RuntimeError):
                smoke.verify_deployed_package('https://test.invalid/', self.commit, manifest['cache'], resources)
            with self.assertRaises(ValueError):
                smoke.verify_deployed_package('https://test.invalid/', '0' * 40, manifest['cache'], resources)
            manifest_result.content_type = 'text/html'
            with self.assertRaises(RuntimeError):
                smoke.verify_deployed_package('https://test.invalid/', self.commit, manifest['cache'], resources)

    def test_redirect_is_blocked_before_following_another_origin(self):
        from urllib.request import Request
        handler = smoke.SameOriginRedirectHandler('https://app.invalid/')
        request = Request('https://app.invalid/start')
        for target in ['https://other.invalid/private', 'http://app.invalid/', 'https://app.invalid:444/']:
            with self.subTest(target=target), self.assertRaises(RuntimeError):
                handler.redirect_request(request, None, 302, 'Found', {}, target)
        redirected = handler.redirect_request(request, None, 302, 'Found', {}, 'https://app.invalid:443/next')
        self.assertEqual(redirected.full_url, 'https://app.invalid:443/next')


if __name__ == '__main__':
    unittest.main()
