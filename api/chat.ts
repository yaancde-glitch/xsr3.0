import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // 1. 设置 CORS (允许前端跨域访问)
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // 2. 处理预检请求 (OPTIONS)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 3. 限制只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message, cardCode, systemInstruction } = req.body;

    // ===========================
    // 💰 核心商业化逻辑开始
    // ===========================

    // A. 检查是否提供了卡密
    if (!cardCode) {
      return res.status(401).json({ error: "请输入使用卡密" });
    }

    // B. 去数据库查询卡密余额
    const remainingUses = await kv.get<number>(cardCode);

    // C. 验证卡密是否存在
    if (remainingUses === null) {
      return res.status(401).json({ error: "卡密无效，请核对或联系客服" });
    }

    // D. 验证余额是否充足
    if (remainingUses <= 0) {
      return res.status(403).json({ error: "您的卡密次数已用完，请重新购买" });
    }

    // E. 扣费 (次数 - 1)
    await kv.decr(cardCode);

    // ===========================
    // 💰 核心商业化逻辑结束
    // ===========================


    // 4. 调用 DeepSeek API
    const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
    
    if (!DEEPSEEK_API_KEY) {
        throw new Error("服务器未配置 DEEPSEEK_API_KEY");
    }

    // 【修改点1】生成随机 ID，用于打破 AI 的缓存惯性
    const randomId = Math.random().toString(36).substring(7) + Date.now().toString();

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      // 【修改点2】防止 Vercel 边缘网络缓存此请求
      cache: 'no-store',
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemInstruction || "You are a helpful assistant." },
          // 【修改点3】将随机 ID 加入 content，让 AI 认为这是一个全新的请求
          { role: "user", content: `${message}\n\n(System_Request_ID: ${randomId})` }
        ],
        response_format: { type: "json_object" },
        temperature: 1.2 // 【修改点4】稍微调高一点温度，增加创造性
      })
    });

    // 5. 处理 DeepSeek 的响应
    if (!response.ok) {
        const errorText = await response.text();
        console.error("DeepSeek API Error:", errorText);
        return res.status(response.status).json({ error: "AI生成失败，请稍后再试", details: errorText });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error: any) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: error.message || "服务器内部错误" });
  }
}
