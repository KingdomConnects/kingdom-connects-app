#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

PROJECT_ID="${PROJECT_ID:-kingdom-commerce}"
FILE="${FILE:-_2-kingdom-connects-backup.tar.gz}"

# 1) Locate archive in Downloads
termux-setup-storage >/dev/null 2>&1 || true
CANDS=("$HOME/storage/downloads/$FILE" "/sdcard/Download/$FILE" "/sdcard/Downloads/$FILE")
SRC=""
for p in "${CANDS[@]}"; do [ -f "$p" ] && SRC="$p" && break; done
[ -n "$SRC" ] || { echo "❌ Archive not found in Downloads: $FILE"; exit 1; }

# 2) Prep paths
TMP="$HOME/tmp_kc_unpack"
DST="$HOME/storage/shared/Acode/kingdom-connects"
mkdir -p "$TMP" "$DST"

# 3) Clean temp; extract with excludes to avoid symlink errors
rm -rf "$TMP" && mkdir -p "$TMP"
tar -xzf "$SRC" -C "$TMP" \
  --exclude='.cache' \
  --exclude='.pythonlibs' \
  --exclude='node_modules' \
  --exclude='**/.git*' \
  --exclude='**/.replit*' \
  --exclude='**/.nix-profile*' \
  --no-same-owner || { echo "❌ Extract failed"; exit 1; }

# 4) Copy only web project files into Acode folder
#    (adjust list if you’ve added new top-level folders)
for d in admin business-admin church-admin marketing-manager js styles assets img docs sales; do
  [ -d "$TMP/$d" ] && (rm -rf "$DST/$d"; cp -R "$TMP/$d" "$DST/")
done
for f in index.html login.html signup.html pricing.html privacy.html terms.html \
         submit_business.html submit_church.html submit_review.html \
         businesses_by_church.html church_directory.html business.html church.html \
         seed_commissions.html for-*.html contact.html testimonials.html \
         firestore.rules storage.rules firebase.json .firebaserc; do
  [ -f "$TMP/$f" ] && cp "$TMP/$f" "$DST/"
done

cd "$DST"

# 5) Sanity: ensure rules + firebase.json exist
[ -f firestore.rules ] || { echo "⚠️ firestore.rules missing in archive"; }
[ -f storage.rules ]   || { echo "⚠️ storage.rules missing in archive"; }
[ -f firebase.json ]   || { echo "⚠️ firebase.json missing in archive"; }

# 6) Deploy rules + hosting (no seeding; Firebase CLI doesn’t support document create)
npm i -g firebase-tools@latest >/dev/null 2>&1 || true
echo "🚀 Deploying Hosting + Firestore rules + Storage rules to $PROJECT_ID…"
firebase deploy --only firestore:rules,storage,hosting --project "$PROJECT_ID"

echo
echo "✅ Done."
echo "   Project: $PROJECT_ID"
echo "   Source : $SRC"
echo "   Deployed hosting + rules from: $DST"
echo "   (Note: data seeding must be done via Firestore console or REST; CLI lacks documents:set.)"
