import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { interviewSessions } from "@/db/schema";
import type { TranscriptEntry } from "@/types/realtime";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { topic, transcript, startedAt } = await req.json() as {
      topic: string;
      transcript: TranscriptEntry[];
      startedAt: number;
    };

    const [session] = await db
      .insert(interviewSessions)
      .values({
        userId,
        topic,
        status: "completed",
        transcript,
        startedAt: new Date(startedAt),
        endedAt: new Date(),
      })
      .returning();

    return Response.json({ sessionId: session.id });
  } catch (err) {
    console.error("[POST /api/sessions]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
