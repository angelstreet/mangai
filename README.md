# MangAI

A mobile-first platform where anyone can structure, share, and improve manga ideas — not the full manga, just the idea. Community votes and AI feedback help the best ideas rise.

## Live

- Subdomain: https://mangai.angelstreet.io
- Path: http://65.108.14.251:8080/mangai/

## Idea Structure

Every idea follows a strict format:

| Field | Constraint |
|---|---|
| **Title** | Short, punchy |
| **Hook** | 3 lines max — the core premise |
| **Protagonists** | 3–5 entries — name + 1-line pitch each |
| **Synopsis** | 2–3 sentences — why someone should read this |
| **Theme** | 1 line — the central question or tension |
| **Plot Twist** | Optional, 1–2 lines |
| **Storyline Engine** | 1 line — the main narrative driver |
| **Genre Tags** | Up to 4 (Shonen, Seinen, Isekai, etc.) |

## Community Features

- Star rating 1–5 per idea
- Short written comment per vote
- Follow ideas — get notified on edits
- Versioning — every edit creates a snapshot; followers can view diff or full version
- AI suggestions (Claude Haiku) — only on your own ideas
- Feed filters: 🔥 Top · ✨ New · 📌 Followed · 🗳️ Voted

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite + TypeScript (port 3022) |
| Backend | Express + TypeScript (port 5022) |
| Database | Turso / libsql (SQLite, local file in dev) |
| Auth | localStorage dev auth (Clerk planned for prod) |
| AI | Claude Haiku (`claude-haiku-4-5-20251001`) |

## Dev Setup

```bash
# Backend
cd backend && npm install
npm run dev        # tsx watch — port 5022

# Frontend
cd frontend && npm install
npm run dev        # Vite dev — port 3022
```

Dev credentials: `test@example.com` / `password` or `user` / `user`

## Nginx (subpath + subdomain)

The app is served at `/mangai/` and `mangai.angelstreet.io`.

Vite base path: `base: '/mangai/'`
React Router: `basename` is set dynamically — `/mangai` when accessed via path, `''` via subdomain.

See `.openclaw/docs/new-app-checklist.md` for the full nginx + Vite setup pattern.

## Project Structure

```
mangai/
├── frontend/        # React + Vite
│   └── src/
│       ├── pages/   # Feed, IdeaDetail, Submit, MyIdeas, Profile, Login
│       ├── components/
│       └── api.ts   # Base URL helper
├── backend/
│   └── src/
│       ├── routes/  # ideas, votes, follows, versions, ai
│       ├── schema.ts
│       └── seed.ts  # Beast King demo idea
└── docs/
    ├── roadmap.md
    └── bestking.md
```
