#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

# ========= CONFIG =========
PROJECT_ID_DEFAULT="kingdom-commerce"

# Files/folders your site expects
REQUIRED_FILES=("index.html" "firebase.json" "firestore.rules" "storage.rules")
REQUIRED_DIRS=("js" "styles" "assets" "admin" "church-admin" "business-admin")

# Firestore collections to verify/seed
REQUIRED_COLLECTIONS=("businessListings" "users" "reviews" "payments" "activity_log" "churches")

# ---- Full seed payloads (fields) ----
declare -A SEED
SEED[businessListings]='{
  "business_name":"Example Roofing Co",
  "owner_first_name":"John","owner_last_name":"Doe","owner_name":"John Doe",
  "email":"example@email.com","phone":"555-1234","website":"https://exampleroofing.test",
  "business_field":"Roofing",
  "address1":"123 Main St","address2":"Suite 200","city":"Venice","state":"FL","zip":"34293",
  "neighborhood":"South Venice","cross_street_1":"Main St","cross_street_2":"Pine Ave",
  "Q1":"","Q2":"","Q3":"","Q4":"","Q5":"","A1":"","A2":"","A3":"","A4":"","A5":"",
  "listing_status":"active","package":"free","sale":false,
  "salesperson":"","employee_id":"","home_church_id":"",
  "referring_salesperson_id":"","sales_director_id":"",
  "created_at":{"_seconds":1731100000,"_nanoseconds":0},
  "updated_at":{"_seconds":1731100000,"_nanoseconds":0}
}'
SEED[users]='{
  "name":"Jane Admin","first_name":"Jane","last_name":"Admin",
  "email":"admin@example.com","phone":"555-0000",
  "position":"Platform Admin","role":"admin","church_affiliation":"",
  "last_login":{"_seconds":1731100000,"_nanoseconds":0},
  "joined_at":{"_seconds":1731100000,"_nanoseconds":0}
}'
SEED[reviews]='{
  "business_id":"sampleBusiness","user_id":"sampleUser",
  "rating":5,"comment":"Excellent service!","verified":true,
  "review_type":"public","visibility":"visible",
  "timestamp":{"_seconds":1731100000,"_nanoseconds":0}
}'
SEED[payments]='{
  "user_id":"sampleUser","business_id":"sampleBusiness",
  "amount":99.00,"currency":"USD","status":"paid",
  "payment_method":"stripe","transaction_id":"txn_demo_123","receipt_url":"",
  "pro_start_date":{"_seconds":1731100000,"_nanoseconds":0},
  "pro_end_date":{"_seconds":1733702000,"_nanoseconds":0},
  "date":{"_seconds":1731100000,"_nanoseconds":0},
  "created_at":{"_seconds":1731100000,"_nanoseconds":0}
}'
SEED[activity_log]='{
  "activity_type":"create_listing","target_type":"business","target_id":"sampleBusiness",
  "details":"User created sample business listing","user_id":"sampleUser",
  "timestamp":{"_seconds":1731100000,"_nanoseconds":0}
}'
SEED[churches]='{
  "church_name":"Sample Community Church",
  "city":"Venice","state":"FL",
  "email":"info@samplechurch.test","phone":"555-2222",
  "members_count":120,
  "admin_user_id":"sampleUser",
  "created_at":{"_seconds":1731100000,"_nanoseconds":0}
}'

# ========= FLAGS =========
FIX=0; SEED_ONLY=0; PROJECT_ID="$PROJECT_ID_DEFAULT"
for a in "$@"; do
  case "$a" in
    --fix) FIX=1 ;;
    --seed-only) SEED_ONLY=1 ;;
    --project=*) PROJECT_ID="${a#*=}" ;;
  esac
done

# ========= UI helpers =========
G="\033[1;32m"; R="\033[1;31m"; Y="\033[1;33m"; N="\033[0m"
ok(){ echo -e "${G}✔${N} $1"; }
warn(){ echo -e "${Y}▲${N} $1"; }
err(){ echo -e "${R}✖ $1${N}"; }
have(){ command -v "$1" >/dev/null 2>&1; }

echo -e "\nKingdom Connects — Full Audit & Firestore Field Seeding\nFolder: $(pwd)\n"

# ========= PRECHECKS =========
if ! have firebase; then
  err "Firebase CLI missing. Install:  pkg install nodejs  &&  npm i -g firebase-tools"
  exit 1
