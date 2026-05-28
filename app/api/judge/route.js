import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function applyViralScoreBoost(result) {
  const roll = Math.random();

  let aura;

  if (roll < 0.1) {
    aura = Math.floor(Math.random() * 11) + 90; // 90-100 mythic
  } else if (roll < 0.35) {
    aura = Math.floor(Math.random() * 20) + 70; // 70-89 strong
  } else if (roll < 0.75) {
    aura = Math.floor(Math.random() * 30) + 40; // 40-69 normal
  } else {
    aura = Math.floor(Math.random() * 30) + 10; // 10-39 cooked
  }

  const npc = Math.max(0, Math.min(100, 100 - aura + Math.floor(Math.random() * 21) - 10));
  const villain = Math.max(0, Math.min(100, aura + Math.floor(Math.random() * 31) - 15));

  let rarity = result.rarity;

  if (aura >= 95) rarity = "Mythic • Top 0.3%";
  else if (aura >= 90) rarity = "Legendary • Top 1%";
  else if (aura >= 80) rarity = "Epic • Top 5%";
  else if (aura >= 70) rarity = "Rare • Top 12%";
  else if (aura >= 50) rarity = "Uncommon • Mid Aura";
  else rarity = "Common • Cooked Aura";

  return {
    ...result,
    aura,
    npc,
    villain,
    rarity,
  };
}

export async function POST(req) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return Response.json({ error: "No image provided" }, { status: 400 });
    }

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `
You are AuraJudge.ai, a funny Gen Z aura judging AI.

Analyze ONLY visible things:
- outfit
- pose
- expression
- lighting
- background
- meme energy
- photo vibe

NEVER:
- identify the person
- guess age
- mention race
- mention attractiveness
- mention body type
- mention protected traits
- be hateful

STYLE:
- VERY SHORT
- punchy
- meme-like
- screenshot-worthy
- funny
- slightly dramatic

IMPORTANT:Give 3 SHORT aura improvement tips.
They should be funny but semi-useful.
Focus on:
- pose
- lighting
- outfit
- expression
- background
- confidence
- camera angle
The scores will be adjusted by the app after your response.
Focus on funny nickname, rank, impression, roast, lore, and advice.

STRICT RULES:
nickname: 1-3 words max
rank: 2-5 words max
rarity: 7 words max
impression: 12 words max
roast: 14 words max
lore: 14 words max
advice: 10 words max

Return ONLY raw JSON.
No markdown.
No explanations.
No code blocks.

JSON FORMAT:
{
  "nickname": "string",
  "rank": "string",
  "rarity": "string",
  "aura": 50,
  "npc": 50,
  "villain": 50,
  "impression": "string",
  "roast": "string",
  "lore": "string",
  "advice": "string",
  "tips": [
    "string",
    "string",
    "string"
  ]
}
              `,
            },
            {
              type: "input_image",
              image_url: imageBase64,
            },
          ],
        },
      ],
    });

    const cleaned = response.output_text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let result;

    try {
      result = JSON.parse(cleaned);
    } catch (err) {
      result = {
        nickname: "Aura Glitch",
        rank: "Reality Bender",
        rarity: "Corrupted Output",
        aura: 77,
        npc: 12,
        villain: 84,
        impression: "AI lost its mind.",
        roast: "Even the algorithm got cooked 💀",
        lore: "The scanner entered forbidden territory.",
        advice: "Try another image.",
      };
    }

   const boostedResult = applyViralScoreBoost(result);

if (
  !boostedResult.tips ||
  !Array.isArray(boostedResult.tips) ||
  boostedResult.tips.length === 0
) {
  boostedResult.tips = [
    "Stop posing like an NPC.",
    "Better lighting = instant aura buff.",
    "Background currently lowering rank."
  ];
}
    return Response.json(boostedResult);
  } catch (error) {
    console.error("OPENAI ERROR:", error);

    return Response.json(
      {
        nickname: "Broken Scanner",
        rank: "Aura Scanner Crashed",
        rarity: "System Failure",
        aura: 0,
        npc: 100,
        villain: 0,
        impression: "Servers are fighting demons.",
        roast: "Even the AI gave up 💀",
        lore: "The aura scanner collapsed mid-analysis.",
        advice: "Try again later.",
      },
      { status: 500 }
    );
  }
}