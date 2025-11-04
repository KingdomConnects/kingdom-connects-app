#!/data/data/com.termux/files/usr/bin/bash
cd /storage/emulated/0/DCIM/Acode/kingdom-commerce-site
fuser -k 8080/tcp 2>/dev/null || true
python3 -m http.server 8080
