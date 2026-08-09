// Serverless AI proxy (Node.js + Express)
// Usage: deploy to Vercel/Netlify/Firebase Functions. Configure environment variables:
// AI_PROVIDER=google  OR openai
// GOOGLE_API_KEY=your_google_api_key   (for PaLM/Vertex generative API)
// OPENAI_API_KEY=your_openai_key  (optional fallback)

const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.json());

const AI_PROVIDER = process.env.AI_PROVIDER || 'google';

app.post('/', async (req, res) => {
  const prompt = (req.body && req.body.prompt) || '';
  if (!prompt) return res.status(400).json({error:'missing prompt'});

  try{
    if (AI_PROVIDER === 'google'){
      // Example using Google Generative Language API (PaLM/Vertex). Replace model and endpoint as needed.
      const apiKey = process.env.GOOGLE_API_KEY;
      if(!apiKey) return res.status(500).json({error:'GOOGLE_API_KEY not configured'});

      const model = process.env.GOOGLE_PALM_MODEL || 'models/text-bison-001';
      const url = `https://generativelanguage.googleapis.com/v1beta2/${model}:generateText?key=${apiKey}`;
      const body = { "prompt": { "text": prompt }, "temperature": 0.7 };

      const r = await fetch(url, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
      const j = await r.json();
      // adjust based on actual response shape
      const reply = j.candidates && j.candidates[0] && j.candidates[0].output || j.output || JSON.stringify(j);
      return res.json({reply});

    } else {
      // OpenAI fallback
      const key = process.env.OPENAI_API_KEY;
      if(!key) return res.status(500).json({error:'OPENAI_API_KEY not configured'});
      const r = await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{'Authorization':'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify({model:'gpt-4o-mini',messages:[{role:'user',content:prompt}],max_tokens:600})});
      const j = await r.json();
      const reply = j.choices && j.choices[0] && (j.choices[0].message && j.choices[0].message.content) || JSON.stringify(j);
      return res.json({reply});
    }
  }catch(err){
    console.error(err);
    return res.status(500).json({error:'AI proxy error', details: String(err)});
  }
});

// For serverless platforms that expect default export
module.exports = app;

// If running standalone for local testing
if (require.main === module) {
  const port = process.env.PORT || 3000; app.listen(port, ()=>console.log('AI proxy listening on',port));
}
