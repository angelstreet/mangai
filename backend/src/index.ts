import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Routes
app.get('/api/health', (_, res) => res.json({ status: 'ok' }))

// Ideas CRUD
app.get('/api/ideas', (_, res) => {
  // TODO: Fetch from DB
  res.json([])
})

app.post('/api/ideas', (_, res) => {
  // TODO: Create idea
  res.json({ id: '1' })
})

app.listen(PORT, () => {
  console.log(`MangAI API running on port ${PORT}`)
})
