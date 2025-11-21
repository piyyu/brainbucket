import Groq from "groq-sdk";

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function askGroq(prompt: string, context: string) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content:
`SMART MODE:
You are Echo, the user's intelligent second brain.

You behave like a normal AI assistant.

Memory rules:
- If memory is highly relevant, use it naturally in the answer.
- If memory is partially relevant, mention what the note contains and clarify what is missing.
- If memory is unrelated, ignore it entirely.
- NEVER say "I don't know yet" in smart mode.
- NEVER ignore a partially relevant note.
- NEVER guess missing information.

You may use general knowledge freely.
Be friendly, clear, and conversational.
`
      },
      {
        role: "system",
        content: `Memory Notes:\n${context}`
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.4
  });

  return completion.choices[0]?.message?.content || "";
}
