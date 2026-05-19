"use client";

import { useState, useRef, useCallback } from "react";
import type { SessionStatus, TranscriptEntry } from "@/types/realtime";


export function useRealtimeVoice() {
  const [status, setStatus] = useState<SessionStatus>("idle");
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Refs for WebSocket and audio — refs don't trigger re-renders
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const aiTranscriptRef = useRef<string>("");
  const nextPlayTimeRef = useRef<number>(0);
  const startedAtRef = useRef<number | null>(null);

  // TODO: Implement this helper — appends a transcript entry
  // Hint: use crypto.randomUUID() for the id, Date.now() for timestamp
  const addTranscriptEntry = useCallback(
    (role: TranscriptEntry["role"], content: string) => {
      setTranscript(prev => ([
        ...prev,
        {
          id: crypto.randomUUID(),
          role,
          content,
          timestamp: Date.now() - (startedAtRef.current ?? Date.now())
        }
      ]))
    },
    []
  );

  // TODO: Implement this — handles incoming WebSocket events from OpenAI
  // GA API event names (changed from beta):
  //   "session.created"                                       → setStatus("listening")
  //   "input_audio_buffer.speech_started"                     → setStatus("listening")
  //   "response.output_audio.delta"                           → play audio (see playAudioDelta)
  //   "response.output_audio_transcript.delta"                → accumulate AI transcript text
  //   "conversation.item.input_audio_transcription.completed" → add user transcript entry
  //   "response.done"                                         → setStatus("listening"), commit AI transcript
  const handleServerEvent = useCallback(
    (event: MessageEvent) => {
      const serverEvent = JSON.parse(event.data as string);
      console.log("[Realtime]", serverEvent.type, serverEvent);

      // YOUR CODE HERE
      switch (serverEvent.type) {
        case "session.created":
          setStatus("listening");
          break;
        case "input_audio_buffer.speech_started":
          setStatus("listening");
          break;
        case "response.output_audio.delta":
          setStatus("ai-speaking");
          playAudioDelta(serverEvent.delta);
          break;
        case "response.output_audio_transcript.delta":
          aiTranscriptRef.current += serverEvent.delta;
          break;
        case "conversation.item.input_audio_transcription.completed":
          if (serverEvent.transcript) {
            addTranscriptEntry("user", serverEvent.transcript);
          }
          break;
        case "response.done":
          if (aiTranscriptRef.current) {
            addTranscriptEntry("assistant", aiTranscriptRef.current);
            aiTranscriptRef.current = "";
          }
          setStatus("listening");
          break;

      }
    },
    [addTranscriptEntry]
  );

  // TODO: Implement this — decodes a base64 PCM16 audio delta and plays it
  // Steps:
  //   1. atob(base64String) → binary string
  //   2. Convert to Uint8Array → Int16Array (PCM16)
  //   3. Convert Int16Array to Float32Array (divide each sample by 32768)
  //   4. Create AudioBuffer at 24000 Hz with the float samples
  //   5. AudioBufferSourceNode → connect to audioContext.destination → start()
  const playAudioDelta = useCallback(
    (base64Chunk: string) => {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      }
      const ctx = audioContextRef.current;

      const binary = atob(base64Chunk);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

      const pcm16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(pcm16.length);
      for (let i = 0; i < pcm16.length; i++) float32[i] = pcm16[i] / 32768;

      const buffer = ctx.createBuffer(1, float32.length, 24000);
      buffer.copyToChannel(float32, 0);

      const startAt = Math.max(ctx.currentTime, nextPlayTimeRef.current);

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(startAt);

      nextPlayTimeRef.current = startAt + buffer.duration;
    },
    []
  );

  // TODO: Implement this — sends microphone audio to OpenAI via WebSocket
  // Steps:
  //   1. navigator.mediaDevices.getUserMedia({ audio: true }) — get mic stream
  //   2. new AudioContext({ sampleRate: 24000 }) — match OpenAI's expected rate
  //   3. Load an AudioWorklet processor to handle float32→int16 conversion
  //      (create src/worklets/audio-processor.js for this)
  //   4. Connect: micSource → workletNode
  //   5. workletNode.port.onmessage: receive int16 chunks → base64 → send via WS
  const startAudioCapture = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaStreamRef.current = stream;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext({ sampleRate: 24000 });
    }
    const ctx = audioContextRef.current;

    await ctx.audioWorklet.addModule("/worklets/audio-processor.js");

    const micSource = ctx.createMediaStreamSource(stream);
    const workletNode = new AudioWorkletNode(ctx, "audio-processor");
    workletNodeRef.current = workletNode;

    workletNode.port.onmessage = (event) => {
      if (wsRef.current?.readyState !== WebSocket.OPEN) return;

      const uint8 = new Uint8Array(event.data as ArrayBuffer);
      let binary = "";
      for (let i = 0; i < uint8.length; i++) binary += String.fromCharCode(uint8[i]);

      wsRef.current.send(JSON.stringify({
        type: "input_audio_buffer.append",
        audio: btoa(binary),
      }));
    };

    micSource.connect(workletNode);
  }, []);

  const stopAudioCapture = useCallback(() => {
    workletNodeRef.current?.disconnect();
    workletNodeRef.current = null;
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    mediaStreamRef.current = null;
    audioContextRef.current?.close();
    audioContextRef.current = null;
  }, []);

  const startInterview = useCallback(async () => {
    setStatus("connecting");
    setError(null);
    setTranscript([]);
    startedAtRef.current = Date.now();

    try {
      // Step 1: Get ephemeral token from our API route
      const res = await fetch("/api/session", { method: "POST" });
      if (!res.ok) throw new Error("Failed to get session token");
      const { clientSecret } = await res.json();

      // Step 2: Open WebSocket to OpenAI Realtime API
      const ws = new WebSocket(
        "wss://api.openai.com/v1/realtime?model=gpt-realtime",
        ["realtime", `openai-insecure-api-key.${clientSecret}`]
      );
      wsRef.current = ws;

      ws.onopen = () => {
        // Session is already configured server-side via clientSecrets.create
        startAudioCapture();
      };

      ws.onmessage = (event) => handleServerEvent(event);

      ws.onerror = () => {
        setError("WebSocket connection failed");
        setStatus("error");
      };

      ws.onclose = () => setStatus("ended");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  }, [handleServerEvent, startAudioCapture]);

  const endInterview = useCallback(() => {
    wsRef.current?.close();
    wsRef.current = null;
    stopAudioCapture();
    setStatus("ended");
  }, [stopAudioCapture]);

  return {
    status,
    transcript,
    error,
    startedAt: startedAtRef,
    startInterview,
    endInterview,
  };
}
