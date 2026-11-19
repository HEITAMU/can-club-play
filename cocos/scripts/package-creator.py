"""Package the fully prepared Creator project; no installed toolchain or caches."""
import hashlib
import json
from pathlib import Path
import zipfile

root = Path(__file__).resolve().parents[1]
out = root / "build" / "CanClub-Creator-3.8.8.zip"
excluded = {"build", "node_modules", "temp", "library", "local", "profiles", "logs", "qa", ".git"}
manifest = json.loads((root / "asset-manifest.json").read_text())
for key, entry in manifest["assets"].items():
    file = root / "assets" / "resources" / entry["path"]
    if not file.is_file() or not Path(str(file) + ".meta").is_file():
        raise RuntimeError(f"Prepared Creator image or metadata missing: {key}")
for name in ["assets/scenes/Main.scene", "assets/resources/effects/canclub-painted-blend.effect", "package.json", "settings/v2/packages/project.json"]:
    if not (root / name).is_file():
        raise RuntimeError(f"Required project file missing: {name}")
files = [file for file in sorted(root.rglob("*")) if file.is_file() and not file.is_symlink()
         and file.relative_to(root).parts[0] not in excluded
         and not file.name.endswith(".log") and file.name != ".DS_Store"]
out.parent.mkdir(parents=True, exist_ok=True)
with zipfile.ZipFile(out, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
    for file in files:
        archive.write(file, str(Path("can-club-cocos") / file.relative_to(root)))
report = {"archive": out.name, "creatorVersion": "3.8.8", "files": len(files),
          "importedTextures": len(manifest["assets"]), "includesImportedPngAndMeta": True,
          "bytes": out.stat().st_size, "sha256": hashlib.sha256(out.read_bytes()).hexdigest(),
          "excludes": sorted(excluded), "open": "can-club-cocos/", "editorImportVerified": False}
(out.parent / "Creator-ZIP-REPORT.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
print(json.dumps(report, ensure_ascii=False))
