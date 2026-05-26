import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { imageBase64 } = await req.json();

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
  "aura": 0,
  "npc": 0,
  "villain": 0,
  "impression": "string",
  "roast": "string",
  "lore": "string",
  "advice": "string"
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

    console.log("RAW AI:", cleaned);

    let result;

    try {
      result = JSON.parse(cleaned);
    } catch (err) {
      console.error("JSON PARSE ERROR:", err);

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

    return Response.json(result);

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