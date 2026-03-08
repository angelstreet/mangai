import { Router, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../db'

const router = Router()

function parseIdea(row: Record<string, unknown>) {
  return {
    ...row,
    protagonists: typeof row.protagonists === 'string'
      ? JSON.parse(row.protagonists)
      : row.protagonists,
  }
}

// GET /api/ideas — fetch all ideas, sortable via ?sort=top|new|followed|voted
router.get('/', async (req: Request, res: Response) => {
  try {
    const sort = (req.query.sort as string) || 'top'
    const orderBy: Record<string, string> = {
      top: 'avg_score DESC',
      new: 'created_at DESC',
      followed: 'follow_count DESC',
      voted: 'vote_count DESC',
    }
    const order = orderBy[sort] ?? 'avg_score DESC'
    const result = await db.execute(`SELECT * FROM ideas ORDER BY ${order}`)
    res.json(result.rows.map(parseIdea))
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ideas' })
  }
})

// GET /api/ideas/:id — fetch single idea + its votes
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const ideaResult = await db.execute({
      sql: 'SELECT * FROM ideas WHERE id = ?',
      args: [id],
    })

    if (ideaResult.rows.length === 0) {
      res.status(404).json({ error: 'Idea not found' })
      return
    }

    const votesResult = await db.execute({
      sql: 'SELECT * FROM votes WHERE idea_id = ? ORDER BY created_at DESC',
      args: [id],
    })

    res.json({ ...parseIdea(ideaResult.rows[0] as Record<string, unknown>), votes: votesResult.rows })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch idea' })
  }
})

// POST /api/ideas — create a new idea
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, hook, protagonists, sell_pitch, theme, twist, storyline, user_id } = req.body

    if (!title || !hook || !protagonists || !sell_pitch || !theme || !storyline || !user_id) {
      res.status(400).json({ error: 'Missing required fields' })
      return
    }

    const id = uuidv4()
    const protagonistsStr = typeof protagonists === 'string' ? protagonists : JSON.stringify(protagonists)

    await db.execute({
      sql: `INSERT INTO ideas (id, user_id, title, hook, protagonists, sell_pitch, theme, twist, storyline)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [id, user_id, title, hook, protagonistsStr, sell_pitch, theme, twist ?? null, storyline],
    })

    const result = await db.execute({
      sql: 'SELECT * FROM ideas WHERE id = ?',
      args: [id],
    })

    res.status(201).json(parseIdea(result.rows[0] as Record<string, unknown>))
  } catch (err) {
    res.status(500).json({ error: 'Failed to create idea' })
  }
})

// PUT /api/ideas/:id — edit idea + create version snapshot
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { title, hook, protagonists, sell_pitch, theme, twist, storyline, user_id } = req.body

    const current = await db.execute({ sql: 'SELECT * FROM ideas WHERE id = ?', args: [id] })
    if (!current.rows[0]) {
      res.status(404).json({ error: 'Not found' })
      return
    }

    const idea = current.rows[0] as Record<string, unknown>
    if (idea.user_id !== user_id) {
      res.status(403).json({ error: 'Forbidden' })
      return
    }

    const currentVersion = Number(idea.version) || 1
    const protagonistsStr = typeof protagonists === 'string' ? protagonists : JSON.stringify(protagonists)

    // Snapshot current version if no versions exist yet
    const existingVersions = await db.execute({ sql: 'SELECT id FROM idea_versions WHERE idea_id = ?', args: [id] })
    if (existingVersions.rows.length === 0) {
      await db.execute({
        sql: `INSERT INTO idea_versions (id, idea_id, version, hook, protagonists, sell_pitch, theme, twist, storyline) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [crypto.randomUUID(), id, currentVersion, idea.hook as string, idea.protagonists as string, idea.sell_pitch as string, idea.theme as string, idea.twist as string | null, idea.storyline as string],
      })
    }

    // Snapshot the new version
    await db.execute({
      sql: `INSERT INTO idea_versions (id, idea_id, version, hook, protagonists, sell_pitch, theme, twist, storyline) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [crypto.randomUUID(), id, currentVersion + 1, hook, protagonistsStr, sell_pitch, theme, twist ?? null, storyline],
    })

    // Update idea
    await db.execute({
      sql: `UPDATE ideas SET title=?, hook=?, protagonists=?, sell_pitch=?, theme=?, twist=?, storyline=?, version=? WHERE id=?`,
      args: [title ?? idea.title, hook, protagonistsStr, sell_pitch, theme, twist ?? null, storyline, currentVersion + 1, id],
    })

    const updated = await db.execute({ sql: 'SELECT * FROM ideas WHERE id = ?', args: [id] })
    res.json(parseIdea(updated.rows[0] as Record<string, unknown>))
  } catch (err) {
    res.status(500).json({ error: 'Failed to update idea' })
  }
})

export default router
