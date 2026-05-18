# Agile Development Roadmap

## Philosophy

**Build vertical slices. Ship to production early. Iterate.**

Each phase:
- ✅ Delivers working product
- ✅ Teaches AI concept
- ✅ Adds real value
- ✅ Can be shipped

No big-bang release. Continuous delivery.

---

# Phase 1: Proof of Concept (Week 1-2)

## Ship
**Hardcoded single interview**
- Voice interview: "Design WhatsApp"
- No auth (just start button)
- AI asks questions via voice
- User responds via voice
- Shows live transcript
- Session ends

## Learn
- Realtime API
- WebSocket voice
- Audio streaming
- Basic prompting

## Production-Ready?
**No.** This is localhost demo.

## Goal
**Prove voice AI works.**

---

# Phase 2: MVP - First Real Users (Week 3-4)

## Ship
**Minimal viable product**
- Add auth (Clerk)
- Save interview to database
- Show transcript after interview
- Basic evaluation (JSON scores)
- User can review past interviews
- Deploy to Vercel

## Learn
- Auth integration
- Database design
- Structured evaluation
- Deployment

## Production-Ready?
**Yes.** Can share with 10 friends.

## Goal
**Get first real feedback.**

---

# Phase 3: Better Evaluation (Week 5-6)

## Ship
**Detailed feedback system**
- Structured scoring (scalability, design, communication)
- Written feedback (2-3 paragraphs)
- Specific examples from user's answers
- Save evaluation to database
- Show evaluation on results page

## Learn
- Advanced prompt engineering
- Evaluation rubrics
- JSON mode reliability
- Few-shot learning

## Production-Ready?
**Yes.** Feedback is good enough to be useful.

## Goal
**Make evaluation valuable.**

---

# Phase 4: Multi-Topic (Week 7-8)

## Ship
**3 interview topics**
- Design WhatsApp
- Design URL Shortener  
- Design Uber
- User picks topic before starting
- Different questions per topic
- Topic-specific evaluation

## Learn
- Template system (hardcoded)
- Prompt organization
- Managing multiple interview types

## Production-Ready?
**Yes.** More variety = more value.

## Goal
**Prove template system works.**

---

# Phase 5: Recording Playback (Week 9-10)

## Ship
**Full interview recordings**
- Save audio recording
- Sync with transcript
- Play back interview later
- Highlight key moments
- Download recording

## Learn
- Audio storage (S3/Supabase Storage)
- Audio/transcript sync
- Media handling in Next.js

## Production-Ready?
**Yes.** Critical feature for review.

## Goal
**Users can review their performance.**

---

# Phase 6: User Dashboard (Week 11-12)

## Ship
**Progress tracking**
- List of past interviews
- Score trends over time
- Strengths/weaknesses summary
- Simple analytics
- Interview history

## Learn
- Data aggregation
- Analytics queries
- Chart libraries (Recharts)
- Dashboard design

## Production-Ready?
**Yes.** Users see progress.

## Goal
**Keep users engaged.**

---

# Phase 7: Interview Templates (DB) (Week 13-14)

## Ship
**Dynamic interview system**
- Move templates from code to database
- Admin can create new interviews (manual SQL for now)
- Interview = title + description + prompt + rubric
- User sees all available interviews
- Still hardcoded topics, but DB-driven

## Learn
- Template architecture
- Separating data from code
- Database-driven content

## Production-Ready?
**Yes.** Foundation for admin panel.

## Goal
**Make adding interviews easy.**

---

# Phase 8: Voice Optimization & Cost Comparison (Week 15-16)

## Ship
**Two voice approaches compared**
- Keep Realtime API as default
- Build traditional pipeline (Whisper + GPT + TTS)
- A/B test both approaches
- Cost dashboard (track per interview)
- Quality comparison metrics
- Let user choose voice quality (high/standard)

## Learn
**Deep comparison of voice architectures:**
- Realtime API (WebSocket, integrated)
- Traditional pipeline (Whisper STT + GPT + TTS)
- Cost vs quality tradeoffs
- Latency comparison
- When to use which approach
- Production voice optimization

## Production-Ready?
**Yes.** Can optimize costs based on data.

## Goal
**Understand both voice AI approaches deeply.**

---

# Phase 9: Admin Panel v1 (Week 17-18)

## Ship
**Backoffice UI**
- Login as admin (hardcoded admin emails)
- Create interview template via form
- Edit existing templates
- Set AI instructions
- Define evaluation rubric
- Publish/unpublish interviews

