# Project Setup Guide

## Files Overview

### Core Documents
1. **README.md** - Project overview (start here)
2. **PRODUCT_VISION.md** - Full product vision
3. **AGILE_ROADMAP.md** - 15 phases of development
4. **TECH_STACK.md** - Technology choices
5. **CLAUDE.md** - AI assistant guidelines
6. **project-status.json** - Progress tracker

### Infrastructure
7. **docker-compose.yml** - PostgreSQL setup

---

## First Time Setup

### 1. Read Documents (15 minutes)
```bash
# Read in this order:
1. README.md           # Overview
2. PRODUCT_VISION.md   # What we're building
3. AGILE_ROADMAP.md    # Phase 1-2 only
4. TECH_STACK.md       # Quick scan
```

### 2. Install Prerequisites
```bash
# Required:
- Node.js 20+
- Docker Desktop
- pnpm (npm install -g pnpm)

# Get API keys:
- OpenAI API key (platform.openai.com)
- Clerk account (clerk.com)
```

### 3. Start Development

**Option A: Use Claude Code (Recommended)**
```
Read these files:
- PRODUCT_VISION.md
- AGILE_ROADMAP.md (Phase 1)
- CLAUDE.md
- TECH_STACK.md
- project-status.json

I'm starting Phase 1: Proof of Concept.

Setup Next.js project with voice interview.
Guide me through Realtime API architecture.
Let me implement voice logic myself.
Auto-code UI and boilerplate.
```

**Option B: Manual Setup**
```bash
# 1. Create Next.js app
npx create-next-app@latest ai-interview-platform
cd ai-interview-platform

# 2. Install dependencies
pnpm install openai @clerk/nextjs drizzle-orm postgres zod

# 3. Start database
docker-compose up -d

# 4. Create .env.local
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ai_interview
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# 5. Start dev server
pnpm dev
```

---

## Phase 1 Checklist

### Goal
Build hardcoded voice interview that proves concept works.

### Tasks
- [ ] Setup Next.js project
- [ ] Add microphone button
- [ ] Connect to OpenAI Realtime API (WebSocket)
- [ ] Handle audio streaming (input + output)
- [ ] Show live transcript
- [ ] Test voice conversation

### Success Criteria
✅ User can speak to AI  
✅ AI responds with voice  
✅ Conversation flows  
✅ Transcript appears live  

### What to Learn
- OpenAI Realtime API
- WebSocket connections
- Audio streaming
- Browser audio APIs

### Resources (Only If Stuck)
- [OpenAI Realtime API Docs](https://platform.openai.com/docs/guides/realtime)
- [Realtime API Examples](https://github.com/openai/openai-realtime-api-beta)

---

## Update Progress

When you start Phase 1:
```json
// project-status.json
{
  "currentPhase": 1,
  "status": "in_progress",
  "startedAt": "2024-05-XX",
  ...
}
```

When you complete Phase 1:
```json
{
  "currentPhase": 2,
  "status": "not_started",
  "completedPhases": [1],
  "learnings": [
    "Phase 1: Realtime API uses WebSocket for voice streaming",
    "Phase 1: Audio handling in browser requires MediaRecorder API"
  ]
}
```

---

## Common Issues

### Docker Postgres won't start
```bash
# Stop any local Postgres
brew services stop postgresql  # macOS
sudo systemctl stop postgresql # Linux

# Or change port in docker-compose.yml
ports:
  - "5433:5432"
```

### OpenAI Realtime API access
- Requires API key with Realtime API access
- Check platform.openai.com/account/limits
- May need to enable beta features

### Audio not working
- Check browser permissions (microphone)
- HTTPS required in production
- Test on localhost first

---

## What's Next

**After Phase 1 works:**
1. Read AGILE_ROADMAP.md Phase 2
2. Add auth (Clerk)
3. Save to database
4. Deploy to Vercel
5. Get first real users

**Remember:**
- Ship every 2 weeks
- Get user feedback
- Let feedback drive roadmap
- Learning through building

---

## Getting Help

**From Claude Code:**
- "Check my status" → reads project-status.json
- "What's next?" → suggests based on current phase
- "I'm stuck on X" → provides targeted help

**From Files:**
- Stuck on product direction? → PRODUCT_VISION.md
- Don't know what to build? → AGILE_ROADMAP.md
- Tech decision needed? → TECH_STACK.md
- AI assistant not helping right? → CLAUDE.md

---

## Remember

**This is a learning project.**

The goal is not just to ship fast.

The goal is to **learn AI engineering deeply** while shipping a real product.

Take time to understand what you're building.

Experiment. Break things. Fix them.

That's how you learn.
