#!/usr/bin/env python3
"""Encode preview-only AVIFs without resizing or modifying production art.

Input (stdin JSON): assets [{key,path}], optional quality (default 50).
Output (stdout JSON): assetUrls and an encoding report. A content-addressed
temporary cache avoids repeating expensive encoding when UI code changes.
"""
from concurrent.futures import ThreadPoolExecutor
from io import BytesIO
from pathlib import Path
import base64
import hashlib
import json
import sys
import tempfile

from PIL import Image, __version__ as pillow_version, features


def main():
    request = json.load(sys.stdin)
    if not features.check("avif"):
        raise RuntimeError("Pillow must support AVIF for the inline preview")
    quality = int(request.get("quality", 50))
    if not 0 <= quality <= 100:
        raise ValueError("quality must be within 0..100")
    cache = Path(tempfile.gettempdir()) / "fourfold-preview-avif"
    cache.mkdir(parents=True, exist_ok=True)

    def encode(asset):
        path = Path(asset["path"])
        original = path.read_bytes()
        key = hashlib.sha256(original + f"avif-q{quality}-speed6-{pillow_version}".encode()).hexdigest()
        target = cache / f"{key}.avif"
        with Image.open(BytesIO(original)) as source:
            size = source.size
            if not target.exists():
                buffer = BytesIO()
                source.convert("RGB").save(buffer, "AVIF", quality=quality, speed=6)
                target.write_bytes(buffer.getvalue())
        encoded = target.read_bytes()
        with Image.open(BytesIO(encoded)) as verified:
            if verified.size != size:
                raise AssertionError(f"Preview encoding changed dimensions: {path}")
        return asset["key"], "data:image/avif;base64," + base64.b64encode(encoded).decode("ascii"), {
            "key": asset["key"], "dimensions": list(size), "bytes": len(encoded),
            "sourceSha256": hashlib.sha256(original).hexdigest(),
        }

    with ThreadPoolExecutor(max_workers=4) as executor:
        rows = list(executor.map(encode, request["assets"]))
    json.dump({
        "assetUrls": {key: url for key, url, _ in rows},
        "report": {"format": "AVIF", "quality": quality, "resized": False,
                   "images": [row[2] for row in rows]},
    }, sys.stdout, ensure_ascii=False, separators=(",", ":"))


if __name__ == "__main__":
    main()
