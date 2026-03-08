import { Router, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../db'

const router = Router({ mergeParams: true })

// POST /api/ideas/:id/follow — toggle follow
router.post('/', async (req: Request, res: Response) => {
  const { id } = req.params
  const { user_id } = req.body
  if (!user_id) {
    res.status(400).json({ error: 'user_id required' })
    return
  }

  const existing = await db.execute({
    sql: 'SELECT id FROM follows WHERE idea_id = ? AND user_id = ?',
    args: [id, user_id],
  })

  if (existing.rows.length > 0) {
    // Unfollow
    await db.execute({ sql: 'DELETE FROM follows WHERE idea_id = ? AND user_id = ?', args: [id, user_id] })
    await db.execute({ sql: 'UPDATE ideas SET follow_count = MAX(0, follow_count - 1) WHERE id = ?', args: [id] })
    res.json({ following: false })
  } else {
    // Follow
    await db.execute({ sql: 'INSERT INTO follows (id, idea_id, user_id) VALUES (?, ?, ?)', args: [uuidv4(), id, user_id] })
    await db.execute({ sql: 'UPDATE ideas SET follow_count = follow_count + 1 WHERE id = ?', args: [id] })
    res.json({ following: true })
  }
})

export default router
