# MangAI — 1-Day Subagent Build Plan

## Orchestration strategy

4 phases. Phases 1 is sequential (defines the contract). Phases 2–3 run agents in parallel. Phase 4 integrates.

```
Phase 1 [you]          Define API contract + DB schema (10 min)
         │
         ├── Phase 2 [parallel]
         │      Agent A: Backend (DB + all routes + seed)
         │      Agent B: Frontend scaffold (layout + routing + mobile CSS)
         │
         ├── Phase 3 [parallel, starts after Phase 2]
         │      Agent C: Submit form (6-field strict form)
         │      Agent D: Feed + Detail + Vote UI
         │      Agent E: AI suggestions (backend route + frontend)
         │
         └── Phase 4 [sequential]
                Agent F: Auth (Clerk) + final wiring + smoke test
```

---

## API Contract (shared truth for all agents)

### Base URL
- Dev: `http://localhost:5022`
- All responses: `{ data, error }`

### Endpoints

```
GET    /api/health
GET    /api/ideas              → list ideas (sorted by avg_score desc)
GET    /api/ideas/:id          → single idea with votes
POST   /api/ideas              → create idea (auth required)
POST   /api/ideas/:id/vote     → score + comment + action (auth required)
POST   /api/ideas/:id/ai       → get AI suggestions for idea fields
```

### Idea shape
```ts
type Idea = {
  id: string
  user_id: string
  hook: string           // max 3 lines
  protagonists: { name: string; pitch: string }[]  // 3-5 entries
  sell_pitch: string     // 2-3 sentences
  theme: string          // 1 line
  twist: string | null   // optional
  storyline: string      // 1 line
  avg_score: number      // 0-5
  vote_count: number
  star_count: number
  status: 'active' | 'rejected'
  created_at: string
}
```

### Vote shape
```ts
type Vote = {
  id: string
  idea_id: string
  user_id: string
  score: number          // 1-5
  comment: string
  action: 'star' | 'reject' | null
  created_at: string
}
```

### AI suggestion response
```ts
type AISuggestion = {
  hook?: string
  sell_pitch?: string
  theme?: string
  twist?: string
  storyline?: string
  general?: string    // overall feedback
}
```

---

## DB Schema (Turso / SQLite)

```sql
CREATE TABLE ideas (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  hook TEXT NOT NULL,
  protagonists TEXT NOT NULL,   -- JSON array
  sell_pitch TEXT NOT NULL,
  theme TEXT NOT NULL,
  twist TEXT,
  storyline TEXT NOT NULL,
  avg_score REAL DEFAULT 0,
  vote_count INTEGER DEFAULT 0,
  star_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE votes (
  id TEXT PRIMARY KEY,
  idea_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  score INTEGER NOT NULL CHECK(score BETWEEN 1 AND 5),
  comment TEXT DEFAULT '',
  action TEXT,                  -- 'star' | 'reject' | NULL
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(idea_id, user_id)
);
```

---

## Agent A — Backend

**Owns:** `backend/`
**Produces:** all routes working, DB connected, Beast King seeded

### Instructions
1. Install deps: `@libsql/client`, `uuid`, `dotenv`
2. Create `backend/src/db.ts` — Turso client setup using `TURSO_URL` + `TURSO_TOKEN` env vars
3. Create `backend/src/schema.ts` — run the two CREATE TABLE IF NOT EXISTS statements above
4. Create route files:
   - `backend/src/routes/ideas.ts` — GET /api/ideas, GET /api/ideas/:id, POST /api/ideas
   - `backend/src/routes/votes.ts` — POST /api/ideas/:id/vote
   - `backend/src/routes/ai.ts` — POST /api/ideas/:id/ai (stub returning mock data for now, Claude wired in Agent E)
5. Create `backend/src/seed.ts` — seeds Beast King idea (pull content from `docs/bestking.md`)
6. Wire all routes in `backend/src/index.ts` on port 5022
7. Add `backend/.env.example`: `TURSO_URL=`, `TURSO_TOKEN=`, `PORT=5022`

