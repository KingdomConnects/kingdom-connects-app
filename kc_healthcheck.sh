#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

# ========== CONFIG ==========
PROJECT_ID_DEFAULT="kingdom-commerce"
REQUIRED_FILES=("index.html" "firebase.json" "firestore.rules" "storage.rules")
REQUIRED_DIRS=("js" "styles" "assets" "admin" "church-admin" "business-admin")

# Collections we expect
REQUIRED_COLLECTIONS=("businessListings" "users" "reviews" "payments" "activity_log")

# Expected fields per sample doc (used only when --fix is passed)
declare -A SAMPLE_JSON
SAMPLE_JSON[businessListings]='{
  "business_name":"Example Roofing Co","owner_first_name":"John","owner_last_name":"Doe","owner_name":"John Doe",
  "email":"example@email.com","phone":"555-1234","website":"https://exampleroofing.test","business_field":"Roofing",
  "address1":"123 Main St","address2":"Suite 200","city":"Venice","state":"FL","zip":"34293",
  "neighborhood":"South Venice","cross_street_1":"Main St","cross_street_2":"Pine Ave",
  "Q1":"","Q2":"","Q3":"","Q4":"","Q5":"","A1":"","A2":"","A3":"","A4":"","A5":"",
  "listing_status":"active","package":"free","sale":false,"salesperson":"","employee_id":"",
  "home_church_id":"","referring_salesperson_id":"","sales_director_id":"",
  "created_at":{"_seconds":1731100000,"_nanoseconds":0},"updated_at":{"_seconds":1731100000,"_nanoseconds":0}
}'
SAMPLE_JSON[users]='{
  "name":"Jane Admin","first_name":"Jane","last_name":"Admin","email":"admin@example.com","phone":"555-0000",
  "position":"Platform Admin","role":"admin","church_affiliation":"",
  "last_login":{"_seconds":1731100000,"_nanoseconds":0},"joined_at":{"_seconds":1731100000,"_nanoseconds":0}
}'
SAMPLE_JSON[reviews]='{
  "business_id":"sampleBusiness","user_id":"sampleUser","rating":5,"comment":"Excellent service!",
  "verified":true,"review_type":"public","visibility":"visible",
  "timestamp":{"_seconds":1731100000,"_nanoseconds":0}
}'
SAMPLE_JSON[payments]='{
  "user_id":"sampleUser","business_id":"sampleBusiness","amount":99.00,"currency":"USD","status":"paid",
  "payment_method":"stripe","transaction_id":"txn_demo_123","receipt_url":"",
  "pro_start_date":{"_seconds":1731100000,"_nanoseconds":0},"pro_end_date":{"_seconds":1733702000,"_nanoseconds":0},
  "date":{"_seconds":1731100000,"_nanoseconds":0},"created_at":{"_seconds":1731100000,"_nanoseconds":0}
}'
SAMPLE_JSON[activity_log]='{
  "activity_type":"create_listing","target_type
  

eof

