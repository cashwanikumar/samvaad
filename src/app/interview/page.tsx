"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useRealtimeVoice } from "@/hooks/useRealtimeVoice";
import type { SessionStatus } from "@/types/realtime";

const statusConfig: Record<
  SessionStatus,
  { label: string; color: string; pulse: boolean }
> = {
  idle: { label: "Ready to start", color: "bg-gray-600", pulse: false },
  connecting: { label: "Connecting...", color: "bg-yellow-500", pulse: true },
  listening: { label: "Listening", color: "bg-green-500", pulse: true },
  "ai-speaking": { label: "AI speaking", color: "bg-blue-500", pulse: true },
  error: { label: "Connection error", color: "bg-red-500", pulse: false },
  ended: { label: "Interview ended", color: "bg-gray-600", pulse: false },
};

export default function InterviewPage() {
  const { status, transcript, error, startedAt, startInterview, endInterview } =
    useRealtimeVoice();
  const router = useRouter();
  const savedRef = useRef(false);

  useEffect(() => {
    if (status !== "ended" || savedRef.current) return;
    savedRef.current = true;

    axios
      .post<{ sessionId: string }>("/api/sessions", {
        topic: "WhatsApp or a similar real-time messaging system",
        transcript,
        startedAt: startedAt.current ?? Date.now(),
      })
      .then(({ data }) => {
        axios.post("/api/evaluate", { sessionId: data.sessionId }).catch(console.error);
        router.push(`/sessions/${data.sessionId}`);
      })
      .catch(console.error);
  }, [status]);

  const { label, color, pulse } = statusConfig[status];
  const isActive = status === "listening" || status === "ai-speaking";
  const canStart = status === "idle" || status === "error" || status === "ended";

  return (
    <div className="min-h-screen flex flex-col max-w-2xl mx-auto p-6 gap-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-4">
        <div>
          <h1 className="text-xl font-semibold">System Design Interview</h1>
          <p className="text-gray-500 text-sm">Design WhatsApp</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${color} ${pulse ? "animate-pulse" : ""}`}
          />
          <span className="text-sm text-gray-400">{label}</span>
        </div>
      </div>

      {/* Transcript */}
      <div className="flex-1 bg-gray-900 border border-gray-800 rounded-2xl p-5 overflow-y-auto min-h-64 space-y-4">
        {transcript.length === 0 ? (
          <p className="text-gray-600 text-sm text-center mt-8">
            {status === "idle"
              ? "Start the interview to begin"
              : "Waiting for conversation..."}
          </p>
        ) : (
          transcript.map((entry) => (
            <div
              key={entry.id}
              className={`flex gap-3 ${entry.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-medium ${
                  entry.role === "assistant"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                {entry.role === "assistant" ? "AI" : "You"}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  entry.role === "assistant"
                    ? "bg-gray-800 text-gray-100 rounded-tl-sm"
                    : "bg-gray-700 text-gray-100 rounded-tr-sm"
                }`}
              >
                {entry.content}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-950 border border-red-800 rounded-xl px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3 pb-4">
        {canStart ? (
          <button
            onClick={startInterview}
            className="flex-1 bg-white text-gray-950 font-semibold py-3.5 rounded-xl hover:bg-gray-100 transition-colors"
          >
            🎤 Start Interview
          </button>
        ) : (
          <>
            <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl py-3.5 text-center text-sm text-gray-500">
              {status === "connecting"
                ? "Connecting to AI..."
                : "Interview in progress — speak naturally"}
            </div>
            <button
              onClick={endInterview}
              disabled={status === "connecting"}
              className="bg-red-900 hover:bg-red-800 text-red-200 font-medium px-5 py-3.5 rounded-xl transition-colors disabled:opacity-50"
            >
              End
            </button>
          </>
        )}
      </div>
    </div>
  );
}
