# EC2 Migration TODO

When moving from Vercel (serverless) to EC2 (persistent server), the following patterns need to change.

---

## 1. Evaluation — Replace fire-and-forget with a proper background job queue

**Current (Vercel):**
- Client fires `POST /api/evaluate` and navigates away
- Serverless function awaits OpenAI, saves to DB, dies
- Results page polls until evaluation appears
- Risk: function timeout kills in-flight evaluation

**On EC2:**
- Use a persistent job queue (BullMQ + Redis, or Inngest)
- `POST /api/evaluate` enqueues the job and returns `202 Accepted` immediately
- A worker process picks up the job, calls OpenAI with no timeout risk
- Worker saves to DB, optionally pushes a notification (WebSocket or SSE) to the results page
- Polling can be replaced with a real-time push

**Why it matters on EC2:**
No serverless timeout. But the bigger win is observability — queues give you retries, dead-letter queues, and job dashboards out of the box.

---

## 2. Database connections — Switch from per-request connections to a connection pool

**Current (Vercel):**
- Each serverless function creates a new `postgres()` client
- Fine for serverless (each invocation is isolated)
- `src/db/index.ts` creates a new connection every cold start

**On EC2:**
- Use a persistent connection pool (PgBouncer or Drizzle's built-in pool config)
- One pool shared across all requests — not one connection per request
- Update `src/db/index.ts`:
  ```ts
  const client = postgres(process.env.DATABASE_URL, { max: 10 });
  ```
- Without this, EC2 will exhaust Postgres connection limits under load

---

## 3. OpenAI Realtime API WebSocket — Move proxy server-side

**Current (Phase 1-2):**
- Browser opens WebSocket directly to OpenAI using ephemeral token
- Works fine for MVP but the client holds the connection
- Ephemeral token approach (`/api/session` → clientSecret) was designed for this

**On EC2 (Phase 8+):**
- Run a server-side WebSocket proxy
- EC2 holds the persistent connection to OpenAI Realtime API
- Client connects to your server via WebSocket, server relays to OpenAI
- Enables: server-side logging, injection of context mid-conversation, usage tracking, cost control
- Use `ws` library on Node.js server

---

## 4. Long-running API routes — Remove serverless timeout workarounds

**Current (Vercel):**
- Max 60s (hobby) or 300s (Pro) per function
- Fire-and-forget pattern used to work around this
- `MAX_ATTEMPTS` polling cap on results page as safety net

**On EC2:**
- No timeout on HTTP handlers (set your own with `server.timeout`)
- Can safely `await` long OpenAI calls directly in the request handler
- Remove the fire-and-forget pattern for evaluate if preferred
- Keep polling on the results page (still good UX — non-blocking for the user)

---

## 5. Session management — Replace Clerk JWTs with server-side sessions (optional)

**Current:**
- Clerk handles auth entirely (JWT verification on each request)
- Fine at any scale

**On EC2 (optional, cost-driven):**
- If Clerk costs become a concern at scale, replace with `express-session` + Redis
- Keep Clerk for OAuth (Google sign-in) but manage sessions yourself
- Only worth doing after Clerk pricing becomes a real line item

---

## 6. Static assets — Add a CDN layer

**Current (Vercel):**
- Vercel CDN handles static assets automatically

**On EC2:**
- Serve static assets via Nginx → S3 + CloudFront
- Or keep Next.js standalone output and put CloudFront in front of EC2
- Audio worklet file (`/worklets/audio-processor.js`) must be on CDN for low-latency load

---

## When to migrate

Don't migrate early. Vercel is faster to ship and cheaper to operate until you hit:
- Sustained high traffic (Vercel costs exceed EC2 + ops overhead)
- Need for persistent WebSocket proxy (Phase 8 voice optimization)
- Need for background job workers with retry/DLQ (Phase 10 fine-tuning pipeline)

Phase 2–7: stay on Vercel.
Phase 8+: evaluate based on usage and cost data.
