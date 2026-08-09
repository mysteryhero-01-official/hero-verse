// Firebase Admin: setAdminClaim.js
// Usage: node set-admin-claim.js <uid>
// Requires: GOOGLE_APPLICATION_CREDENTIALS env var pointing to your service account JSON

const admin = require('firebase-admin');

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS){
  console.error('Set GOOGLE_APPLICATION_CREDENTIALS to your service account JSON path'); process.exit(1);
}

admin.initializeApp({ credential: admin.credential.applicationDefault() });

const uid = process.argv[2];
if (!uid){ console.error('Usage: node set-admin-claim.js <uid>'); process.exit(1); }

admin.auth().setCustomUserClaims(uid, { admin: true }).then(()=>{
  console.log('Custom claim set for', uid);
  process.exit(0);
}).catch(e=>{ console.error('Error setting claim', e); process.exit(1); });
