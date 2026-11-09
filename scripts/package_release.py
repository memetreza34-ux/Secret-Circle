#!/usr/bin/env python3
"""Unveränderte statische App aus einem Git-Commit paketieren, nie das Repository."""
from __future__ import annotations

import argparse
import hashlib
import io
import json
import re
import stat
import subprocess
import sys
import uuid
import zipfile
from pathlib import Path, PurePosixPath

import offline_core_lock as offline

ROOT = Path(__file__).resolve().parents[1]
FORMAT = 'secret-circle-release-v1'
MANIFEST = 'release-build.json'
EXTRAS = ('sw.js', '_headers', 'THIRD_PARTY_NOTICES.md')
BLOCKED_PARTS = {'.git', '.github', '.cache', 'node_modules', 'tests', 'scripts', 'tools', 'docs', 'dist', 'release'}
RUNTIME_SUFFIXES = {'.js', '.css', '.html', '.webmanifest', '.svg', '.png', '.webp', '.avif', '.woff', '.woff2', '.ico', '.jpg', '.jpeg', '.gif'}
FONT_LICENSES = {
    # Offizielle OFL-Texte, nur LF-Zeilenenden und entfernte Leerzeichen am Zeilenende.
    'fonts/figtree-': ('FIGTREE', 'bb272dfcd8801eb31fb98fe51828f76f0e41ac82f89256101df8021aa3d30ce2'),
    'fonts/archivo-black-': ('ARCHIVO_BLACK', '4cafdbbd100af37a23805af09b7068e4daafb4516dc3d6d52436f4a9d7b4c0d3'),
}


def safe_name(name):
    if not isinstance(name, str):
        raise ValueError('Paketpfad muss Text sein.')
    path = PurePosixPath(name)
    if (not isinstance(name, str) or not name or str(path) != name or path.is_absolute()
            or any(part in {'.', '..', ''} or part.startswith('.') for part in path.parts)
            or set(path.parts) & BLOCKED_PARTS or '\\' in name or ':' in name
            or not re.fullmatch(r'[A-Za-z0-9_./-]+', name)):
        raise ValueError(f'Nicht erlaubter Paketpfad: {name!r}')
    if name not in EXTRAS and path.suffix not in RUNTIME_SUFFIXES:
        raise ValueError(f'Keine öffentliche App-Datei: {name}')
    return name


def no_symlinks(path, boundary):
    if path != boundary and boundary not in path.parents:
        raise ValueError('Pfad außerhalb des vorgesehenen Verzeichnisses.')
    current = path
    while True:
        if current.is_symlink():
            raise ValueError('Symlinks sind hier nicht erlaubt.')
        if current == boundary:
            return
        current = current.parent


def git(*args, root=ROOT):
    return subprocess.check_output(['git', *args], cwd=root, stderr=subprocess.PIPE)


def commit_for(ref='HEAD', root=ROOT):
    if ref != 'HEAD' and not re.fullmatch(r'[0-9a-f]{40}', ref):
        raise ValueError('Quelle muss HEAD oder ein vollständiger Commit-SHA sein.')
    return git('rev-parse', '--verify', ref + '^{commit}', root=root).decode().strip()


def public_names(sw):
    paths = offline.core_paths(sw)
    if len(set(paths)) != len(paths):
        raise ValueError('Doppelte CORE-Dateien.')
    names = set(paths) | set(EXTRAS)
    for name in names:
        safe_name(name)
    return names


def load_commit(ref='HEAD', root=ROOT):
    commit = commit_for(ref, root)
    sw = git('show', commit + ':sw.js', root=root).decode('utf-8')
    names = public_names(sw)
    # release-meta gehört nur zur Prüfung, nicht in das öffentliche Paket.
    archive = git('archive', '--format=zip', commit, '--', *sorted(names | {'release-meta.json'}), root=root)
    with zipfile.ZipFile(io.BytesIO(archive)) as source:
        entries = {entry.filename: entry for entry in source.infolist() if not entry.is_dir()}
        if set(entries) != names | {'release-meta.json'}:
            raise ValueError('Der Commit enthält nicht alle Paketdateien.')
        if any(stat.S_ISLNK(entry.external_attr >> 16) for entry in entries.values()):
            raise ValueError('Symlinks sind im Veröffentlichungspaket nicht erlaubt.')
        files = {name: source.read(name) for name in names}
        meta = json.loads(source.read('release-meta.json'))
    return files, make_manifest(files, meta, commit)


