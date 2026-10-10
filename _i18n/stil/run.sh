#!/usr/bin/env bash
# Пересобрать обе страницы стиля одной командой (из корня репозитория svoiludi):
#   bash _i18n/stil/run.sh <папка репозитория tests (voznesenskaya.ch)> <папка для готовых страниц>
# На выходе:
#   «01 Стиль «Свои люди» — открыть.html»       → _Claude\08_Стиль сайтов\
#   «01 Стиль voznesenskaya.ch — открыть.html»   → _Claude\08_Стиль сайтов\voznesenskaya.ch — коучинг\
set -e
D=$(cd "$(dirname "$0")" && pwd)
TESTS=$(cd "$1" && pwd)
OUT=$2; mkdir -p "$OUT"; OUT=$(cd "$OUT" && pwd)
python3 -I "$D/svoi/build_page.py" "$TESTS" "$OUT/01 Стиль «Свои люди» — открыть.html"
rm -rf "$D/vz/shots"
NODE_PATH=$(npm root -g) node "$D/vz/shots.js" "$TESTS" "$D/vz/shots" | grep -v '^ok' || true
NODE_PATH=$(npm root -g) node "$D/vz/build.js" "$TESTS" "$D/vz/shots" "$OUT/01 Стиль voznesenskaya.ch — открыть.html"
