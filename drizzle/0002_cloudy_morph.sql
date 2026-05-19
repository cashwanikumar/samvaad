DROP TABLE "transcript_entries" CASCADE;--> statement-breakpoint
ALTER TABLE "interview_sessions" ADD COLUMN "transcript" jsonb NOT NULL;