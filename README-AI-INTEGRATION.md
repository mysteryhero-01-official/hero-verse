# README - AI Integration & Deployment (Hero-Verse)

This guide shows how to deploy the serverless AI proxy (Google PaLM / OpenAI), enable Firebase auth, and secure your repo.

1) Files added
- index.html (updated landing, AI chat UI pointing to /api/ai-proxy)
- api/ai-proxy/index.js (serverless proxy template)
- api/ai-proxy/package.json
- admin/set-admin-claim.js (script using Firebase Admin SDK to set admin custom claim)
- db-rules/realtime.rules.json (Realtime Database rules example)
- firebase-config.example.js

2) How to deploy AI proxy (Vercel example)
- Install Vercel CLI and login: `npm i -g vercel && vercel login`
- In repository root: `cd api/ai-proxy` then `npm install`
- Deploy: `vercel --prod` (follow prompts)
- Set environment variables in Vercel dashboard:
  - AI_PROVIDER=google   (or "openai")
  - GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY
  - GOOGLE_PALM_MODEL=models/text-bison-001   (optional)
  - OPENAI_API_KEY=YOUR_OPENAI_KEY

3) Google PaLM / Gemini notes
- Google PaLM / Gemini is accessible via Google Cloud Generative Language APIs or Vertex AI. Configure a project, enable the Generative API, and create an API key or service account.
- Do NOT commit API keys to the repo. Use environment variables on your deployment platform.

4) Firebase Auth (client)
- Copy `firebase-config.example.js` to `firebase-config.js` and fill with your Firebase project config.
- Enable Email/Password and Phone sign-in in Firebase Console (Authentication > Sign-in method).
- For Phone auth, set up reCAPTCHA and add your domain to Authorized domains in Firebase Console.
- Use Firebase rules from `db-rules/realtime.rules.json` as a starting point to block reserved handles server-side.

5) Admin & security
- To give a user admin privileges, run locally using a service account:
  - Export credentials: `export GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccount.json`
  - `node admin/set-admin-claim.js <uid>`
- Protect main branch via GitHub settings (Settings → Branches → Add rule). I cannot change repo visibility or branch protection for you, but you can use GitHub CLI:
  - Make private: `gh repo edit mysteryhero-01-official/hero-verse --visibility private`
  - Branch protection (example):
    ```bash
    gh api --method PUT /repos/mysteryhero-01-official/hero-verse/branches/main/protection -f required_status_checks='{"strict":true,"contexts":[]}' -f enforce_admins=true -f required_pull_request_reviews='{"required_approving_review_count":1}' -F restrictions='{"users":[],"teams":[]}' -H "Accept: application/vnd.github+json"
    ```
  - You must run above commands with `gh auth login` and an account with admin rights.

6) Remove GitHub link from site
- Done in `index.html`. The site no longer exposes the repo link.

7) Next recommended steps
- Deploy AI proxy to Vercel/Netlify.
- Add API key via environment variables.
- Deploy site (you can host index.html as static site on GitHub Pages, Netlify, or Vercel).
- Configure Firebase console (authorized domains, phone reCAPTCHA, etc.).
- Apply DB rules and use admin claim script to set admin users.

If you want, I will now push these changes to the main branch (already done). Tell me if you want me to also prepare a pull request instead of direct commit, or split files into a feature branch first.