def load_worktree(root=ROOT):
    sw = (root / 'sw.js').read_text(encoding='utf-8')
    files = {}
    for name in public_names(sw):
        file = root / name
        no_symlinks(file, root)
        files[name] = file.read_bytes()
    meta = json.loads((root / 'release-meta.json').read_text(encoding='utf-8'))
    return files, make_manifest(files, meta, commit_for(root=root))


def make_manifest(files, meta, commit):
    sw = files['sw.js'].decode('utf-8')
    generation = offline.generation(sw)
    digest = offline.core_hash(sw, files.__getitem__)
    cache = f'secret-circle-v{generation}'
    if (meta['offlineCache']['coreHash'] != digest or meta['offlineCache']['production'] != cache
            or meta['offlineCache']['staging'] != cache + '-staging'):
        raise ValueError('Offline-Core und Release-Metadaten stimmen nicht überein.')
    return {
        'format': FORMAT, 'commit': commit, 'appVersion': meta['packageVersion'],
        'cache': cache, 'coreHash': digest,
        'files': {name: {'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()}
                  for name, data in sorted(files.items())}
    }


def manifest_bytes(manifest):
    return (json.dumps(manifest, ensure_ascii=False, sort_keys=True, indent=2) + '\n').encode('utf-8')


def assert_font_notices(files):
    fonts = [name for name in files if name.endswith(('.woff', '.woff2', '.ttf', '.otf'))]
    text = files.get('THIRD_PARTY_NOTICES.md', b'').decode('utf-8').replace('\r\n', '\n')
    for name in fonts:
        license_record = next((record for prefix, record in FONT_LICENSES.items() if name.startswith(prefix)), None)
        if not license_record:
            raise ValueError(f'Schrift ohne geprüften Lizenztext: {name}')
        label, digest = license_record
        block = re.search(r'<!-- BEGIN_FONT_LICENSE_' + label + r' -->\n(.*?)<!-- END_FONT_LICENSE_' + label + r' -->', text, re.S)
        if not block or hashlib.sha256(block[1].encode('utf-8')).hexdigest() != digest:
            raise ValueError(f'Vollständiger unveränderter Schrift-Lizenztext fehlt: {name}')


def check_manifest(manifest, expected_commit=None):
    if not isinstance(manifest, dict) or manifest.get('format') != FORMAT:
        raise ValueError('Ungültiges Paketmanifest.')
    for key, pattern in [('commit', r'[0-9a-f]{40}'), ('cache', r'secret-circle-v\d+'), ('coreHash', r'[0-9a-f]{64}')]:
        if not isinstance(manifest.get(key), str) or not re.fullmatch(pattern, manifest[key]):
            raise ValueError(f'Ungültiges Manifestfeld: {key}')
    if expected_commit and manifest['commit'] != expected_commit:
        raise ValueError('Das Paket stammt nicht vom erwarteten Commit.')
    entries = manifest.get('files')
    if not isinstance(entries, dict) or not 1 <= len(entries) <= 500:
        raise ValueError('Ungültige Dateiliste im Paketmanifest.')
    for name, entry in entries.items():
        safe_name(name)
        if (not isinstance(entry, dict) or type(entry.get('bytes')) is not int or not 0 <= entry['bytes'] <= 3_000_000
                or not isinstance(entry.get('sha256'), str) or not re.fullmatch(r'[0-9a-f]{64}', entry['sha256'])):
            raise ValueError(f'Ungültige Dateiprüfsumme: {name}')
    if sum(entry['bytes'] for entry in entries.values()) > 5_000_000:
        raise ValueError('Das Paket überschreitet das Übertragungslimit von 5 MB.')
    if not set(EXTRAS) <= set(entries) or MANIFEST in entries:
        raise ValueError('Unvollständiges oder rekursives Paketmanifest.')


def verify_site(site, expected_commit=None, source_root=ROOT):
    if site.is_symlink():
        raise ValueError('Das Paketverzeichnis ist ein Symlink.')
    manifest = json.loads((site / MANIFEST).read_text(encoding='utf-8'))
    check_manifest(manifest, expected_commit)
    if expected_commit:
        _, trusted = load_commit(expected_commit, root=source_root)
        if manifest != trusted:
            raise ValueError('Das Paketmanifest stimmt nicht mit den echten Git-Dateien des erwarteten Commits überein.')
    actual = {file.relative_to(site).as_posix() for file in site.rglob('*') if file.is_file() or file.is_symlink()}
    if actual != set(manifest['files']) | {MANIFEST}:
        raise ValueError('Fremde oder fehlende Datei im Paketverzeichnis.')
    files = {}
    for name, entry in manifest['files'].items():
        file = site / name
        no_symlinks(file, site)
        data = file.read_bytes()
        if len(data) != entry['bytes'] or hashlib.sha256(data).hexdigest() != entry['sha256']:
            raise ValueError(f'Paketdatei verändert: {name}')
        files[name] = data
    sw = files['sw.js'].decode('utf-8')
    if public_names(sw) != set(files) or offline.core_hash(sw, files.__getitem__) != manifest['coreHash']:
        raise ValueError('Paket und Offline-CORE stimmen nicht überein.')
    if expected_commit:
        assert_font_notices(files)
    return manifest


def write_package(files, manifest, site, archive):
    check_manifest(manifest)
    assert_font_notices(files)
    if site.exists() and any(site.iterdir()):
        # Nur das eigene, vollständig geprüfte vorige Paket ersetzen. Keine fremden Dateien löschen.
        previous = verify_site(site)
        obsolete = set(previous['files']) - set(files)
    else:
        obsolete = set()
    if archive.is_symlink() or (archive.exists() and not archive.is_file()):
        raise ValueError('Ungültiges ZIP-Ziel.')
    payload = {**files, MANIFEST: manifest_bytes(manifest)}
    site.mkdir(parents=True, exist_ok=True)
    for name, data in payload.items():
        target = site / name
        target.parent.mkdir(parents=True, exist_ok=True)
        temporary = target.with_name(target.name + '.' + uuid.uuid4().hex + '.tmp')
        temporary.write_bytes(data)
        temporary.replace(target)
    for name in obsolete:
        (site / name).unlink()
    verify_site(site)
    archive.parent.mkdir(parents=True, exist_ok=True)
    temporary = archive.with_name(archive.name + '.' + uuid.uuid4().hex + '.tmp')
    with zipfile.ZipFile(temporary, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as target:
        for name, data in sorted(payload.items()):
            entry = zipfile.ZipInfo(name, date_time=(1980, 1, 1, 0, 0, 0))
            entry.create_system = 3
            entry.external_attr = 0o100644 << 16
            entry.compress_type = zipfile.ZIP_DEFLATED
            target.writestr(entry, data, compresslevel=9)
    temporary.replace(archive)


def output_path(value, directory):
    base = ROOT / directory
    path = ROOT / value
    no_symlinks(path, ROOT)
    resolved = path.resolve()
    if resolved == base or base not in resolved.parents:
        raise ValueError(f'Ausgabe muss innerhalb von {directory}/ liegen.')
    return resolved


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--ref', default='HEAD')
    parser.add_argument('--output', default='dist/site')
    parser.add_argument('--archive', default='release/secret-circle.zip')
    parser.add_argument('--verify', action='store_true')
    parser.add_argument('--expected-commit')
    args = parser.parse_args()
    site = output_path(args.output, 'dist')
    if args.verify:
        manifest = verify_site(site, args.expected_commit or commit_for(args.ref))
    else:
        files, manifest = load_commit(args.ref)
        # Ein Paket aus einem älteren Commit trotz lokaler Änderungen ist nur mit explizitem --ref erlaubt.
        if args.ref == 'HEAD' and git('diff', 'HEAD', '--', *sorted(set(files) | {'release-meta.json'})):
            raise ValueError('App-Dateien sind uncommitted. Erst committen oder ausdrücklich --ref <SHA> verwenden.')
        write_package(files, manifest, site, output_path(args.archive, 'release'))
    print(json.dumps({'release_package': 'PASS', 'commit': manifest['commit'], 'cache': manifest['cache'],
                      'files': len(manifest['files']), 'site': str(site), 'public_release': 'NOT_AUTHORIZED'}, indent=2))


if __name__ == '__main__':
    try:
        main()
    except (ValueError, KeyError, OSError, subprocess.CalledProcessError, zipfile.BadZipFile) as error:
        print(f'RELEASE_PACKAGE_FAIL: {error}', file=sys.stderr)
        sys.exit(1)
