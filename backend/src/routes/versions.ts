import { Router, Request, Response } from 'express'
import { db } from '../db'

const router = Router({ mergeParams: true })

// GET /api/ideas/:id/versions — list all versions (newest first)
router.get('/', async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await db.execute({
    sql: 'SELECT id, idea_id, version, created_at FROM idea_versions WHERE idea_id = ? ORDER BY version DESC',
    args: [id],
  })
  res.json(result.rows)
})

// GET /api/ideas/:id/versions/:version — get specific version snapshot
router.get('/:version', async (req: Request, res: Response) => {
  const { id, version } = req.params
  const result = await db.execute({
    sql: 'SELECT * FROM idea_versions WHERE idea_id = ? AND version = ?',
    args: [id, Number(version)],
  })
  if (!result.rows[0]) {
    res.status(404).json({ error: 'Version not found' })
    return
  }
  const row = result.rows[0] as Record<string, unknown>
  res.json({
    ...row,
    protagonists: typeof row.protagonists === 'string' ? JSON.parse(row.protagonists as string) : row.protagonists,
  })
})

export default router
