import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import OpenAI from "openai";
import { db } from "@/db";
import { interviewSessions, evaluations } from "@/db/schema";
import { buildEvaluationPrompt } from "@/lib/prompts/evaluation";

const openai = new OpenAI();

const formatTime = (ms: number) => {
  const s = Math.floor(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { sessionId } = await req.json() as { sessionId: string };

    const session = await db.query.interviewSessions.findFirst({
      where: eq(interviewSessions.id, sessionId),
    });

    if (!session || session.userId !== userId) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const transcriptText = session.transcript
      .map((e) => `[${formatTime(e.timestamp)}] ${e.role === "user" ? "Candidate" : "Interviewer"}: "${e.content}"`)
      .join("\n");

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: buildEvaluationPrompt(session.topic) },
        { role: "user", content: `Here is the transcript:\n\n${transcriptText}` },
      ],
    });

    const rawResult = JSON.parse(response.choices[0].message.content!);

    const [evaluation] = await db
      .insert(evaluations)
      .values({
        sessionId,
        signal: rawResult.overall.signal,
        problemScopingScore: rawResult.problem_scoping.score,
        coreSystemFlowScore: rawResult.core_system_flow.score,
        reliabilityTradeoffScore: rawResult.reliability_tradeoff_reasoning.score,
        communicationStructureScore: rawResult.communication_structure.score,
        rawResult,
      })
      .onConflictDoNothing()
      .returning();

    return Response.json({ evaluation });
  } catch (err) {
    console.error("[POST /api/evaluate]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
