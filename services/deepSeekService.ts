import { UserPreferences, NameResponse } from "../types";

// Helper to clean up Markdown code blocks if the AI returns them
const cleanJsonString = (str: string): string => {
  return str.replace(/```json\n?|\n?```/g, "").trim();
};

export const generateNames = async (prefs: UserPreferences): Promise<NameResponse> => {
  
  // Explicit instruction mapping for style strictness
  const styleInstructions: Record<string, string> = {
    "传统国风": "核心要求：引经据典，体现深厚的国学底蕴。多取自《周易》、《论语》、《孟子》等经典，强调‘雅正’与‘气节’。名字应具有大家风范，稳重端庄。",
    "现代简约": "核心要求：符合现代审美，字形简洁好看，笔画不宜繁杂。读音要朗朗上口，响亮悦耳。拒绝老气横秋，追求洋气、清新、阳光的感觉。",
    "五行平衡": "核心要求：将‘五行补救’作为第一优先级。必须精准分析八字喜用神，选用相应五行属性的字来平衡命理。在补益五行的基础上兼顾好听。",
    "诗词歌赋": "核心要求：名字必须直接取材于著名的古诗词（如诗经、楚辞、唐诗宋词）。讲究‘画意诗情’，必须在分析中明确指出‘取自某朝某人某诗’，意境要美。",
    "高雅独特": "核心要求：避开大众常用字（如子、涵、轩等），追求独特性与清冷的高级感。用字可稍选冷门但不可生僻（确保能读能写），旨在打造独特的个人气质。"
  };

  const specificStylePrompt = styleInstructions[prefs.style] || "核心要求：根据用户描述的风格进行创作。";

  // System instruction with JSON structure definition
  const systemInstruction = `
### 角色定义 (Role)
你是一位拥有20年经验的资深起名专家，精通中国传统国学（诗经、楚辞、周易）、现代汉语言学、儿童心理学以及西方文化。
你的服务对象是注重审美、追求科学育儿的“Z世代”年轻父母。
你的核心任务是：基于用户提供的基本信息，输出 **1个** 极致精选的 JSON 格式 起名方案。

### 核心任务与卖点 (Core Tasks)
1.  **大名 (Chinese Name)**：
    *   **只生成一个** 最完美的名字。
    *   **拒绝网红感**：严禁使用“紫涵、子轩、浩宇、欣怡”等烂大街的字。
    *   **审美标准**：追求“新中式”美学，名字要如清泉般透彻，或如山岳般稳重。
    *   **风格一致性**：必须严格执行用户的“风格偏好”指令，不要偏题。
2.  **详细维度的分析 (Detailed Analysis)**：
    *   **音律 (Sound)**：分析平仄、声调搭配。
    *   **字形 (Shape)**：分析结构平衡、书写美感。
    *   **寓意 (Meaning)**：分析字的本义与引申义。
    *   **文化 (Culture)**：引用诗词典故，体现底蕴。
    *   **平衡 (Balance)**：结合五行（根据出生日期），分析对命理的补充。
3.  **命理百科 (Fortune Info)**：
    *   准确计算生肖、星座。
    *   简单分析五行强弱，并给出建议。
4.  **心理学赋能 (Psychology)**：
    *   **MBTI 彩蛋**：匹配一个最合适的 MBTI 人格，并给出性格潜能描述。
5.  **全案配套 (Full Package)**：
    *   **乳名 (Nickname)**：
        *   **核心原则**：严禁“偷懒”。**绝对禁止**简单使用“小 + 名字最后一个字”的格式（如：大名景曜，禁止叫小曜）。
        *   **意象联想**：必须根据大名的含义，提取相关的自然意象或可爱事物。
        *   *示例*：大名“陈澈”（寓意清澈）-> 乳名“冰糖”（透亮感）；大名“云深” -> 乳名“小云朵”或“绵绵”。
    *   **英文名**：现代、好听，拒绝 "Apple, Happy" 等。

### 输出数据结构 (Output Structure)
请严格按照以下 JSON 格式输出，不要包含任何 Markdown 格式以外的文本：

{
  "names": [
    {
      "chinese_name": "名字 (String)",
      "pinyin": "Pin Yin (String)",
      "scores": {
        "total": 95 (Int),
        "sound": 90 (Int),
        "shape": 90 (Int),
        "meaning": 90 (Int),
        "culture": 90 (Int),
        "balance": 90 (Int)
      },
      "mbti": {
        "type": "ENFP (String)",
        "desc": "描述 (String)"
      },
      "bazi": {
        "zodiac": "生肖 (String)",
        "zodiac_desc": "描述 (String)",
        "constellation": "星座 (String)",
        "constellation_desc": "描述 (String)",
        "wuxing": "五行 (String)",
        "wuxing_desc": "描述 (String)"
      },
      "analysis": {
        "sound_analysis": "描述 (String)",
        "shape_analysis": "描述 (String)",
        "meaning_analysis": "描述 (String)",
        "culture_analysis": "描述 (String)",
        "balance_analysis": "描述 (String)"
      },
      "nickname": {
        "name": "乳名 (String)",
        "meaning": "含义 (String)"
      },
      "english_name": {
        "name": "English Name (String)",
        "meaning": "含义 (String)"
      },
      "summary": "综合评价 (String)",
      "tags": ["标签1", "标签2", "标签3"]
    }
  ]
}

### 避雷指南 (Negative Constraints)
1.  **禁生僻字**。
2.  **禁谐音梗**。
3.  **禁土味**。
`;

  const userPrompt = `
请为以下宝宝生成 **1个** 最佳起名方案：
- 姓氏：${prefs.surname}
- 性别：${prefs.gender === 'boy' ? '男' : prefs.gender === 'girl' ? '女' : '不限'}
- 出生日期：${prefs.birthDate} ${prefs.birthTime}
- 风格偏好：【${prefs.style}】
- 补充要求：${prefs.additionalNotes || '无'}

### 特别指令 (Critical Instruction)
**本次起名必须严格遵循以下【${prefs.style}】的风格定义：**
${specificStylePrompt}

**请确保生成的分析文案中，针对该风格做重点阐述。如果风格不符，该方案将被视为失败。**
`;

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: userPrompt,
        cardCode: prefs.cardKey,
        systemInstruction: systemInstruction
      })
    });

    if (response.status === 401) {
      throw new Error("卡密验证失败，请输入正确的卡密。");
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || "服务器繁忙，请稍后再试");
    }

    const data = await response.json();
    
    // DeepSeek standard response structure
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) throw new Error("AI 没有返回有效内容");

    const jsonStr = cleanJsonString(content);
    return JSON.parse(jsonStr) as NameResponse;

  } catch (error) {
    console.error("Error generating names:", error);
    throw error;
  }
};