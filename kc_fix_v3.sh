#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
PROJECT_ID="kingdom-commerce"

echo -e "\n🚀 KC Fix v3 — seed Firestore (old CLI), set rules (no firebase.json edits)\n"

# ---------- Create minimal rules if missing ----------
if [ ! -f firestore.rules ]; then
cat > firestore.rules <<'R'
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
R
echo "✔ Created firestore.rules"
fi

if [ ! -f storage.rules ]; then
cat > storage.rules <<'R'
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
R
echo "✔ Created storage.rules"
fi

# ---------- Upload rules directly (no firebase.json needed) ----------
firebase firestore:rules:set firestore.rules --project "$PROJECT_ID" && echo "✅ Firestore rules uploaded"
firebase storage:rules:set   storage.rules   --project "$PROJECT_ID" && echo "✅ Storage rules uploaded"

# ---------- Prepare seed JSON files ----------
mkjson(){ printf '%s' "$2" > "$1"; echo "• $1"; }

echo "Preparing seed docs…"
mkjson sampleBusiness.json '{
  "business_name":"Example Roofing Co",
  "email":"example@email.com","phone":"555-1234",
  "city":"Venice","state":"FL",
  "listing_status":"active",
  "created_at":{"_seconds":1731100000,"_nanoseconds":0}
}'

mkjson sampleUser.json '{
  "name":"Jane Admin","first_name":"Jane","last_name":"Admin",
  "email":"admin@example.com","phone":"555-0000",
  "position":"Platform Admin","role":"admin",
  "joined_at":{"_seconds":1731100000,"_nanoseconds":0}
}'

mkjson sampleReview.json '{
  "business_id":"sampleBusiness","user_id":"sampleUser",
  "rating":5,"comment":"Excellent service!","verified":true,
  "review_type":"public","visibility":"visible",
  "timestamp":{"_seconds":1731100000,"_nanoseconds":0}
}'

mkjson samplePayment.json '{
  "user_id":"sampleUser","business_id":"sampleBusiness",
  "amount":99.00,"currency":"USD","status":"paid",
  "payment_method":"stripe","transaction_id":"txn_demo_123",
  "date":{"_seconds":1731100000,"_nanoseconds":0},
  "created_at":{"_seconds":1731100000,"_nanoseconds":0}
}'

mkjson sampleActivity.json '{
  "activity_type":"create_listing","target_type":"business",
  "target_id":"sampleBusiness","details":"User created sample listing",
  "user_id":"sampleUser","timestamp":{"_seconds":1731100000,"_nanoseconds":0}
}'

mkjson sampleChurch.json '{
  "church_name":"Sample Community Church","city":"Venice","state":"FL",
  "email":"info@samplechurch.test","phone":"555-2222",
  "members_count":120,"admin_user_id":"sampleUser",
  "created_at":{"_seconds":1731100000,"_nanoseconds":0}
}'

# ---------- Seed using older CLI syntax (no --data-file) ----------
echo "Seeding Firestore…"
firebase firestore:documents:set businessListings/sampleBusiness sampleBusiness.json --project "$PROJECT_ID" && echo "✅ businessListings/sampleBusiness"
firebase firestore:documents:set users/sampleUser                 sampleUser.json     --project "$PROJECT_ID" && echo "✅ users/sampleUser"
firebase firestore:documents:set reviews/sampleReview             sampleReview.json   --project "$PROJECT_ID" && echo "✅ reviews/sampleReview"
firebase firestore:documents:set payments/samplePayment           samplePayment.json  --project "$PROJECT_ID" && echo "✅ payments/samplePayment"
firebase firestore:documents:set activity_log/sampleActivity      sampleActivity.json --project "$PROJECT_ID" && echo "✅ activity_log/sampleActivity"
firebase firestore:documents:set churches/sampleChurch            sampleChurch.json   --project "$PROJECT_ID" && echo "✅ churches/sampleChurch"

echo -e "\n🎉 Done."
echo -e "Next:\n  1) Deploy hosting (safe):  firebase deploy --only hosting\n  2) Verify data in Firestore console.\n"
