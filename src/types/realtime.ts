export type SessionStatus =
  | "idle"
  | "connecting"
  | "listening"
  | "ai-speaking"
  | "error"
  | "ended";

export type TranscriptRole = "user" | "assistant";

export interface TranscriptEntry {
  id: string;
  role: TranscriptRole;
  content: string;
  timestamp: number;
}
