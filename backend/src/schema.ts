import { db } from './db'

async function addColumnIfMissing(sql: string) {
  try { await db.execute(sql) } catch {}
}

export async function initSchema(): Promise<void> {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS ideas (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      hook TEXT NOT NULL,
      protagonists TEXT NOT NULL,
      sell_pitch TEXT NOT NULL,
      theme TEXT NOT NULL,
      twist TEXT,
      storyline TEXT NOT NULL,
      avg_score REAL DEFAULT 0,
      vote_count INTEGER DEFAULT 0,
      star_count INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      created_at TEXT DEFAULT (datetime('now'))
    )
  `)

  await db.execute(`
    CREATE TABLE IF NOT EXISTS votes (
      id TEXT PRIMARY KEY,
      idea_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      score INTEGER NOT NULL CHECK(score BETWEEN 1 AND 5),
      comment TEXT DEFAULT '',
      action TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(idea_id, user_id)
    )
  `)

  await addColumnIfMissing('ALTER TABLE ideas ADD COLUMN follow_count INTEGER DEFAULT 0')
  await addColumnIfMissing('ALTER TABLE ideas ADD COLUMN version INTEGER DEFAULT 1')
  await addColumnIfMissing("ALTER TABLE ideas ADD COLUMN title TEXT NOT NULL DEFAULT ''")
  await addColumnIfMissing("ALTER TABLE ideas ADD COLUMN tags TEXT NOT NULL DEFAULT '[]'")

  await db.execute(`
    CREATE TABLE IF NOT EXISTS follows (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      idea_id TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(user_id, idea_id)
    )
  `)

  await db.execute(`
    CREATE TABLE IF NOT EXISTS idea_versions (
      id TEXT PRIMARY KEY,
      idea_id TEXT NOT NULL,
      version INTEGER NOT NULL,
      hook TEXT NOT NULL,
      protagonists TEXT NOT NULL,
      sell_pitch TEXT NOT NULL,
      theme TEXT NOT NULL,
      twist TEXT,
      storyline TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `)
}