fi

if ! firebase login:list >/dev/null 2>&1; then
  if [[ $FIX -eq 1 || $SEED_ONLY -eq 1 ]]; then
    warn "Not logged in — prompting…"; firebase login || { err "Login failed"; exit 1; }
  else
    err "Not logged in. Run: firebase login   or rerun with --fix."
    exit 1
  fi
fi
ok "Firebase CLI authenticated"

# Project from .firebaserc if present
if [[ -f .firebaserc ]]; then
  P=$(grep -oE '"default"\s*:\s*"[^"]+"' .firebaserc | sed -E 's/.*"default"\s*:\s*"([^"]+)"/\1/')
  [[ -n "${P:-}" ]] && PROJECT_ID="$P"
fi
ok "Using project: ${PROJECT_ID}"

# ========= FILES & DIRS =========
if [[ $SEED_ONLY -eq 0 ]]; then
  ALL_GOOD=1
  for f in "${REQUIRED_FILES[@]}"; do
    [[ -f "$f" ]] && ok "File: $f" || { err "Missing file: $f"; ALL_GOOD=0; }
  done
  for d in "${REQUIRED_DIRS[@]}"; do
    [[ -d "$d" ]] && ok "Folder: $d/" || warn "Missing folder: $d/"
  done

  if [[ -f firebase.json ]]; then
    grep -q '"hosting"' firebase.json && ok "firebase.json hosting ✓" || { err "firebase.json missing hosting"; ALL_GOOD=0; }
    grep -q '"firestore"' firebase.json && ok "firebase.json firestore ✓" || { err "firebase.json missing firestore"; ALL_GOOD=0; }
    grep -q '"storage"' firebase.json && ok "firebase.json storage ✓" || { err "firebase.json missing storage"; ALL_GOOD=0; }
  fi

  [[ -f firestore.rules ]] && ok "firestore.rules present" || { err "firestore.rules missing"; ALL_GOOD=0; }
  [[ -f storage.rules ]]   && ok "storage.rules present"   || { err "storage.rules missing"; ALL_GOOD=0; }

  # Storage/Hosting reachability (no changes)
  firebase storage:rules:get --project "$PROJECT_ID" >/dev/null 2>&1 && ok "Firebase Storage reachable" || warn "Storage may not be initialized yet."
  firebase hosting:sites:list --project "$PROJECT_ID" >/dev/null 2>&1 && ok "Hosting API reachable" || warn "Hosting not fully set up yet"
fi

# ========= FIRESTORE: collections + fields (seed) =========
echo -e "\nChecking Firestore collections & seeding fields…"
for coll in "${REQUIRED_COLLECTIONS[@]}"; do
  if firebase firestore:documents:list "$coll" --project "$PROJECT_ID" >/dev/null 2>&1; then
    ok "Collection present: $coll"
  else
    if [[ $FIX -eq 1 || $SEED_ONLY -eq 1 ]]; then
      TMP="$(mktemp)"; printf '%s' "${SEED[$coll]}" > "$TMP"
      case "$coll" in
        businessListings) DOC=sampleBusiness ;;
        users)            DOC=sampleUser ;;
        reviews)          DOC=sampleReview ;;
        payments)         DOC=samplePayment ;;
        activity_log)     DOC=sampleActivity ;;
        churches)         DOC=sampleChurch ;;
      esac
      if firebase firestore:documents:set "$coll/$DOC" --data-file "$TMP" --project "$PROJECT_ID" >/dev/null; then
        ok "Seeded $coll/$DOC (full field set)"
      else
        err "Failed seeding $coll"
        ALL_GOOD=0
      fi
    else
      err "Missing collection: $coll  (rerun with --fix to create sample doc)"
      ALL_GOOD=0
    fi
  fi
done

echo -e "\nAudit complete."
if [[ ${ALL_GOOD:-1} -eq 1 ]]; then
  echo -e "${G}All core checks passed.${N}"
else
  echo -e "${Y}Some checks failed. Re-run with --fix to auto-create what can be created.${N}"
fi

echo -e "\nUsage:\n  bash kc_audit.sh             # check only\n  bash kc_audit.sh --fix       # check + auto-create seeds\n  bash kc_audit.sh --seed-only # just seed Firestore (fast)\n  bash kc_audit.sh --project=YOUR_ID  # override project\n"
