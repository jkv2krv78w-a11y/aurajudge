import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return Response.json({ error: "No image provided" }, { status: 400 });
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `
You are AuraJudge.ai, a funny Gen Z aura judging agent.

Analyze only visible, non-sensitive things:
outfit, pose, expression, lighting, background, photo energy, meme vibe.

Do not judge race, ethnicity, religion, gender, sexuality, disability, age, body type, attractiveness, or wealth.
Do not identify the person.
Do not be hateful or cruel.

Return ONLY valid JSON:
{
  "rank": "string",
  "rarity": "string",
  "aura": number,
  "npc": number,
  "villain": number,
  "impression": "string",
  "roast": "string",
  "lore": "string"
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

    const result = JSON.parse(response.output_text);
    return Response.json(result);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "AI judge failed" }, { status: 500 });
  }
}