import Groq from "groq-sdk";

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function askGroq(messages: any[], context: string) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",

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
}
