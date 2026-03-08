# MangAI — Product Roadmap

## Vision
A mobile-first platform where anyone can structure, share, and improve manga ideas — not the full manga, just the idea. Community votes and AI feedback help the best ideas rise.

---

## Idea Structure (strict format — enforced on submit)

Every idea must fill exactly these fields:

| Field | Constraint |
|-------|-----------|
| **Hook** | 3 lines max — the core premise |
| **Protagonists** | 3 to 5 entries — name + 1-line pitch each |
| **Sell pitch** | 2–3 sentences — why someone should read this |
| **Theme** | 1 line — the central question or tension |
| **Plot twist** | Optional, 1–2 lines |
| **Storyline engine** | 1 line — the main narrative driver |

No free-form fields. Structure is enforced. This is the whole point.

---

## Community Features

- **Score 1–5** (star rating per idea)
- **Written comment** (short, public)
- **Star** (bookmark for later)
- **Reject** (negative signal, reduces visibility)
- **AI Suggestion** — on request: Claude suggests improvements to any field

---

## 1-Day Build Plan (Mobile-First)

### Stack (keep existing)
- Frontend: React + Vite + TypeScript (port 3022)
- Backend: Express + TypeScript (port 5022)
- DB: Turso (SQLite)
- Auth: Clerk
- AI: Claude API (claude-haiku-4-5 for speed + cost)
- Deploy: Vercel

### Hour-by-hour plan

**Hour 1 — DB schema + backend skeleton**
- Table: `ideas` (id, user_id, hook, protagonists JSON, pitch, theme, twist, storyline, status, created_at)
- Table: `votes` (id, idea_id, user_id, score 1-5, comment, action: star|reject)
- REST endpoints: POST /ideas, GET /ideas, GET /ideas/:id, POST /ideas/:id/vote

**Hour 2 — Submit form (mobile-first)**
- Step-by-step form (one field per screen on mobile)
- Validation: hook ≤ 3 lines, 3–5 protagonists, all required fields filled
- Preview before submit

**Hour 3 — Ideas feed**
- Card list sorted by avg score desc
- Each card: hook + theme + score badge + star/reject buttons
- Tap → detail view

**Hour 4 — Detail view + voting**
- Full idea display (all fields)
- Score slider 1–5 + comment input
- Star / Reject buttons
- Score breakdown display

**Hour 5 — AI suggestion integration**
- "Improve with AI" button on detail view
- Sends idea fields to Claude
- Returns structured suggestions per field (hook, pitch, theme, twist)
- Displayed inline, user can copy suggestions

**Hour 6 — Auth + polish**
- Clerk auth (sign in with Google/email)
- Only logged-in users can vote / submit
- Mobile polish: bottom nav, safe areas, tap targets
- Seed with Beast King idea as first entry

**Hour 7 — Deploy**
- Deploy frontend to Vercel
- Deploy backend (Railway or same server, port 5022)
- Connect Turso prod DB
- Smoke test on mobile

---

## Screens (7 total)

1. **Feed** — list of ideas, sorted by score
2. **Submit** — step-by-step structured form
3. **Detail** — full idea + vote + AI suggest
4. **My Ideas** — ideas submitted by current user
5. **Starred** — ideas the user bookmarked
6. **Profile** — basic user info + stats
7. **Auth** — Clerk sign in/up (modal)

---

## MVP Acceptance Criteria

- [ ] User can submit an idea using the strict 6-field structure
- [ ] User can browse ideas feed sorted by score
- [ ] User can score 1–5 + leave a comment
- [ ] User can star or reject an idea
- [ ] User can request AI improvement suggestions on any idea
- [ ] Beast King idea is seeded as first entry
- [ ] Works on mobile (375px width)

---

## Phase 2 (post-MVP, future)

- Weekly featured idea (most upvoted)
- Follow creators
- Idea versioning (track improvements over time)
- Chapters: ideas that reach score threshold unlock "pilot chapter" phase
- Collaborative editing (co-authors)
- Trending tags / genres
