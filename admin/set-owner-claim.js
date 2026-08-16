// admin/set-owner-claim.js
// Node script using firebase-admin to set custom claim `owner: true` for a user identified by email
// Usage:
//   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccountKey.json
//   node set-owner-claim.js user@example.com

const admin = require('firebase-admin');

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('Please set GOOGLE_APPLICATION_CREDENTIALS to your service account JSON path.');
  process.exit(1);
}

admin.initializeApp({ credential: admin.credential.applicationDefault() });

const email = process.argv[2];
if (!email) {
  console.error('Usage: node set-owner-claim.js <EMAIL>');
  process.exit(1);
}

(async () => {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { owner: true });
    console.log('Owner claim set for', email, 'uid:', user.uid);
  } catch (err) {
    console.error('Failed to set claim:', err);
    process.exit(1);
  }
})();