### Beast King seed data
```ts
const beastKing = {
  id: 'seed-beast-king',
  user_id: 'system',
  hook: `Humans exist in a dinosaur-dominated world where apex predators define the food chain.\nElite protectors called Beast Kings are humanity's only shield against extinction.\nOne boy with a hidden triple-soul will change what it means to protect — or to dominate.`,
  protagonists: [
    { name: 'MC (Beast King Candidate)', pitch: 'Village boy, secretly 3-soul, wants to protect not dominate.' },
    { name: 'The Shaman', pitch: 'Keeper of pact knowledge — her survival determines humanity\'s future.' },
    { name: 'The Rival', pitch: '2-soul warrior from competing village, enemy turned reluctant ally.' },
    { name: 'The Devourer', pitch: 'Mirror villain who chose carnivore pact + weaving — what MC could become.' },
    { name: 'The Seam King', pitch: 'Weaver leader aiming for a 7-soul vessel to end humanity\'s prey status.' }
  ],
  sell_pitch: `In a world where power comes from ancient pacts with nature and beasts, the line between protector and predator is everything. Beast King is a shonen manga about earning strength through discipline and cooperation in a world that rewards domination. Dinosaurs are not the enemy — the humans who steal their power are.`,
  theme: 'Becoming a predator to protect prey — and the identity cost that comes with it.',
  twist: 'The world may have been reset or engineered. The MC\'s rare 3-soul might be a deliberate design, not an accident.',
  storyline: 'Wall Expansion + Rite Hunt: expand safe human zones while recovering lost pact rites and protecting shamans.'
}
```

---

## Agent B — Frontend Scaffold

**Owns:** `frontend/src/App.tsx`, `frontend/src/index.css`, `frontend/src/components/layout/`
**Produces:** shell app with routing, mobile nav, global styles

### Instructions
1. Install deps: `react-router-dom`, `lucide-react`
2. Mobile-first CSS in `index.css`:
   - max-width 480px centered
   - CSS variables for colors: `--bg`, `--surface`, `--accent`, `--text`, `--muted`
   - Dark manga theme: near-black bg, white text, red/orange accent
   - Bottom nav bar (fixed, 60px)
3. `components/layout/BottomNav.tsx` — 5 tabs: Feed / Submit / Starred / My Ideas / Profile
4. `components/layout/Header.tsx` — app name + back button logic
5. `App.tsx` — routes: `/` (Feed), `/submit`, `/ideas/:id`, `/my-ideas`, `/starred`
6. Placeholder page components for each route (just "coming soon" text, correct titles)
7. `frontend/.env.example`: `VITE_API_URL=http://localhost:5022`

---

## Agent C — Submit Form

**Owns:** `frontend/src/pages/Submit.tsx`, `frontend/src/components/form/`
**Depends on:** Agent B scaffold (routing exists), API contract above

### Instructions
Build a step-by-step submit form (one step per screen on mobile):

**Step 1 — Hook**
- Textarea, max 3 lines enforced (count newlines, block submit if >3)
- Character counter

**Step 2 — Protagonists**
- Add up to 5 protagonists (min 3 required)
- Each: name input + 1-line pitch input
- Add/remove protagonist rows

**Step 3 — Sell Pitch**
- Textarea, 2–3 sentences guidance shown

**Step 4 — Theme**
- Single line input

**Step 5 — Plot Twist**
- Textarea + "No twist" toggle (makes it optional)

**Step 6 — Storyline Engine**
- Single line input

**Step 7 — Preview**
- Read-only summary of all fields
- "Submit" button → POST /api/ideas
- On success: navigate to `/ideas/:id`

Progress bar at top (1/7 … 7/7). Back/Next buttons. No skipping required fields.

---

## Agent D — Feed + Detail + Vote

**Owns:** `frontend/src/pages/Home.tsx`, `frontend/src/pages/Ideas.tsx` (rename to IdeaDetail), `frontend/src/components/idea/`
**Depends on:** Agent B scaffold, API contract above

### Instructions

**Feed (Home.tsx)**
- Fetch GET /api/ideas on mount
- `IdeaCard` component:
  - Hook (first line only, truncated)
  - Theme badge
  - Avg score (stars display)
  - Vote count
  - Star / Reject quick action buttons
  - Tap → navigate to `/ideas/:id`
- Pull-to-refresh (or reload button)
- Empty state

**Detail page (IdeaDetail.tsx)**
- Fetch GET /api/ideas/:id
- Display all fields in sections:
  - Hook (full, 3 lines)
  - Protagonists (list)
  - Sell Pitch
  - Theme
  - Twist (hidden if null)
  - Storyline
