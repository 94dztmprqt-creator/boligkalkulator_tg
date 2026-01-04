import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { input, result } = await req.json();

  const prompt = `
Du er en privat norsk eiendomsrådgiver.
Forklar tallene kort og nøkternt.
Vurder risiko, realisme og kontantstrøm.

Input:
${JSON.stringify(input, null, 2)}

Resultat:
${JSON.stringify(result, null, 2)}
`;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return NextResponse.json({
    text: completion.choices[0].message.content,
  });
}