## Learn
- Admin UI patterns
- Form handling (complex)
- RBAC (basic)

## Production-Ready?
**Yes.** Can manage content without SQL.

## Goal
**Non-technical admin can add interviews.**

---

# Phase 10: Fine-Tuning Experiment (Week 19-20)

## Ship
**Custom AI interviewer**
- Collect 100+ interview transcripts
- Fine-tune GPT on interview data
- A/B test base vs fine-tuned
- Show which model was used
- Compare quality/cost

## Learn
- Fine-tuning pipeline
- Training data preparation
- Model comparison
- A/B testing

## Production-Ready?
**Maybe.** Depends on results.

## Goal
**Reduce costs or improve quality.**

---

# Phase 11: Learning Paths v1 (Week 21-22)

## Ship
**Structured progression**
- Create "Frontend Interview Path"
  - Junior level
  - Mid level
  - Senior level
- User follows path step-by-step
- Track completion
- Lock advanced until basics done

## Learn
- Content sequencing
- Progress gates
- Path navigation

## Production-Ready?
**Yes.** Guided experience.

## Goal
**Users know what to practice next.**

---

# Phase 12: Analytics & Insights (Week 23-24)

## Ship
**Personalized feedback**
- Analyze user's past interviews
- Identify patterns (strengths/weaknesses)
- Recommend next interview based on data
- Show improvement over time
- Compare to others (anonymized)

## Learn
- Data analysis
- Recommendation algorithms
- Aggregation queries
- Insight generation

## Production-Ready?
**Yes.** Adds personalization.

## Goal
**Make practice more effective.**

---

# Phase 13: Advanced Evaluation (Week 25-26)

## Ship
**Better scoring system**
- LLM-as-judge evaluation
- Compare multiple evaluation models
- Consistency testing
- Golden dataset for validation
- Automated quality checks

## Learn
- Evaluation systems (deep)
- LLM-as-judge patterns
- Quality measurement
- Regression testing

## Production-Ready?
**Yes.** More reliable scores.

## Goal
**Trust evaluation quality.**

---

# Phase 14: Mobile Optimization (Week 27-28)

## Ship
**Mobile-first experience**
- Optimize voice for mobile
- Better mobile UI
- Handle phone interruptions
- Background audio handling
- Mobile recording quality

## Learn
- Mobile audio quirks
- PWA patterns
- Mobile UX

## Production-Ready?
**Yes.** Works great on phone.

## Goal
**Practice on the go.**

---

# Phase 15: Monetization (Week 29-30)

## Ship
**Paid tiers**
- Free: 3 interviews/month
- Pro: Unlimited ($20/mo)
- Stripe integration
- Usage tracking
- Subscription management

## Learn
- Payment integration
- Usage limits
- Subscription logic

## Production-Ready?
**Yes.** Revenue!

## Goal
**Validate willingness to pay.**

---

# Beyond Phase 15

## More Features (Later)
- Voice cloning (custom interviewer voices)
- Multi-language support
- Team/enterprise features
- Interview sharing
- Community features
- AI-generated questions
- Adaptive difficulty
- Real-time feedback during interview
- Video recording (optional)
- Integration with job boards

## More AI Learning
- RAG for question generation
- Embedding-based similarity
- Multi-agent evaluation
- Local models (Ollama)
- Custom voice models
- Emotion detection
- Advanced fine-tuning

---

# Key Principles

## Vertical Slices
Each phase ships **complete feature.**

Not: "Build all backend first, then all frontend"
Yes: "Build interview taking end-to-end, then add evaluation"

## Ship Early
Phase 2 goes to production.
Get real users ASAP.

## Iterate Based on Feedback
Users tell you what matters.
Don't build features nobody wants.

## Learning Integrated
Each phase teaches AI concept.
Product development = AI education.

## De-Risk Early
Hardest technical risks first:
- Phase 1: Voice AI works?
- Phase 2: People use it?
- Phase 3: Evaluation useful?

## No Big Bang
Never go 6 months without shipping.
Every 2 weeks: ship something.

---

# Success Metrics per Phase

**Phase 2:** 10 people try it
**Phase 4:** 5 people use multiple times
**Phase 6:** 1 person uses weekly
**Phase 9:** Can add interview without code
**Phase 11:** 1 person completes a path
**Phase 15:** 1 person pays

Each phase has measurable outcome.

---

# This is Agile

- Small iterations
- Ship often
- User feedback drives roadmap
- Technical learning integrated
- Always production-ready
- Continuous value delivery

**Not waterfall. Not big-bang. Incremental.**
