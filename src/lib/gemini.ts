import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.9,
  },
});

// Safely parse JSON even if Gemini wraps it in markdown code fences
function safeParseJSON(text: string) {
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  return JSON.parse(cleaned);
}

interface Participant {
  name: string;
  rawInput: string;
}

// Step 1: Parse chaotic preferences into structured data
export async function parsePreferences(participants: Participant[]) {
  const list = participants.map((p) => `- ${p.name}: "${p.rawInput}"`).join("\n");

  const prompt = `You are a witty Filipino AI food mediator. Parse these chaotic food preferences into structured data.

Participants:
${list}

Return JSON with this EXACT structure:
{
  "parsed": [
    {
      "name": "string",
      "budget": "string (e.g. '100-200 pesos' or 'unlimited' or 'tipid mode')",
      "cuisine": ["string array of preferred cuisines"],
      "dealbreakers": ["string array of things they DON'T want"],
      "mood": "string (one-line vibe summary)",
      "summary": "string (witty 1-sentence analysis of this person in Taglish)"
    }
  ]
}

Be funny and use Taglish in the summaries. If their input is vague like "kahit saan", roast them gently.`;

  const result = await model.generateContent(prompt);
  return safeParseJSON(result.response.text());
}

// Step 2: Find conflicts and negotiate
export async function negotiateConflicts(parsedData: any) {
  const prompt = `You are a Filipino AI food mediator. Analyze these parsed food preferences and find conflicts.

Parsed preferences:
${JSON.stringify(parsedData.parsed, null, 2)}

Return JSON with this EXACT structure:
{
  "conflicts": ["string array of specific conflicts found, e.g. 'Maria wants samgyup pero si Juan ₱80 lang dala'"],
  "compromises": ["string array of proposed solutions"],
  "compatibility_score": number (0-100, how compatible ang grupo),
  "commentary": "string (witty Taglish commentary on the group dynamics, 2-3 sentences max)"
}

Be snarky but helpful. Use Taglish humor. If there are no real conflicts, make fun of how boring and agreeable they are.`;

  const result = await model.generateContent(prompt);
  return safeParseJSON(result.response.text());
}

// Step 3: Deliver the final verdict
export async function deliverVerdict(negotiation: any, parsedData: any) {
  const prompt = `You are a Filipino AI food mediator delivering the FINAL verdict on where to eat.

Group preferences: ${JSON.stringify(parsedData.parsed, null, 2)}
Negotiation results: ${JSON.stringify(negotiation, null, 2)}

Return JSON with this EXACT structure:
{
  "pick": "string (specific restaurant or food type, e.g. 'Mang Inasal' or 'Samgyupsal sa kanto')",
  "cuisine": "string (cuisine type)",
  "estimated_budget": "string (per person estimate in pesos)",
  "reason": "string (2-3 sentence Taglish justification that's funny but logical)",
  "blame": {
    "who": "string (name of the person who made this hardest)",
    "why": "string (funny Taglish reason)"
  },
  "backup_plan": "string (if the pick doesn't work out, e.g. 'Jollibee na lang talaga')",
  "group_message": "string (a funny Taglish message to paste in the group chat announcing the decision)"
}

Make it hilarious. The verdict should feel like a Supreme Court decision but for lunch.`;

  const result = await model.generateContent(prompt);
  return safeParseJSON(result.response.text());
}
