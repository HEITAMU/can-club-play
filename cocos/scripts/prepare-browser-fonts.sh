#!/usr/bin/env bash
set -euo pipefail

# QA machine fonts only; never copied into game assets or the WeChat package.
# Official Noto CJK Sans 2.004, pinned to its release commit (SIL OFL 1.1).
font_dir="${CAN_CLUB_QA_FONT_DIR:-$HOME/.local/share/fonts/can-club-qa}"
font_base='https://raw.githubusercontent.com/notofonts/noto-cjk/523d033d6cb47f4a80c58a35753646f5c3608a78/Sans/OTF/SimplifiedChinese'
mkdir -p "$font_dir"

while read -r checksum filename; do
  if [[ ! -f "$font_dir/$filename" ]] || ! printf '%s  %s\n' "$checksum" "$font_dir/$filename" | sha256sum --check --status; then
    curl --fail --location --silent --show-error --retry 1 --retry-all-errors \
      --connect-timeout 15 --max-time 60 "$font_base/$filename" -o "$font_dir/$filename.download"
    printf '%s  %s\n' "$checksum" "$font_dir/$filename.download" | sha256sum --check
    mv "$font_dir/$filename.download" "$font_dir/$filename"
  fi
done <<'FONTS'
2c76254f6fc379fddfce0a7e84fb5385bb135d3e399294f6eeb6680d0365b74b NotoSansCJKsc-Regular.otf
b5f0d1a190a7f9b43c310a8850630af12553df32c4c050543f9059732d9b4c0a NotoSansCJKsc-Bold.otf
FONTS

fc-cache -f "$font_dir"
fc-scan --format '%{family}: %{style}\n' "$font_dir/NotoSansCJKsc-Regular.otf" "$font_dir/NotoSansCJKsc-Bold.otf"
