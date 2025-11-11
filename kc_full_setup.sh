#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

# ---------------------------
# Kingdom Connects – full setup
# ---------------------------
PROJECT_ID="kingdom-commerce"
OVERRIDE_PROJECT=""
for arg in "$@"; do
  case "$arg" in
    --project=*) OVERRIDE_PROJECT="${arg#*=}";;
  esac
done
if [ -n "$OVERRIDE_PROJECT" ]; then PROJECT_ID="$OVERRIDE_PROJECT"; fi

echo "🔧 Using Firebase project: $PROJECT_ID"

# 1) sanity: firebase CLI present & logged in
if ! command -v firebase >/dev/null 2>&1; then
  echo "❌ Firebase CLI not found. Install it in Termux, then re-run."; exit 1
fi
firebase login:list >/dev/null 2>&1 || firebase login --no-localhost

# 2) ensure .firebaserc points to the project
cat > .firebaserc <<JSON
{
  "projects": { "default": "$PROJECT_ID" }
}
JSON

# 3) create/update rules files
cat > firestore.rules <<'RULES'
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;             // relax for dev
      allow write: if request.auth != null;
    }
  }
}
RULES

cat > storage.rules <<'RULES'
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;             // relax for dev
      allow write: if request.auth != null;
    }
  }
}
RULES

# 4) firebase.json with correct deploy targets (NO 'storage:rules' target!)
cat > firebase.json <<'JSON'
{
  "hosting": {
    "public": ".",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "cleanUrls": true,
    "headers": [
      { "source": "**/*.html", "headers": [{ "key": "Cache-Control", "value": "no-cache" }] },
      { "source": "**/*.{js,css}", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000" }] },
      { "source": "index.html", "headers": [{ "key": "Cache-Control", "value": "no-cache" }] }
    ]
  },
  "firestore": { "rules": "firestore.rules" },
  "storage":   { "rules": "storage.rules" }
}
JSON

# 5) ensure common folders exist (no harm if already present)
mkdir -p admin church-admin business-admin js styles assets

# 6) quick check for Storage init (bucket presence)
# If a default bucket exists, 'firebase deploy --only storage' will work.
# If not, we prompt once to initialize from CLI.
NEED_INIT=0
if ! firebase experiments:list >/dev/null 2>&1; then :; fi # warmup (reduces first-call delays)
if ! firebase deploy --only storage --project "$PROJECT_ID" --dry-run >/dev/null 2>&1; then
  NEED_INIT=1
fi

if [ "$NEED_INIT" -eq 1 ]; then
  echo "ℹ️  Storage may not be initialized yet. Launching a one-time non-destructive init…"
  # Non-interactive attempt: create a minimal storage target by writing firebase.json (already done)
  # Some projects still require explicit init. We’ll trigger the guided init once:
  yes "" | firebase init storage --project "$PROJECT_ID" || true
fi

echo "🚀 Deploying rules & hosting to '$PROJECT_ID'…"
# IMPORTANT: correct flags — 'storage' (not 'storage:rules')
firebase deploy --only firestore:rules,storage,hosting --project "$PROJECT_ID"

echo ""
echo "✅ Setup complete."
echo "   • Project: $PROJECT_ID"
echo "   • Files: firebase.json, firestore.rules, storage.rules, .firebaserc"
echo "   • Hosting + Firestore rules + Storage deployed."
echo "   (Dev rules are permissive; tighten before production.)"
