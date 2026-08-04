#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
import re
import stat
import sys
import zipfile
from collections import Counter, defaultdict
from dataclasses import dataclass
from pathlib import Path, PurePosixPath
from typing import BinaryIO

CHUNK_SIZE = 1024 * 1024
DEFAULT_MAX_FILES = 5_000
DEFAULT_MAX_FILE_BYTES = 50 * 1024 * 1024
DEFAULT_MAX_TOTAL_BYTES = 500 * 1024 * 1024
DEFAULT_MAX_COMPRESSION_RATIO = 200.0
ALLOWED_COMPRESSION = {
    zipfile.ZIP_STORED,
    zipfile.ZIP_DEFLATED,
    zipfile.ZIP_BZIP2,
    zipfile.ZIP_LZMA,
}
APP_MARKERS = {
    "package.json": 5,
    "index.html": 4,
    "manifest.webmanifest": 4,
    "vite.config.ts": 3,
    "vite.config.js": 3,
    "app.js": 2,
    "game-engine.js": 2,
    "src/main.tsx": 4,
    "src/main.jsx": 4,
    "src/main.ts": 4,
    "src/main.js": 4,
}
TEXT_EXTENSIONS = {
    ".css", ".html", ".js", ".json", ".jsx", ".md", ".mjs",
    ".svg", ".ts", ".tsx", ".txt", ".webmanifest", ".yml", ".yaml",
}


class InventoryError(RuntimeError):
    pass


@dataclass(frozen=True)
class Limits:
    max_files: int = DEFAULT_MAX_FILES
    max_file_bytes: int = DEFAULT_MAX_FILE_BYTES
    max_total_bytes: int = DEFAULT_MAX_TOTAL_BYTES
    max_compression_ratio: float = DEFAULT_MAX_COMPRESSION_RATIO

    def validate(self) -> None:
        if self.max_files < 1:
            raise InventoryError("max_files must be positive")
        if self.max_file_bytes < 1 or self.max_total_bytes < 1:
            raise InventoryError("size limits must be positive")
        if self.max_file_bytes > self.max_total_bytes:
            raise InventoryError("per-file limit must not exceed total-size limit")
        if self.max_compression_ratio < 1:
            raise InventoryError("compression-ratio limit must be at least 1")


def digest_file(path: Path, algorithm: str) -> str:
    digest = hashlib.new(algorithm)
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(CHUNK_SIZE), b""):
            digest.update(chunk)
    return digest.hexdigest()


def git_blob_sha1(path: Path) -> str:
    size = path.stat().st_size
    digest = hashlib.sha1()
    digest.update(f"blob {size}\0".encode("ascii"))
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(CHUNK_SIZE), b""):
            digest.update(chunk)
    return digest.hexdigest()


def normalized_member_path(raw_name: str) -> str:
    if not raw_name or "\x00" in raw_name:
        raise InventoryError("ZIP member has an empty name or NUL byte")
    name = raw_name.replace("\\", "/")
    if name.startswith("/") or re.match(r"^[A-Za-z]:/", name):
        raise InventoryError(f"Absolute ZIP path rejected: {raw_name!r}")
    parts = PurePosixPath(name).parts
    if any(part == ".." for part in parts):
        raise InventoryError(f"Traversal ZIP path rejected: {raw_name!r}")
    canonical = str(PurePosixPath(name))
    if canonical in {"", "."}:
        raise InventoryError(f"Invalid ZIP member path: {raw_name!r}")
    return canonical


def is_symlink(info: zipfile.ZipInfo) -> bool:
    return stat.S_ISLNK((info.external_attr >> 16) & 0xFFFF)


def compression_ratio(info: zipfile.ZipInfo) -> float:
    if info.file_size == 0:
        return 0.0
    return info.file_size / max(info.compress_size, 1)


def validate_member(info: zipfile.ZipInfo, limits: Limits) -> str:
    canonical = normalized_member_path(info.filename)
    if info.flag_bits & 0x1:
        raise InventoryError(f"Encrypted ZIP member rejected: {info.filename!r}")
    if is_symlink(info):
        raise InventoryError(f"Symlink ZIP member rejected: {info.filename!r}")
    if info.compress_type not in ALLOWED_COMPRESSION:
        raise InventoryError(
            f"Unsupported compression method {info.compress_type}: {info.filename!r}"
        )
    if not info.is_dir() and info.file_size > limits.max_file_bytes:
        raise InventoryError(
            f"ZIP member exceeds per-file limit: {info.filename!r} ({info.file_size} bytes)"
        )
    ratio = compression_ratio(info)
    if not info.is_dir() and ratio > limits.max_compression_ratio:
        raise InventoryError(
            f"Suspicious compression ratio {ratio:.1f}:1: {info.filename!r}"
        )
    return canonical


