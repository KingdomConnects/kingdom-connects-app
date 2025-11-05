#!/data/data/com.termux/files/usr/bin/bash
set -e

URL="http://127.0.0.1:8080/admin/"

echo "[serve] cd to project…"
cd /storage/emulated/0/DCIM/Acode/kingdom-commerce-site

echo "[serve] kill old server on 8080 (ok if none)…"
pkill -f "python3 -m http.server 8080" 2>/dev/null || true

echo "[serve] start python server…"
python3 -m http.server 8080 >/dev/null 2>&1 &

# brief wait so the port is ready
sleep 1

echo "[serve] open browser to $URL …"
if command -v termux-open-url >/dev/null 2>&1; then
  termux-open-url "$URL"
else
  am start -a android.intent.action.VIEW -d "$URL" com.android.chrome >/dev/null 2>&1 \
    || am start -a android.intent.action.VIEW -d "$URL" >/dev/null 2>&1
fi

echo "[serve] done."
