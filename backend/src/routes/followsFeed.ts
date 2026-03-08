import { Router, Request, Response } from 'express'
import { db } from '../db'

const router = Router()

// GET /api/follows?user_id=xxx — ideas followed by user (ordered by version)
router.get('/', async (req: Request, res: Response) => {
  const { user_id } = req.query
  if (!user_id) {
    res.status(400).json({ error: 'user_id required' })
    return
  }
  const result = await db.execute({
    sql: `SELECT i.* FROM ideas i JOIN follows f ON i.id = f.idea_id WHERE f.user_id = ? ORDER BY i.version DESC`,
    args: [user_id as string],
  })
  res.json(
    result.rows.map((row: any) => ({
      ...row,
      protagonists: typeof row.protagonists === 'string' ? JSON.parse(row.protagonists) : row.protagonists,
    }))
  )
})

export default router
