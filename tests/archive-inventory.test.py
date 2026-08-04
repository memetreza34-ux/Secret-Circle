#!/usr/bin/env python3
from __future__ import annotations

import json
import stat
import tempfile
import warnings
import zipfile
from pathlib import Path

import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))

from inventory_legacy_archive import (  # noqa: E402
    InventoryError,
    Limits,
    git_blob_sha1,
    inventory_archive,
    main,
    validate_member,
)


def expect_error(fragment: str, action) -> None:
    try:
        action()
    except InventoryError as exc:
        assert fragment.lower() in str(exc).lower(), (fragment, str(exc))
        return
    raise AssertionError(f"InventoryError containing {fragment!r} expected")


def write_zip(path: Path, entries: list[tuple[str, bytes]]) -> None:
    with zipfile.ZipFile(path, "w", compression=zipfile.ZIP_DEFLATED) as bundle:
        for name, content in entries:
            bundle.writestr(name, content)


def main_test() -> int:
    with tempfile.TemporaryDirectory() as temporary:
        temp = Path(temporary)
        valid = temp / "valid.zip"
        write_zip(
            valid,
            [
                ("legacy/package.json", b'{"name":"legacy-secret-circle"}'),
                ("legacy/index.html", b"<!doctype html><title>Secret Circle</title>"),
                ("legacy/src/main.js", b"console.log('legacy');"),
                ("legacy/src/game-engine.js", b"export const rounds = 3;"),
                ("legacy/assets/icon.svg", b"<svg></svg>"),
            ],
        )
        expected_blob = git_blob_sha1(valid)
        inventory = inventory_archive(valid, expected_git_blob=expected_blob)
        assert inventory["archive"]["expectedGitBlobMatched"] is True
        assert inventory["summary"]["files"] == 5
        assert inventory["summary"]["safePaths"] is True
        assert inventory["candidateAppRoots"][0]["root"] == "legacy"
        assert {item["extension"] for item in inventory["extensions"]} >= {
            ".html",
            ".js",
            ".json",
            ".svg",
        }
        assert all(len(item["sha256"]) == 64 for item in inventory["entries"])

        json_output = temp / "inventory.json"
        markdown_output = temp / "inventory.md"
        assert (
            main(
                [
                    str(valid),
                    "--expected-git-blob",
                    expected_blob,
                    "--json",
                    str(json_output),
                    "--markdown",
                    str(markdown_output),
                ]
            )
            == 0
        )
        saved = json.loads(json_output.read_text(encoding="utf-8"))
        assert saved["status"] == "SAFE_INVENTORY_COMPLETE_NO_EXTRACTION"
        assert "Es wurde nichts extrahiert" in markdown_output.read_text(encoding="utf-8")
        assert not (temp / "legacy").exists(), "Inventory must never extract the archive"

        expect_error(
            "git blob mismatch",
            lambda: inventory_archive(valid, expected_git_blob="0" * 40),
        )

        traversal = temp / "traversal.zip"
        write_zip(traversal, [("../evil.txt", b"blocked")])
        expect_error("traversal", lambda: inventory_archive(traversal))

        backslash_traversal = temp / "backslash-traversal.zip"
        write_zip(backslash_traversal, [("..\\evil.txt", b"blocked")])
        expect_error("traversal", lambda: inventory_archive(backslash_traversal))

        absolute = temp / "absolute.zip"
        write_zip(absolute, [("/evil.txt", b"blocked")])
        expect_error("absolute", lambda: inventory_archive(absolute))

        drive = temp / "drive.zip"
        write_zip(drive, [("C:/evil.txt", b"blocked")])
        expect_error("absolute", lambda: inventory_archive(drive))

        case_collision = temp / "case-collision.zip"
        write_zip(
            case_collision,
            [("legacy/App.js", b"one"), ("legacy/app.js", b"two")],
        )
        expect_error("case-colliding", lambda: inventory_archive(case_collision))

        duplicate = temp / "duplicate.zip"
        with warnings.catch_warnings():
            warnings.simplefilter("ignore", UserWarning)
            with zipfile.ZipFile(duplicate, "w") as bundle:
                bundle.writestr("legacy/app.js", b"one")
                bundle.writestr("legacy/app.js", b"two")
        expect_error("duplicate", lambda: inventory_archive(duplicate))

        symlink = temp / "symlink.zip"
        link = zipfile.ZipInfo("legacy/link")
        link.create_system = 3
        link.external_attr = (stat.S_IFLNK | 0o777) << 16
        with zipfile.ZipFile(symlink, "w") as bundle:
            bundle.writestr(link, "target")
        expect_error("symlink", lambda: inventory_archive(symlink))

        encrypted_info = zipfile.ZipInfo("legacy/secret.txt")
        encrypted_info.flag_bits |= 0x1
        expect_error("encrypted", lambda: validate_member(encrypted_info, Limits()))

        bomb = temp / "ratio.zip"
        write_zip(bomb, [("legacy/zeros.bin", b"0" * 1_000_000)])
        expect_error(
            "compression ratio",
            lambda: inventory_archive(
                bomb,
                limits=Limits(
                    max_files=10,
                    max_file_bytes=2_000_000,
                    max_total_bytes=2_000_000,
                    max_compression_ratio=10,
                ),
            ),
        )

        large = temp / "large.zip"
        write_zip(large, [("legacy/large.bin", b"x" * 256)])
        expect_error(
            "per-file limit",
            lambda: inventory_archive(
                large,
                limits=Limits(
                    max_files=10,
                    max_file_bytes=128,
                    max_total_bytes=512,
                    max_compression_ratio=200,
                ),
            ),
        )

        too_many = temp / "many.zip"
        write_zip(too_many, [(f"legacy/{index}.txt", b"x") for index in range(4)])
        expect_error(
            "contains 4 entries",
            lambda: inventory_archive(
                too_many,
                limits=Limits(
                    max_files=3,
                    max_file_bytes=128,
                    max_total_bytes=512,
                    max_compression_ratio=200,
                ),
            ),
        )

        expect_error(
            "must be positive",
            lambda: inventory_archive(valid, limits=Limits(max_files=0)),
        )

        print(
            json.dumps(
                {
                    "ok": True,
                    "validInventory": True,
                    "gitBlobVerification": True,
                    "noExtraction": True,
                    "pathTraversalBlocked": True,
                    "absolutePathsBlocked": True,
                    "caseCollisionsBlocked": True,
                    "duplicatesBlocked": True,
                    "symlinksBlocked": True,
                    "encryptedEntriesBlocked": True,
                    "compressionBombBlocked": True,
                    "fileSizeLimit": True,
                    "entryCountLimit": True,
                    "limitValidation": True,
                }
            )
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main_test())
