import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const INTERVIEW_INSTRUCTIONS = `You are a senior staff engineer conducting a system design interview.
The candidate must design WhatsApp.

Your behavior:
- Start by greeting the candidate and asking them to begin
- Ask probing follow-up questions (scalability, data models, trade-offs, failure modes)
- Do NOT give answers — only probe and guide
- Keep responses concise (2-3 sentences max) — this is a voice interview
- After 15 minutes, wrap up and thank them`;

export async function POST() {
  try {
    const response = await openai.realtime.clientSecrets.create({
      session: {
        type: "realtime",
        model: "gpt-realtime",
        instructions: INTERVIEW_INSTRUCTIONS,
        audio: {
          input: {
            turn_detection: {
              type: "server_vad",
              threshold: 0.5,
              silence_duration_ms: 500,
              prefix_padding_ms: 300,
            },
            transcription: { model: "whisper-1" },
          },
          output: {
            voice: "alloy",
          },
        },
      },
    });

    console.log("Session created:", response.session);

    return NextResponse.json({
      clientSecret: response.value,
      expiresAt: response.expires_at,
    });
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
