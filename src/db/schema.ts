import { pgTable, uuid, text, integer, timestamp, jsonb, unique } from "drizzle-orm/pg-core";
import type { TranscriptEntry } from "@/types/realtime";

export const interviewSessions = pgTable("interview_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  topic: text("topic").notNull(),
  status: text("status", { enum: ["completed", "error"] }).notNull(),
  transcript: jsonb("transcript").$type<TranscriptEntry[]>().notNull(),
  startedAt: timestamp("started_at").notNull(),
  endedAt: timestamp("ended_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const evaluations = pgTable("evaluations", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id")
    .notNull()
    .references(() => interviewSessions.id, { onDelete: "cascade" }),
  signal: text("signal", { enum: ["strong", "mixed", "weak"] }).notNull(),
  problemScopingScore: integer("problem_scoping_score").notNull(),
  coreSystemFlowScore: integer("core_system_flow_score").notNull(),
  reliabilityTradeoffScore: integer("reliability_tradeoff_score").notNull(),
  communicationStructureScore: integer("communication_structure_score").notNull(),
  rawResult: jsonb("raw_result").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [unique().on(t.sessionId)]);
