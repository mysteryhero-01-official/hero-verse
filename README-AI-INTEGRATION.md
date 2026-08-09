Hero-Verse — AI Integration & Deploy Guide (Hindi)

यह फ़ाइल बताती है कि आपने अभी कौन‑से स्केफोल्ड जोड़े हैं और कैसे आप AI backend (PaLM/Gemini या OpenAI) जोड़कर Chat UI को पूरी तरह काम में ला सकते हैं।

सम्पर्क और फैसला:
- मैंने frontend में AI chat UI जोड़ा है जो /api/ai endpoint को call करता है।
- मैंने एक serverless proxy टेम्पलेट (api/ai-proxy) जोड़ा है जो किसी भी AI provider के endpoint को फॉरवर्ड कर सकेगा; यह वास्तविक API key environment variable में रखता है (repo में नहीं)।
- मैंने Firebase admin script और Realtime DB rules snippet भी जोड़ा है जो reserved handles को server‑rules के स्तर पर नकार देगी।

तुरंत deploy करने के कदम (संक्षेप में):

1) Serverless AI proxy deploy (Vercel example)
- Install Vercel CLI / login
  npm i -g vercel
  vercel login
- Deploy api folder (यह express app है; Vercel auto-detect कर लेगा)
  cd api/ai-proxy
  npm install
  vercel --prod
- Environment variables (Vercel dashboard) में add करें:
  TARGET_AI_URL = (आपके AI provider का endpoint — उदाहरण: OpenAI chat completions URL या Google PaLM endpoint)
  AI_API_KEY = (आपकी AI API key)

Notes:
- यदि आप Google PaLM / Gemini use करना चाहते हैं, Google के docs के अनुसार Vertex AI/PaLM endpoint और authentication setup करना होगा। Google APIs अक्सर OAuth या service account token का उपयोग करते हैं। सब कुछ आसान करने के लिए, आप PaLM HTTP endpoint या एक managed endpoint URL अपनी project settings से लें और उसे TARGET_AI_URL में डाल दें।

2) Configure Firebase rules
- Realtime DB rules file db-rules/realtime.rules.json है। इसे Firebase Console → Realtime Database → Rules में paste करें या CLI से deploy करें।

3) Admin user creation
- अपने admin user का UID निकालें (Firebase Console → Authentication → users).
- स्थानीय मशीन पर service account JSON रखें और
  export GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccountKey.json
  cd admin
  npm install firebase-admin
  node set-admin-claim.js <UID>

4) Configure frontend
- Frontend chat UI calls /api/ai. यदि आप Vercel पर proxy deploy कर चुके हैं और domain सेट कर चुके हैं, यह सीधे काम करेगा.

महत्त्वपूर्ण सुरक्षा नोट्स (जरूरी)
- कभी भी service account JSON या API keys को public repo में न डालें।
- Admin privileges हमेशा server‑side से ही दें (custom claims)।
- Phone auth के लिए Firebase में reCAPTCHA, Authorized domains और quotas सेट करें।

GitHub repo protection (आपको स्वयं करना होगा)
- Repo private करने के लिये (gh CLI example):
  gh auth login
  gh repo edit mysteryhero-01-official/hero-verse --visibility private

- Main branch protection example (Web UI recommended):
  Settings → Branches → Add rule → select main → enable "Require pull request reviews before merging" and "Restrict who can push to matching branches" → add your user only.

यदि आप चाहें तो मैं ये फाइलें और छोटे बदलाव अभी commit कर चुका/चुकी हूँ। आप मुझे बताएँ कि मैं proxy को "OpenAI" template के लिए default करूँ या "PaLM" — वर्तमान proxy generic है: "TARGET_AI_URL" और "AI_API_KEY" set करके you can connect any provider.

जरूरी: मैं GitHub सेटिंग्स (private/branch protection) आपके behalf पर नहीं बदल सकता — पर मैं सारे कमांड और guidance दे चुका/चुकी हूँ।

अगला कदम — मैं क्या करूँ:
- यदि आप चाहें तो मैं api/ai-proxy के README में OpenAI और Google PaLM के example curl requests भी जोड़ दूँ।
- आपको अब AI_API_KEY और TARGET_AI_URL set करके proxy deploy करना होगा — मैं step‑by‑step हिंदी में बताऊँगा/गी।

