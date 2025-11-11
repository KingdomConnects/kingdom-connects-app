#!/data/data/com.termux/files/usr/bin/bash
set -e

PROJECT_ID="kingdom-commerce"

echo
echo "🔥 Seeding COMPLETE Firestore schema into: $PROJECT_ID"
echo

# If not logged in, this will prompt you
firebase login:list >/dev/null 2>&1 || firebase login

# ---- businessListings (FULL FIELDS) ----
BL_TMP="$(mktemp)"
cat > "$BL_TMP" <<'JSON'
{
  "business_name": "Example Roofing Co",
  "owner_first_name": "John",
  "owner_last_name": "Doe",
  "owner_name": "John Doe",
  "email": "example@email.com",
  "phone": "555-1234",
  "website": "https://exampleroofing.test",
  "business_field": "Roofing",
  "address1": "123 Main St",
  "address2": "Suite 200",
  "city": "Venice",
  "state": "FL",
  "zip": "34293",
  "neighborhood": "South Venice",
  "cross_street_1": "Main St",
  "cross_street_2": "Pine Ave",
  "Q1": "", "Q2": "", "Q3": "", "Q4": "", "Q5": "",
  "A1": "", "A2": "", "A3": "", "A4": "", "A5": "",
  "listing_status": "active",
  "package": "free",
  "sale": false,
  "salesperson": "",
  "employee_id": "",
  "home_church_id": "",
  "referring_salesperson_id": "",
  "sales_director_id": "",
  "created_at": {"_seconds": 1731100000, "_nanoseconds": 0},
  "updated_at": {"_seconds": 1731100000, "_nanoseconds": 0}
}
JSON
firebase firestore:documents:set businessListings/sampleBusiness --data-file "$BL_TMP" --project="$PROJECT_ID" >/dev/null && echo "✅ businessListings/sampleBusiness"

# ---- users (expanded) ----
U_TMP="$(mktemp)"
cat > "$U_TMP" <<'JSON'
{
  "name": "Jane Admin",
  "first_name": "Jane",
  "last_name": "Admin",
  "email": "admin@example.com",
  "phone": "555-0000",
  "position": "Platform Admin",
  "role": "admin",
  "church_affiliation": "",
  "last_login": {"_seconds": 1731100000, "_nanoseconds": 0},
  "joined_at": {"_seconds": 1731100000, "_nanoseconds": 0}
}
JSON
firebase firestore:documents:set users/sampleUser --data-file "$U_TMP" --project="$PROJECT_ID" >/dev/null && echo "✅ users/sampleUser"

# ---- reviews (flags) ----
R_TMP="$(mktemp)"
cat > "$R_TMP" <<'JSON'
{
  "business_id": "sampleBusiness",
  "user_id": "sampleUser",
  "rating": 5,
  "comment": "Excellent service!",
  "verified": true,
  "review_type": "public",
  "visibility": "visible",
  "timestamp": {"_seconds": 1731100000, "_nanoseconds": 0}
}
JSON
firebase firestore:documents:set reviews/sampleReview --data-file "$R_TMP" --project="$PROJECT_ID" >/dev/null && echo "✅ reviews/sampleReview"

# ---- payments (full) ----
P_TMP="$(mktemp)"
cat > "$P_TMP" <<'JSON'
{
  "user_id": "sampleUser",
  "business_id": "sampleBusiness",
  "amount": 99.00,
  "currency": "USD",
  "status": "paid",
  "payment_method": "stripe",
  "transaction_id": "txn_demo_123",
  "receipt_url": "",
  "pro_start_date": {"_seconds": 1731100000, "_nanoseconds": 0},
  "pro_end_date":   {"_seconds": 1733702000, "_nanoseconds": 0},
  "date": {"_seconds": 1731100000, "_nanoseconds": 0},
  "created_at": {"_seconds": 1731100000, "_nanoseconds": 0}
}
JSON
firebase firestore:documents:set payments/samplePayment --data-file "$P_TMP" --project="$PROJECT_ID" >/dev/null && echo "✅ payments/samplePayment"

# ---- activity_log (richer) ----
A_TMP="$(mktemp)"
cat > "$A_TMP" <<'JSON'
{
  "activity_type": "create_listing",
  "target_type": "business",
  "target_id": "sampleBusiness",
  "details": "User created sample business listing",
  "user_id": "sampleUser",
  "timestamp": {"_seconds": 1731100000, "_nanoseconds": 0}
}
JSON
firebase firestore:documents:set activity_log/sampleActivity --data-file "$A_TMP" --project="$PROJECT_ID" >/dev/null && echo "✅ activity_log/sampleActivity"

echo
echo "🎉 Done. All sample docs written safely to Firestore."