def hash_member(handle: BinaryIO, expected_size: int) -> tuple[str, int]:
    digest = hashlib.sha256()
    total = 0
    while True:
        chunk = handle.read(CHUNK_SIZE)
        if not chunk:
            break
        total += len(chunk)
        if total > expected_size:
            raise InventoryError("Decompressed ZIP member exceeded declared size")
        digest.update(chunk)
    if total != expected_size:
        raise InventoryError(
            f"Decompressed size mismatch: expected {expected_size}, received {total}"
        )
    return digest.hexdigest(), total


def candidate_roots(paths: list[str]) -> list[dict]:
    scores: dict[str, int] = defaultdict(int)
    markers: dict[str, set[str]] = defaultdict(set)
    for path in paths:
        for marker, weight in APP_MARKERS.items():
            if path == marker:
                root = "."
            elif path.endswith("/" + marker):
                root = path[: -len(marker) - 1] or "."
            else:
                continue
            scores[root] += weight
            markers[root].add(marker)
    return [
        {"root": root, "score": score, "markers": sorted(markers[root])}
        for root, score in sorted(scores.items(), key=lambda item: (-item[1], item[0]))
    ]


def inventory_archive(
    archive: Path,
    *,
    limits: Limits = Limits(),
    expected_git_blob: str | None = None,
) -> dict:
    limits.validate()
    archive = archive.resolve()
    if not archive.is_file():
        raise InventoryError(f"Archive not found: {archive}")
    if not zipfile.is_zipfile(archive):
        raise InventoryError("Input is not a valid ZIP archive")

    actual_git_blob = git_blob_sha1(archive)
    if expected_git_blob and actual_git_blob != expected_git_blob.lower():
        raise InventoryError(
            f"Git blob mismatch: expected {expected_git_blob.lower()}, got {actual_git_blob}"
        )

    entries: list[dict] = []
    file_paths: list[str] = []
    seen_exact: set[str] = set()
    seen_casefold: dict[str, str] = {}
    extension_counts: Counter[str] = Counter()
    top_level_counts: Counter[str] = Counter()
    total_uncompressed = 0
    total_compressed = 0

    try:
        with zipfile.ZipFile(archive, "r") as bundle:
            infos = bundle.infolist()
            if len(infos) > limits.max_files:
                raise InventoryError(
                    f"Archive contains {len(infos)} entries; limit is {limits.max_files}"
                )

            # Metadata limits are checked before any member is decompressed.
            for info in infos:
                validate_member(info, limits)
                if not info.is_dir():
                    total_uncompressed += info.file_size
                    if total_uncompressed > limits.max_total_bytes:
                        raise InventoryError(
                            "Archive exceeds total uncompressed-size limit: "
                            f"{total_uncompressed} > {limits.max_total_bytes}"
                        )

            total_uncompressed = 0
            for info in infos:
                canonical = validate_member(info, limits)
                if canonical in seen_exact:
                    raise InventoryError(f"Duplicate ZIP member path: {canonical!r}")
                seen_exact.add(canonical)
                folded = canonical.casefold()
                previous = seen_casefold.get(folded)
                if previous is not None and previous != canonical:
                    raise InventoryError(
                        f"Case-colliding ZIP paths rejected: {previous!r} and {canonical!r}"
                    )
                seen_casefold[folded] = canonical
                top_level_counts[PurePosixPath(canonical).parts[0]] += 1

                if info.is_dir():
                    entries.append(
                        {
                            "path": canonical,
                            "type": "directory",
                            "compressedBytes": info.compress_size,
                            "uncompressedBytes": 0,
                        }
                    )
                    continue

                total_uncompressed += info.file_size
                total_compressed += info.compress_size
                try:
                    with bundle.open(info, "r") as handle:
                        digest, bytes_read = hash_member(handle, info.file_size)
                except zipfile.BadZipFile as exc:
                    raise InventoryError(
                        f"ZIP CRC or structure validation failed for {canonical!r}: {exc}"
                    ) from exc

                suffix = PurePosixPath(canonical).suffix.lower() or "[no-extension]"
                extension_counts[suffix] += 1
                file_paths.append(canonical)
                entries.append(
                    {
                        "path": canonical,
                        "type": "file",
                        "extension": suffix,
                        "compressedBytes": info.compress_size,
                        "uncompressedBytes": bytes_read,
                        "compressionRatio": round(compression_ratio(info), 3),
                        "sha256": digest,
                        "textCandidate": suffix in TEXT_EXTENSIONS,
                    }
                )
    except zipfile.BadZipFile as exc:
        raise InventoryError(f"Invalid ZIP structure: {exc}") from exc
    except RuntimeError as exc:
        raise InventoryError(f"ZIP member could not be read: {exc}") from exc

    result = {
        "schemaVersion": 1,
        "archive": {
            "fileName": archive.name,
            "byteSize": archive.stat().st_size,
            "sha256": digest_file(archive, "sha256"),
            "gitBlobSha1": actual_git_blob,
            "expectedGitBlobMatched": expected_git_blob is None
            or actual_git_blob == expected_git_blob.lower(),
        },
        "limits": {
            "maxFiles": limits.max_files,
            "maxFileBytes": limits.max_file_bytes,
            "maxTotalBytes": limits.max_total_bytes,
            "maxCompressionRatio": limits.max_compression_ratio,
        },
        "summary": {
            "entries": len(entries),
            "files": len(file_paths),
            "directories": len(entries) - len(file_paths),
            "compressedBytesFromHeaders": total_compressed,
            "uncompressedBytes": total_uncompressed,
            "overallCompressionRatio": round(
                total_uncompressed / max(total_compressed, 1), 3
            ),
            "safePaths": True,
            "symlinks": 0,
            "encryptedEntries": 0,
            "duplicatePaths": 0,
            "caseCollisions": 0,
        },
        "topLevel": [
            {"name": name, "entries": count}
            for name, count in sorted(top_level_counts.items())
        ],
        "extensions": [
            {"extension": extension, "files": count}
            for extension, count in sorted(extension_counts.items())
        ],
        "candidateAppRoots": candidate_roots(file_paths),
        "entries": sorted(entries, key=lambda item: item["path"]),
        "status": "SAFE_INVENTORY_COMPLETE_NO_EXTRACTION",
    }
    return result


