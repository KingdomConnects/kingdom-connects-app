#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

PROJECT_ID="${PROJECT_ID:-kingdom-commerce}"
SA_DL="$HOME/storage/downloads/kc-service-account.json"
SA_LOCAL="./kc-service-account.json"

# ---------- Basics ----------
command -v node >/dev/null 2>&1 || pkg install -y nodejs
command -v npm  >/dev/null 2>&1 || pkg install -y nodejs

# ---------- Rules (dev-permissive; tighten later) ----------
[ -f firestore.rules ] || cat > firestore.rules <<'RUF'
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // DEV ONLY
    }
  }
}
RUF

[ -f storage.rules ] || cat > storage.rules <<'RUS'
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true; // DEV ONLY
    }
  }
}
RUS

# ---------- Service Account ----------
if [ -f "$SA_LOCAL" ]; then
  echo "• Using service account: $SA_LOCAL"
elif [ -f "$SA_DL" ]; then
  cp "$SA_DL" "$SA_LOCAL"
  echo "• Copied service account from Downloads to $SA_LOCAL"
else
  echo "✗ Missing service account JSON."
  echo "  Create a key in Firebase Console → Project settings → Service Accounts → Generate new private key"
  echo "  Save it as: Downloads/kc-service-account.json   (or place kc-service-account.json in this folder)"
  exit 1
fi

# ---------- Seeder (Admin SDK) ----------
mkdir -p .kc_seed
cat > .kc_seed/seed.js <<'JS'
const fs = require('fs');
const admin = require('firebase-admin');

const PROJECT_ID = process.env.PROJECT_ID || 'kingdom-commerce';
const SA_PATH    = process.env.SA_PATH    || './kc-service-account.json';

const sa = JSON.parse(fs.readFileSync(SA_PATH, 'utf8'));
admin.initializeApp({
  credential: admin.credential.cert(sa),
  projectId: PROJECT_ID,
});
const db = admin.firestore();
const TS = admin.firestore.FieldValue.serverTimestamp();

async function seed() {
  const work = [];

  // ===== businessListings =====
  work.push(
    db.collection('businessListings').doc('sampleBusiness').set({
      business_name:'', owner_name:'', email:'', phone:'',
      website:'', address1:'', address2:'', city:'', state:'', zip:'',
      category:'', subcategory:'', description:'',
      listing_status:'active', // active | pending | suspended
      created_at: TS, updated_at: TS
    }, {merge:true})
  );

  // ===== users =====
  work.push(
    db.collection('users').doc('sampleUser').set({
      name:'', first_name:'', last_name:'', email:'', phone:'',
      role:'admin',            // admin | editor | member
      position:'', church_affiliation:'',
      home_church_id:'', referring_salesperson_id:'', sales_director_id:'',
      joined_at: TS, last_login: TS
    }, {merge:true})
  );

  // ===== reviews =====
  work.push(
    db.collection('reviews').doc('sampleReview').set({
      business_id:'sampleBusiness', user_id:'sampleUser',
      rating:0, comment:'', verified:false,
      review_type:'public',         // public | private | admin_note
      visibility:'visible',         // visible | hidden | flagged
      timestamp: TS
    }, {merge:true})
  );

  // ===== payments =====
  work.push(
    db.collection('payments').doc('samplePayment').set({
      user_id:'sampleUser', business_id:'sampleBusiness',
      amount:0, currency:'USD',
      status:'pending',             // pending | paid | failed | refunded
      payment_method:'', transaction_id:'', receipt_url:'',
      pro_start_date: TS, pro_end_date: TS,
      date: TS, created_at: TS
    }, {merge:true})
  );

  // ===== activity_log =====
  work.push(
    db.collection('activity_log').doc('sampleActivity').set({
      activity_type:'create_listing',   // create_listing | edit_listing | leave_review | upgrade_pro | admin_action
      target_type:'business',           // business | review | payment | user
      target_id:'sampleBusiness',
      details:'', user_id:'sampleUser', timestamp: TS
    }, {merge:true})
  );

  // ===== churches =====
  work.push(
    db.collection('churches').doc('sampleChurch').set({
      name:'', address1:'', address2:'', city:'', state:'', zip:'',
      phone:'', website:'', admin_user_id:'',
      created_at: TS, updated_at: TS
    }, {merge:true})
  );

  // ===== OPTIONAL: commissions =====
  work.push(
    db.collection('commissions').doc('sampleCommission').set({
      salesperson_id:'', business_id:'sampleBusiness', rate:0, amount:0,
      status:'pending', created_at: TS, paid_at: null
    }, {merge:true})
  );

  // ===== OPTIONAL: sales (leads/orders) =====
  work.push(
    db.collection('sales').doc('sampleSale').set({
      business_id:'sampleBusiness', user_id:'sampleUser',
      stage:'lead',     // lead | contacted | won | lost
      value:0, notes:'', created_at: TS, updated_at: TS
    }, {merge:true})
  );

  await Promise.all(work);
  console.log('✔ Seed complete: collections & docs ensured.');
}

seed().then(()=>process.exit(0)).catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
JS

cat > .kc_seed/package.json <<'PKG'
{
  "name": "kc-seed",
  "private": true,
  "type": "commonjs",
  "dependencies": { "firebase-admin": "^12.5.0" }
}
PKG

# ---------- Install & run ----------
cd .kc_seed
npm i --silent
PROJECT_ID="$PROJECT_ID" SA_PATH="../kc-service-account.json" node seed.js
cd ..

# ---------- Deploy rules + hosting (safe) ----------
firebase deploy --only firestore:rules,storage:rules,hosting --project "$PROJECT_ID"

echo
echo "✅ All done."
echo "   • Project: $PROJECT_ID"
echo "   • Seeded Firestore collections with empty docs."
echo "   • Hosting + rules deployed."
echo "   (Reminder: tighten Firestore/Storage rules before production.)"
