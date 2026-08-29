#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE_BLOB = "0bda8a341c6167d83f3a10c2f62fb4efacbd42d7"
TOOL_BLOB = "20cb67dabcb3eb48952faeca98e925f31e086296"
TEST_BLOB = "b08d0cdc2aaaa8dbfff3a07db014097cbb0807a7"

required = {
    "tools/inventory_legacy_archive.py": [
        "expected_git_blob",
        "max_compression_ratio",
        "SAFE_INVENTORY_COMPLETE_NO_EXTRACTION",
        "Case-colliding ZIP paths",
        "Symlink ZIP member rejected",
    ],
    "tests/archive-inventory.test.py": [
        "validInventory",
        "gitBlobVerification",
        "noExtraction",
        "compressionBombBlocked",
        "symlinksBlocked",
    ],
    "docs/LEGACY_ARCHIVE_INVENTORY.md": [
        SOURCE_BLOB,
        "ACTUAL_ARCHIVE_INVENTORY_BLOCKED_BINARY_TRANSFER",
        "DO_NOT_DELETE",
    ],
    "docs/legacy-archive-source.json": [
        "LEGACY_ARCHIVE_TOOLING_GO",
        "BINARY_TRANSFER_UNAVAILABLE_IN_CURRENT_EXECUTION_ENVIRONMENT",
        "hub_archive_deletion_allowed",
    ],
    "docs/ARCHIVE_TOOL_VALIDATION.md": [
        TOOL_BLOB,
        TEST_BLOB,
        "ACTUAL_ARCHIVE_INVENTORY_BLOCKED",
    ],
}

for relative, markers in required.items():
    path = ROOT / relative
    if not path.is_file() or path.stat().st_size < 200:
        raise SystemExit(f"Missing or incomplete archive-tool file: {relative}")
    text = path.read_text(encoding="utf-8")
    for marker in markers:
        if marker.lower() not in text.lower():
            raise SystemExit(f"Missing marker {marker} in {relative}")

source = json.loads((ROOT / "docs/legacy-archive-source.json").read_text(encoding="utf-8"))
if source.get("schema_version") != 1:
    raise SystemExit("Unexpected legacy source schema version")
if source["source"]["git_blob_sha1"] != SOURCE_BLOB:
    raise SystemExit("Legacy source Git blob mismatch")
if source["inventory_tool"]["git_blob_sha1"] != TOOL_BLOB:
    raise SystemExit("Inventory tool Git blob mismatch")
if source["inventory_test"]["git_blob_sha1"] != TEST_BLOB:
    raise SystemExit("Inventory test Git blob mismatch")
if source["actual_archive"]["inventory_executed"] is not False:
    raise SystemExit("Actual archive inventory must remain false until really executed")
if source["actual_archive"]["local_file_available"] is not False:
    raise SystemExit("Actual archive must remain unavailable in this execution record")
if source["deletion"]["hub_archive_deletion_allowed"] is not False:
    raise SystemExit("Hub archive deletion must remain blocked")
if source["deletion"]["status"] != "DO_NOT_DELETE":
    raise SystemExit("Hub archive must remain DO_NOT_DELETE")
if (ROOT / "secret-circle.zip").exists():
    raise SystemExit("Legacy archive must not be copied into the target repository")

print(
    json.dumps(
        {
            "ok": True,
            "sourceBlobPinned": True,
            "toolBlobPinned": True,
            "testBlobPinned": True,
            "syntheticSafetySuiteDocumented": True,
            "actualArchiveInventoryBlocked": True,
            "hubArchiveDeletionBlocked": True,
        }
    )
)
