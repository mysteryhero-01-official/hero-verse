// set-admin-claim.js
// Node script that sets admin custom claim for a Firebase user UID.
// Usage:
// 1) Download a service account JSON from Firebase Console and set GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccountKey.json
// 2) npm install firebase-admin
// 3) node set-admin-claim.js <USER_UID>

const admin = require('firebase-admin');

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('Please set GOOGLE_APPLICATION_CREDENTIALS environment variable to your service account JSON path.');
  process.exit(1);
}

admin.initializeApp({ credential: admin.credential.applicationDefault() });

const uid = process.argv[2];
if (!uid) {
  console.error('Usage: node set-admin-claim.js <USER_UID>');
  process.exit(1);
}

(async () => {
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log('Admin claim set for', uid);
  } catch (err) {
    console.error('Failed to set admin claim:', err);
    process.exit(1);
  }
})();
