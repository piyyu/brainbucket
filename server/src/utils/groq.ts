import Groq from "groq-sdk";

// Groq retired llama-3.1-8b-instant on 08/16/26. Use a live model.
// Override via Render env: GROQ_MODEL=openai/gpt-oss-20b
// Supports comma-separated fallback list: GROQ_MODEL="openai/gpt-oss-20b,openai/gpt-oss-120b"
const DEFAULT_MODELS = [
  "openai/gpt-oss-20b",
  "openai/gpt-oss-120b",
  "meta-llama/llama-4-maverick-17b-128e-instruct",
  "moonshotai/kimi-k2-instruct-0905",
];

function getConfiguredModels(): string[] {
  const fromEnv = (process.env.GROQ_MODEL || "")
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);
  return fromEnv.length > 0 ? fromEnv : DEFAULT_MODELS;
}

function getGroq(): Groq {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not set");
  }
  return new Groq({ apiKey });
}

function isModelNotFoundError(error: any): boolean {
  const code = error?.error?.code || error?.code;
  const status = error?.status;
  const msg = String(error?.error?.message || error?.message || "");
  return (
    code === "model_not_found" ||
    code === "model_decommissioned" ||
    status === 404 ||
    /does not exist|decommissioned|not found/i.test(msg)
  );
}

export async function askGroq(messages: any[], context: string) {
  const groq = getGroq();
  const models = getConfiguredModels();
  let lastError: any = null;

  for (const model of models) {
    try {
      const completion = await groq.chat.completions.create({
        model,

        messages: [
          {
            role: "system",
            content: `
You are Echo — a helpful, friendly personal AI assistant.

You chat naturally like a normal AI, but you also have access to the user's saved notes (Memory Notes).

If the Memory Notes are relevant to the user's message:
- Use them naturally in your answer.
- Do NOT sound forced.
- Do NOT list them unless needed.
- Simply integrate the info into your explanation.

If they are not relevant, ignore them.
        `.trim()
          },

          {
            role: "system",
            content: `Memory Notes:\n${context || "None"}`
          },

          ...messages
        ],

        temperature: 0.5,
      });

      return completion.choices[0]?.message?.content || "";
    } catch (error: any) {
      lastError = error;
      if (isModelNotFoundError(error)) {
        console.error(`Groq model "${model}" unavailable, trying fallback...`, error?.error?.message || error?.message);
        continue;
      }
      throw error;
    }
  }

  throw lastError ?? new Error("No Groq models available");
}
