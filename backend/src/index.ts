import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { initSchema } from './schema'
import { seed } from './seed'
import ideasRouter from './routes/ideas'
import votesRouter from './routes/votes'
import aiRouter from './routes/ai'
import versionsRouter from './routes/versions'
import followsRouter from './routes/follows'
import followsFeedRouter from './routes/followsFeed'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 5022

app.use(cors())
app.use(express.json())

app.get('/api/health', (_, res) => res.json({ status: 'ok' }))
app.use('/api/ideas', ideasRouter)
app.use('/api/ideas', votesRouter)
app.use('/api/ideas', aiRouter)
app.use('/api/ideas/:id/versions', versionsRouter)
app.use('/api/ideas/:id/follow', followsRouter)
app.use('/api/follows', followsFeedRouter)

async function start() {
  await initSchema()
  await seed()
  app.listen(PORT, () => console.log(`MangAI API running on port ${PORT}`))
}

start()
