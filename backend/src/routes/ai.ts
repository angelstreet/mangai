import { Router } from 'express'
import Anthropic from '@anthropic-ai/sdk'
import { db } from '../db'

const router = Router()
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

router.post('/:id/ai', async (req, res) => {
  try {
    const { id } = req.params

    // Fetch idea from DB
    const result = await db.execute({
      sql: 'SELECT * FROM ideas WHERE id = ?',
      args: [id]
    })

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Idea not found' })
    }

    const idea = result.rows[0]
    const protagonists = JSON.parse(idea.protagonists as string)
    const protagonistText = protagonists.map((p: any, i: number) =>
      `${i+1}. ${p.name}: ${p.pitch}`
    ).join('\n')

    const prompt = `You are a manga story consultant. Analyze this manga idea and suggest specific improvements for each field. Be creative, constructive, and brief (1-3 sentences per field).

MANGA IDEA:
Hook: ${idea.hook}
Protagonists:
${protagonistText}
Pitch: ${idea.sell_pitch}
Theme: ${idea.theme}
Twist: ${idea.twist || 'None'}
Storyline: ${idea.storyline}

Return ONLY valid JSON matching this exact shape:
{
  "hook": "improved hook suggestion",
  "sell_pitch": "improved pitch suggestion",
  "theme": "improved theme suggestion",
  "twist": "plot twist suggestion or improvement",
  "storyline": "storyline engine suggestion",
  "general": "1-2 sentences of overall feedback"
}`

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }]
    })

    const content = message.content[0]
    if (content.type !== 'text') throw new Error('Unexpected response type')

    // Extract JSON from response (handle potential markdown code blocks)
    const jsonMatch = content.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON in response')

    const suggestions = JSON.parse(jsonMatch[0])
    res.json({ data: suggestions })

  } catch (err: any) {
    console.error('AI route error:', err)
    res.status(500).json({ error: err.message || 'AI suggestion failed' })
  }
})

export default router
