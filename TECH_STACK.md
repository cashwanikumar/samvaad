# Tech Stack

## Core
- **Frontend:** Next.js 14+, TypeScript, Tailwind, shadcn/ui
- **Backend:** Next.js API routes
- **Database:** PostgreSQL (Docker local, managed prod)
- **ORM:** Drizzle
- **Auth:** Clerk
- **AI Voice:** OpenAI Realtime API (WebSocket)
- **Fallback:** Whisper API + GPT + TTS API

## Voice-Specific
- **Realtime API:** Voice-to-voice conversations
- **Whisper:** Speech-to-text transcription
- **TTS:** Text-to-speech synthesis
- **Browser Audio:** MediaRecorder API, Web Audio API
- **WebSocket:** For realtime voice streaming

## Quick Start
```bash
# Install
npx create-next-app@latest ai-interview-platform
pnpm install openai @clerk/nextjs drizzle-orm postgres zod

# Docker
docker-compose up -d    # Start Postgres
pnpm dev                # Run app

# .env.local
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ai_interview
OPENAI_API_KEY=sk-...  # Must have Realtime API access
```

## Phase 1 Focus
- OpenAI Realtime API
- WebSocket connections
- Browser microphone access
- Audio streaming

## Add Later
- Phase 3: Transcript storage
- Phase 6: Voice quality optimization
- Phase 9: Fine-tuning transcripts

