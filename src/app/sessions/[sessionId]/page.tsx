"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import type { TranscriptEntry } from "@/types/realtime";

interface DimensionResult {
  evidence: { timestamp: string; quote: string; supports: string }[];
  score: number;
  rationale: { based_on_evidence: string; limitations: string };
}

interface EvaluationResult {
  problem_scoping: DimensionResult;
  core_system_flow: DimensionResult;
  reliability_tradeoff_reasoning: DimensionResult;
  communication_structure: DimensionResult;
  calibration: { score_adjustments: unknown[]; notes: string };
  overall: { signal: "strong" | "mixed" | "weak"; strengths: string[]; risks: string[] };
}

interface Session {
  id: string;
  topic: string;
  startedAt: string;
  endedAt: string;
  transcript: TranscriptEntry[];
}

interface Evaluation {
  rawResult: EvaluationResult;
  signal: string;
  problemScopingScore: number;
  coreSystemFlowScore: number;
  reliabilityTradeoffScore: number;
  communicationStructureScore: number;
}

const DIMENSIONS = [
  { key: "problemScopingScore", label: "Problem Scoping", resultKey: "problem_scoping" },
  { key: "coreSystemFlowScore", label: "Core System Flow", resultKey: "core_system_flow" },
  { key: "reliabilityTradeoffScore", label: "Reliability & Tradeoffs", resultKey: "reliability_tradeoff_reasoning" },
  { key: "communicationStructureScore", label: "Communication", resultKey: "communication_structure" },
] as const;

const signalColors = {
  strong: "bg-green-900 text-green-300 border-green-700",
  mixed: "bg-yellow-900 text-yellow-300 border-yellow-700",
  weak: "bg-red-900 text-red-300 border-red-700",
};

const scoreColor = (score: number) => {
  if (score >= 4) return "text-green-400";
  if (score >= 3) return "text-yellow-400";
  return "text-red-400";
};

const formatTime = (ms: number) => {
  const s = Math.floor(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

export default function SessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<Session | null>(null);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let attempts = 0;
    const MAX_ATTEMPTS = 20; // 60s max (20 × 3s)

    const poll = async () => {
      try {
        const { data } = await axios.get(`/api/sessions/${sessionId}`);
        setSession(data.session);
        if (data.evaluation) {
          setEvaluation(data.evaluation);
          setLoading(false);
        } else if (attempts < MAX_ATTEMPTS) {
          attempts++;
          timer = setTimeout(poll, 3000);
        } else {
          setLoading(false); // gave up — show transcript without evaluation
        }
      } catch {
        setLoading(false);
      }
    };

    poll();
    return () => clearTimeout(timer);
  }, [sessionId]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  const raw = evaluation?.rawResult;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8 py-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm mb-1">System Design Interview</p>
          <h1 className="text-xl font-semibold">{session.topic}</h1>
        </div>
        {evaluation ? (
          <span className={`text-sm font-medium px-3 py-1 rounded-full border capitalize ${signalColors[evaluation.signal as keyof typeof signalColors]}`}>
            {evaluation.signal}
          </span>
        ) : (
          <span className="text-sm text-gray-500 animate-pulse">Evaluating...</span>
        )}
      </div>

      {/* Scores */}
      {evaluation ? (
        <div className="grid grid-cols-2 gap-3">
          {DIMENSIONS.map(({ key, label }) => (
            <div key={key} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-gray-500 text-xs mb-2">{label}</p>
              <p className={`text-2xl font-bold ${scoreColor(evaluation[key as keyof Evaluation] as number)}`}>
                {evaluation[key as keyof Evaluation] as number}<span className="text-gray-600 text-base font-normal">/5</span>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {DIMENSIONS.map(({ label }) => (
            <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 animate-pulse">
              <p className="text-gray-700 text-xs mb-2">{label}</p>
              <div className="h-8 w-12 bg-gray-800 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Strengths & Risks */}
      {raw && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-2">
            <p className="text-gray-500 text-xs">Strengths</p>
            {raw.overall.strengths.map((s, i) => (
              <p key={i} className="text-sm text-gray-300">{s}</p>
            ))}
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-2">
            <p className="text-gray-500 text-xs">Risks</p>
            {raw.overall.risks.map((r, i) => (
              <p key={i} className="text-sm text-gray-300">{r}</p>
            ))}
          </div>
        </div>
      )}

      {/* Dimension rationale */}
      {raw && (
        <div className="space-y-3">
          <p className="text-gray-500 text-xs uppercase tracking-wide">Detailed Feedback</p>
          {DIMENSIONS.map(({ label, resultKey }) => {
            const dim = raw[resultKey];
            return (
              <div key={resultKey} className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">{label}</p>
                  <p className={`text-sm font-bold ${scoreColor(dim.score)}`}>{dim.score}/5</p>
                </div>
                <p className="text-sm text-gray-300">{dim.rationale.based_on_evidence}</p>
                {dim.rationale.limitations !== "No major limitation shown." && (
                  <p className="text-sm text-gray-500">{dim.rationale.limitations}</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Transcript */}
      <div className="space-y-3">
        <p className="text-gray-500 text-xs uppercase tracking-wide">Transcript</p>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
          {session.transcript.map((entry) => (
            <div key={entry.id} className={`flex gap-3 ${entry.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-medium ${
                entry.role === "assistant" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
              }`}>
                {entry.role === "assistant" ? "AI" : "You"}
              </div>
              <div className="flex flex-col gap-0.5 max-w-[80%]">
                <span className={`text-xs text-gray-600 ${entry.role === "user" ? "text-right" : ""}`}>
                  {formatTime(entry.timestamp)}
                </span>
                <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  entry.role === "assistant"
                    ? "bg-gray-800 text-gray-100 rounded-tl-sm"
                    : "bg-gray-700 text-gray-100 rounded-tr-sm"
                }`}>
                  {entry.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
