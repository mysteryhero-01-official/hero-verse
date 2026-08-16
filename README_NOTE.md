# README_NOTE for feature/auth-restructure

This branch adds an initial authentication scaffold (email + phone OTP + handle checks) and an admin helper script. It does NOT modify main branch. It also contains instructions in Hindi for the repo owner to review and merge.

IMPORTANT (in Hindi):

- Maine ye branch `feature/auth-restructure` par auth scaffold add kiya hai.
- Main branch abhi untouched hai.
- Cleanup (delete everything except index.html) aapne alag cleanup branch ke liye kaha tha — maine pehle `cleanup/remove-all-except-index` branch bana di hai lekin usme abhi koi destructive commit nahin kiya gaya.

Next steps (what you should do locally or via GitHub web UI):

1) Review files in this branch and test locally. To run a quick static server:
   - git clone https://github.com/mysteryhero-01-official/hero-verse.git
   - cd hero-verse
   - git fetch origin
   - git checkout feature/auth-restructure
   - Serve the site (e.g., npx http-server -c-1 .) and open http://localhost:8080

2) Add your Firebase project config:
   - Copy `firebase-config.example.js` to `firebase-config.js` in the project root and fill in your Firebase web app values.
   - Ensure you include Firebase SDK scripts in `index.html` (see below).

3) Admin owner claim (run locally):
   - Place your service account JSON locally and set:
       export GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccountKey.json
   - cd admin
   - npm install firebase-admin
   - node set-owner-claim.js rd8556532@gmail.com

4) If you want me to proceed with cleanup branch deletes, merge the cleanup PR or give explicit confirmation to merge.

How to include Firebase SDK in index.html (example, add before closing </body>):

<script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js"></script>
<script src="/auth/auth.js"></script>

Security notes:
- Do NOT commit service account JSON or API keys to the repo.
- For phone auth, ensure Authorized domains in Firebase include your domain and localhost for testing.

If you want, main mein cleanup karne se pehle main auth flow ko bhi finish kar dunga (handle uniqueness, UI polish).