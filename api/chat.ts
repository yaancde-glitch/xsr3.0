import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS Handling
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message, cardCode, systemInstruction } = req.body;

  // 1. Card Key Verification
  const SERVER_CARD_KEY = process.env.CARD_KEY;
  
  // If CARD_KEY is set on server, enforce it.
  if (SERVER_CARD_KEY) {
    if (!cardCode || cardCode !== SERVER_CARD_KEY) {
      return res.status(401).json({ error: "无效的卡密 (Invalid Card Key)" });
    }
  }

  // 2. DeepSeek API Call
  const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
  if (!DEEPSEEK_API_KEY) {
     console.error("DEEPSEEK_API_KEY is not set");
     return res.status(500).json({ error: "Server API configuration error." });
  }

  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemInstruction || "You are a helpful assistant." },
          { role: "user", content: message }
        ],
        response_format: {
          type: "json_object"
        },
        temperature: 1.1 // Slightly creative for naming
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("DeepSeek API Error:", errorText);
      return res.status(response.status).json({ error: "AI Provider Error", details: errorText });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error: any) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}