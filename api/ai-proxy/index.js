// Serverless AI proxy
// Usage: deploy to Vercel / Netlify / Cloud Functions
// Configure environment variables:
//   TARGET_AI_URL - the upstream AI endpoint (e.g. OpenAI or Google PaLM endpoint)
//   AI_API_KEY - the API key for the provider

const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.json());

const TARGET_URL = process.env.TARGET_AI_URL; // e.g. https://api.openai.com/v1/chat/completions
const API_KEY = process.env.AI_API_KEY;

if (!TARGET_URL || !API_KEY) {
  console.warn('AI proxy running without TARGET_AI_URL or AI_API_KEY - configure env variables');
}

app.post('/api/ai', async (req, res) => {
  const { prompt, model='gpt-4', temperature=0.2 } = req.body || {};
  if (!prompt) return res.status(400).json({error:'missing prompt'});

  if (!TARGET_URL || !API_KEY) {
    return res.status(500).json({error:'AI proxy not configured. Set TARGET_AI_URL and AI_API_KEY in environment.'});
  }

  try {
    // Generic forwarder: POST the received body to TARGET_URL with Authorization header
    const upstream = await fetch(TARGET_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({ prompt, model, temperature })
    });

    const json = await upstream.json();

    // The shape of response differs per provider. We return the raw upstream body under `upstream`
    // and also try to normalize common fields into `reply`.
    let reply = null;
    if (json.choices && Array.isArray(json.choices) && json.choices[0].text) reply = json.choices[0].text;
    if (json.choices && Array.isArray(json.choices) && json.choices[0].message) reply = json.choices[0].message.content;
    if (!reply && json.output && json.output[0] && json.output[0].content) reply = (json.output[0].content.map(c=>c.text || '').join('\n'));

    return res.json({ upstream: json, reply });
  } catch (err) {
    console.error('AI proxy error', err);
    return res.status(500).json({ error: 'proxy failed', detail: err.message });
  }
});

// For serverless platforms like Vercel export the app
module.exports = app;