- **Vote section:**
  - Star rating 1–5 (tap stars)
  - Comment textarea
  - Star / Reject toggle buttons
  - Submit vote → POST /api/ideas/:id/vote
  - Show existing vote if user already voted
- **AI Suggestions button** (just renders the button + placeholder, Agent E wires it)

**Components to build:**
- `IdeaCard.tsx`
- `StarRating.tsx` (1–5 interactive)
- `VoteForm.tsx`
- `ProtagonistList.tsx`

---

## Agent E — AI Suggestions

**Owns:** `backend/src/routes/ai.ts`, `frontend/src/components/idea/AISuggestions.tsx`
**Depends on:** Agent A (backend running), Agent D (button exists in UI)

### Instructions

**Backend route (`/api/ideas/:id/ai`)**
1. Install `@anthropic-ai/sdk`
2. Fetch the idea from DB
3. Build prompt:
```
You are a manga story consultant. Analyze this manga idea and suggest improvements for each field.
Be specific, creative, and constructive. Keep suggestions brief (1-3 sentences per field).

IDEA:
Hook: {hook}
Protagonists: {protagonists}
Pitch: {sell_pitch}
Theme: {theme}
Twist: {twist}
Storyline: {storyline}

Return JSON only matching this shape:
{ "hook": "...", "sell_pitch": "...", "theme": "...", "twist": "...", "storyline": "...", "general": "..." }
```
4. Use `claude-haiku-4-5-20251001` (fast + cheap)
5. Parse JSON from response, return it

**Frontend (`AISuggestions.tsx`)**
- "✨ Improve with AI" button
- On click: POST /api/ideas/:id/ai, show loading spinner
- Display response as collapsible sections per field
- Each suggestion has a "Copy" button
- Wire into IdeaDetail.tsx after vote section

Add `ANTHROPIC_API_KEY=` to `backend/.env.example`

---

## Agent F — Auth + Final Wiring

**Owns:** `frontend/src/main.tsx`, auth guards, `backend/src/middleware/auth.ts`
**Depends on:** all agents done
**Runs last**

### Instructions
1. Install `@clerk/clerk-react` (frontend), `@clerk/clerk-sdk-node` (backend)
2. Wrap app in `<ClerkProvider>` in `main.tsx`
3. Auth middleware on backend: verify Clerk JWT, attach `user_id` to request
4. Protect routes: submit, vote, AI suggest require auth
5. Show `<SignInButton>` in Header when logged out
6. Add `VITE_CLERK_PUBLISHABLE_KEY=` to frontend `.env.example`
7. Add `CLERK_SECRET_KEY=` to backend `.env.example`
8. Run seed script to insert Beast King idea
9. Smoke test: submit → feed → detail → vote → AI suggest

---

## Launch order

```
You now   → read this doc, define any missing env vars in .env files
─────────────────────────────────────────────────────
Parallel  → Agent A (backend) + Agent B (frontend scaffold)
─────────────────────────────────────────────────────
Parallel  → Agent C (submit form) + Agent D (feed+detail) + Agent E (AI)
─────────────────────────────────────────────────────
Sequential→ Agent F (auth + wiring + smoke test)
─────────────────────────────────────────────────────
Done      → deploy to Vercel
```

## File ownership map (no conflicts)

```
backend/src/db.ts              → Agent A
backend/src/schema.ts          → Agent A
backend/src/seed.ts            → Agent A
backend/src/routes/ideas.ts    → Agent A
backend/src/routes/votes.ts    → Agent A
backend/src/routes/ai.ts       → Agent E (stub by A, wired by E)
backend/src/middleware/auth.ts → Agent F
backend/src/index.ts           → Agent A (Agent F adds auth middleware)

frontend/src/index.css         → Agent B
frontend/src/App.tsx           → Agent B (Agent F adds ClerkProvider)
frontend/src/main.tsx          → Agent F
frontend/src/components/layout/→ Agent B
frontend/src/components/form/  → Agent C
frontend/src/components/idea/  → Agent D (AISuggestions.tsx added by E)
frontend/src/pages/Submit.tsx  → Agent C
frontend/src/pages/Home.tsx    → Agent D
frontend/src/pages/IdeaDetail  → Agent D
```
