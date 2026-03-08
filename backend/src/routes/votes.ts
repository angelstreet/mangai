import { Router, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../db'

const router = Router()

// POST /api/ideas/:id/vote — upsert vote and recalculate idea stats
router.post('/:id/vote', async (req: Request, res: Response) => {
  try {
    const { id: idea_id } = req.params
    const { user_id, score, comment, action } = req.body

    if (!user_id || score === undefined) {
      res.status(400).json({ error: 'Missing required fields: user_id, score' })
      return
    }

    if (score < 1 || score > 5) {
      res.status(400).json({ error: 'Score must be between 1 and 5' })
      return
    }

    // Check idea exists
    const ideaResult = await db.execute({
      sql: 'SELECT id FROM ideas WHERE id = ?',
      args: [idea_id],
    })

    if (ideaResult.rows.length === 0) {
      res.status(404).json({ error: 'Idea not found' })
      return
    }

    const vote_id = uuidv4()

    // Upsert vote (INSERT OR REPLACE)
    await db.execute({
      sql: `INSERT OR REPLACE INTO votes (id, idea_id, user_id, score, comment, action)
            VALUES (
              COALESCE((SELECT id FROM votes WHERE idea_id = ? AND user_id = ?), ?),
              ?, ?, ?, ?, ?
            )`,
      args: [idea_id, user_id, vote_id, idea_id, user_id, score, comment ?? '', action ?? null],
    })

    // Recalculate avg_score and vote_count
    const statsResult = await db.execute({
      sql: 'SELECT AVG(score) as avg_score, COUNT(*) as vote_count FROM votes WHERE idea_id = ?',
      args: [idea_id],
    })

    const avg_score = statsResult.rows[0].avg_score ?? 0
    const vote_count = statsResult.rows[0].vote_count ?? 0

    // Count stars (votes where action = 'star')
    const starResult = await db.execute({
      sql: "SELECT COUNT(*) as star_count FROM votes WHERE idea_id = ? AND action = 'star'",
      args: [idea_id],
    })

    const star_count = starResult.rows[0].star_count ?? 0

    await db.execute({
      sql: 'UPDATE ideas SET avg_score = ?, vote_count = ?, star_count = ? WHERE id = ?',
      args: [avg_score, vote_count, star_count, idea_id],
    })

    const updatedIdea = await db.execute({
      sql: 'SELECT * FROM ideas WHERE id = ?',
      args: [idea_id],
    })

    res.json(updatedIdea.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit vote' })
  }
})

export default router
