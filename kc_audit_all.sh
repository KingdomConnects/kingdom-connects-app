#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

# === pretty output
ok(){ echo -e "✔ $*"; }
warn(){ echo -e "▲ $*"; }
err(){ echo -e "✖ $*"; }

# === flags
FIX=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --fix) FIX=1 ;;
  esac; shift
done

# === project detection
PROJECT_ID="${PROJECT_ID:-}"
if [[ -z "${PROJECT_ID}" && -f .firebaserc ]]; then
  PROJECT_ID="$(grep -oE '"default"\s*:\s*"[^"]+' .firebaserc | sed 's/.*"default"\s*:\s*"//')"
fi
PROJECT_ID="${PROJECT_ID:-kingdom-commerce}"

echo "Kingdom Connects — Full Audit"
echo "Using Firebase project: $PROJECT_ID"
echo

# === Firebase CLI check
if command -v firebase >/dev/null 2>&1; then
  FIREBASE_VER="$(firebase --version 2>/dev/null || true)"
  ok "Firebase CLI found (v${FIREBASE_VER})"
else
  err "Firebase CLI not found. Install:  npm i -g firebase-tools"
  exit 1
fi

# === Auth check (non-interactive OK)
if firebase login:list >/dev/null 2>&1; then
  ok "Firebase CLI authenticated"
else
  warn "Not logged in. Run: firebase login"
fi

# === file/folder checks
MISSES=0
need(){ [[ -e "$1" ]] && ok "File: $1" || { err "Missing file: $1"; MISSES=$((MISSES+1)); }; }
need_dir(){ [[ -d "$1" ]] && ok "Folder: $1/" || warn "Missing folder: $1/ (optional)"; }

need index.html
need firebase.json || true
need firestore.rules || true
need storage.rules || true
need_dir js
need_dir styles
need_dir assets
need_dir admin
need_dir church-admin
need_dir business-admin

# === firebase.json content checks (if present)
HAS_FS=0; HAS_ST=0; HAS_HOST=0
if [[ -f firebase.json ]]; then
  grep -q '"hosting"' firebase.json && HAS_HOST=1 || true
  grep -q '"firestore"' firebase.json && HAS_FS=1 || true
  grep -q '"storage"' firebase.json && HAS_ST=1 || true
  ((HAS_HOST)) && ok "firebase.json includes hosting" || err "firebase.json missing hosting"
  ((HAS_FS)) && ok "firebase.json includes firestore rules ref" || err "firebase.json missing firestore"
  ((HAS_ST)) && ok "firebase.json includes storage rules ref" || err "firebase.json missing storage"
else
  err "firebase.json missing (will create with --fix)"; MISSES=$((MISSES+1))
fi

# === Write default files when --fix is passed
if [[ $FIX -eq 1 ]]; then
  echo; echo "— Fix mode enabled —"

  if [[ ! -f firebase.json ]] || [[ $HAS_FS -eq 0 || $HAS_ST -eq 0 || $HAS_HOST -eq 0 ]]; then
    cat > firebase.json <<'JSON'
{
  "hosting": {
    "public": ".",
    "ignore": ["firebase.json","**/.*","**/node_modules/**"],
    "cleanUrls": true,
    "headers": [
      { "source": "**/*.html", "headers": [{"key":"Cache-Control","value":"no-cache"}]},
      { "source": "**/*.{js,css}", "headers": [{"key":"Cache-Control","value":"public, max-age=31536000"}]},
      { "source": "index.html", "headers": [{"key":"Cache-Control","value":"no-cache"}]}
    ]
  },
  "firestore": { "rules": "firestore.rules" },
  "storage": { "rules": "storage.rules" }
}
JSON
    ok "Wrote firebase.json"
  fi

  if [[ ! -f firestore.rules ]]; then
    cat > firestore.rules <<'RULES'
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
RULES
    ok "Wrote firestore.rules"
  fi

  if [[ ! -f storage.rules ]]; then
    cat > storage.rules <<'SR'
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
SR
    ok "Wrote storage.rules"
  fi

  echo; echo "Deploying rules + hosting…"
  firebase deploy --only firestore:rules,storage:rules,hosting --project "$PROJECT_ID"
  ok "Deploy complete"
fi

# === Final report
echo
if [[ $MISSES -gt 0 && $FIX -eq 0 ]]; then
  warn "Audit complete with missing items. Re-run:  bash kc_audit_all.sh --fix"
else
  ok "Audit complete."
fi
