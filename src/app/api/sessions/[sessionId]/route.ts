import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { interviewSessions, evaluations } from "@/db/schema";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { sessionId } = await params;

    const session = await db.query.interviewSessions.findFirst({
      where: eq(interviewSessions.id, sessionId),
    });

    if (!session || session.userId !== userId) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const evaluation = await db.query.evaluations.findFirst({
      where: eq(evaluations.sessionId, sessionId),
    });

    return Response.json({ session, evaluation: evaluation ?? null });
  } catch (err) {
    console.error("[GET /api/sessions/:id]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
