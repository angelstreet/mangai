import { useState } from 'react'
import { StarRating } from './StarRating'
import { useUser } from '../../hooks/useUser'
import { API } from '../../api'

interface VoteFormProps {
  ideaId: string
}

export function VoteForm({ ideaId }: VoteFormProps) {
  const { userId } = useUser()
  const [score, setScore] = useState(3)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API}/ideas/${ideaId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, score, comment, action: null }),
      })
      if (!res.ok) throw new Error('Failed to submit')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div style={{
        padding: 16, background: 'rgba(230,57,70,0.1)',
        borderRadius: 'var(--radius)', border: '1px solid var(--accent)',
        textAlign: 'center', fontWeight: 600, color: 'var(--accent)',
      }}>
        Thanks for rating!
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <p className="section-label">Rate this idea</p>
      <StarRating value={score} onChange={setScore} />
      <textarea
        rows={3}
        placeholder="Leave a comment... (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        style={{ resize: 'vertical' }}
      />
      {error && <p style={{ color: 'var(--accent)', fontSize: 14 }}>{error}</p>}
      <button
        className="btn-primary"
        onClick={handleSubmit}
        disabled={loading}
        style={{ opacity: loading ? 0.7 : 1 }}
      >
        {loading ? 'Submitting…' : 'Submit Rating'}
      </button>
    </div>
  )
}