def markdown_report(inventory: dict) -> str:
    archive = inventory["archive"]
    summary = inventory["summary"]
    lines = [
        "# Legacy-Archiv-Inventar", "", f"Archiv: `{archive['fileName']}`", "",
        "## Prüfsummen", "", f"- Größe: `{archive['byteSize']}` Bytes",
        f"- SHA-256: `{archive['sha256']}`",
        f"- Git-Blob-SHA-1: `{archive['gitBlobSha1']}`",
        f"- erwarteter Git-Blob bestätigt: `{str(archive['expectedGitBlobMatched']).lower()}`",
        "", "## Sicherheitsprüfung", "", f"- Einträge: `{summary['entries']}`",
        f"- Dateien: `{summary['files']}`",
        f"- Verzeichnisse: `{summary['directories']}`",
        f"- unkomprimiert: `{summary['uncompressedBytes']}` Bytes",
        f"- Pfade sicher: `{str(summary['safePaths']).lower()}`",
        "- Symlinks: `0`", "- verschlüsselte Einträge: `0`",
        "- doppelte Pfade: `0`", "- Groß-/Kleinschreibungs-Kollisionen: `0`",
        "", "## Kandidaten für App-Wurzeln", "",
    ]
    roots = inventory.get("candidateAppRoots") or []
    if roots:
        for root in roots:
            lines.append(
                f"- `{root['root']}` – Score {root['score']}; Marker: "
                + ", ".join(f"`{item}`" for item in root["markers"])
            )
    else:
        lines.append("- Keine eindeutige App-Wurzel erkannt.")
    lines.extend(["", "## Dateitypen", ""])
    for item in inventory.get("extensions", []):
        lines.append(f"- `{item['extension']}`: {item['files']}")
    lines.extend(
        [
            "", "## Grenze", "",
            "Das Archiv wurde ausschließlich gelesen und gehasht. Es wurde nichts extrahiert oder ausgeführt.",
            "", f"Status: `{inventory['status']}`.", "",
        ]
    )
    return "\n".join(lines)


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Safely inventory a legacy ZIP archive without extracting it."
    )
    parser.add_argument("archive", type=Path)
    parser.add_argument("--json", dest="json_path", type=Path)
    parser.add_argument("--markdown", dest="markdown_path", type=Path)
    parser.add_argument("--expected-git-blob")
    parser.add_argument("--max-files", type=int, default=DEFAULT_MAX_FILES)
    parser.add_argument("--max-file-bytes", type=int, default=DEFAULT_MAX_FILE_BYTES)
    parser.add_argument("--max-total-bytes", type=int, default=DEFAULT_MAX_TOTAL_BYTES)
    parser.add_argument(
        "--max-compression-ratio", type=float, default=DEFAULT_MAX_COMPRESSION_RATIO
    )
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv or sys.argv[1:])
    try:
        inventory = inventory_archive(
            args.archive,
            limits=Limits(
                max_files=args.max_files,
                max_file_bytes=args.max_file_bytes,
                max_total_bytes=args.max_total_bytes,
                max_compression_ratio=args.max_compression_ratio,
            ),
            expected_git_blob=args.expected_git_blob,
        )
    except InventoryError as exc:
        print(json.dumps({"ok": False, "error": str(exc)}, ensure_ascii=False))
        return 2

    rendered = json.dumps(inventory, ensure_ascii=False, indent=2) + "\n"
    if args.json_path:
        args.json_path.parent.mkdir(parents=True, exist_ok=True)
        args.json_path.write_text(rendered, encoding="utf-8")
    else:
        print(rendered, end="")
    if args.markdown_path:
        args.markdown_path.parent.mkdir(parents=True, exist_ok=True)
        args.markdown_path.write_text(markdown_report(inventory), encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
