# AI Voice Interview Platform

**Voice-first AI interview practice platform where users speak with AI in realtime.**

---

## Project Overview

This is both:
1. **A real product** - Voice interview practice platform
2. **A learning vehicle** - Deep AI engineering education

Built with agile methodology: ship working product every 2 weeks while learning AI concepts deeply.

---

## Quick Links

- **PRODUCT_VISION.md** - What we're building (full platform vision)
- **AGILE_ROADMAP.md** - How we're building it (15 phases, 2 weeks each)
- **TECH_STACK.md** - Technology choices
- **CLAUDE.md** - Guidelines for AI assistants helping with this project
- **project-status.json** - Current progress tracker

---

## Current Status

**Phase:** 1 (Proof of Concept)  
**Status:** Not started  
**Goal:** Build hardcoded voice interview to prove concept works

---

## What We're Building

### MVP (Phase 1-6)
- Realtime voice interviews with AI
- User speaks, AI responds with voice
- Live transcript during interview
- Structured evaluation and feedback
- Progress tracking dashboard

### Platform (Phase 7-15)
- Admin panel to create interview templates
- Multiple interview types (system design, frontend, backend, behavioral)
- Learning paths (beginner → advanced)
- Analytics and insights
- Monetization (free + paid tiers)

---

## Tech Stack

- **Frontend:** Next.js 14+, TypeScript, Tailwind, shadcn/ui
- **Voice AI:** OpenAI Realtime API (WebSocket)
- **Database:** PostgreSQL (Docker local)
- **Auth:** Clerk
- **Deployment:** Vercel

---

## What You'll Learn

### AI Concepts (By Phase):
- **Phase 1-2:** Realtime API, WebSocket voice, audio streaming
- **Phase 3:** Structured outputs, evaluation prompts
- **Phase 4:** Template systems, prompt management
- **Phase 7:** Database-driven AI content
- **Phase 8:** Voice architecture comparison (Realtime vs Traditional)
- **Phase 10:** Fine-tuning on voice transcripts
- **Phase 13:** Advanced evaluation systems

### By End (Phase 15):
- Expert-level prompt engineering
- Realtime voice AI systems
- Two voice architectures (Realtime API + traditional pipeline)
- Fine-tuning workflows
- Production AI deployment
- Evaluation infrastructure
- Cost optimization strategies

---

## Development Approach

**Agile / Vertical Slices:**
- Ship working product every 2 weeks
- Each phase = complete feature end-to-end
- Production-ready from Phase 2
- User feedback drives roadmap
- Learning integrated into building

---

## Getting Started

See AGILE_ROADMAP.md → Phase 1

**Phase 1 Goal:**
- User clicks "Start Interview"
- Speaks into microphone
- AI asks "Design WhatsApp" via voice
- User responds via voice
- Live transcript shows conversation
- Session ends

No auth, no database. Just prove voice works.

---

## Development

### Prerequisites

- Node.js 20+
- Docker
- pnpm

### Installation

```bash
git clone <repository-url>
pnpm install
cp .env.example .env.local
docker compose up -d
pnpm db:migrate
```

### Running the app

```bash
pnpm dev
```

Open http://localhost:3000 in your browser.

See [SETUP.md](./SETUP.md) for detailed configuration and troubleshooting.

---

## Core Principles

1. **Learning by building** - No forced courses, learn what's needed when needed
2. **Ship early, ship often** - Production from Phase 2
3. **Vertical slices** - Complete features, not layers
4. **Real users** - Get feedback, iterate
5. **AI learning first** - Product is vehicle for deep AI education

---

## Project Structure (Future)

```
ai-interview-platform/
├── src/
│   ├── app/              # Next.js app
│   ├── components/       # UI components
│   ├── lib/
│   │   ├── ai/          # AI prompts, Realtime API
│   │   ├── db/          # Database schema
│   │   └── voice/       # Voice handling
│   └── types/           # TypeScript types
├── PRODUCT_VISION.md    # What we're building
├── AGILE_ROADMAP.md     # How we're building it
├── TECH_STACK.md        # Tech decisions
└── project-status.json  # Current progress
```

---

## Success Metrics

- **Phase 2:** 10 people try it
- **Phase 4:** 5 people use multiple times
- **Phase 6:** 1 person uses weekly
- **Phase 9:** Can add interview without code
- **Phase 15:** 1 person pays

---

## Why This Project?

**Primary goal:** Learn AI engineering deeply through building

**Not by:**
- Watching endless tutorials
- Taking courses
- Reading papers only

**But by:**
- Building real product
- Hitting real problems
- Solving them
- Shipping to users
- Iterating based on feedback

**Product success is validation of learning.**
