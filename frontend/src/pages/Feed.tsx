import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IdeaCard } from '../components/idea/IdeaCard'
import type { Idea } from '../types'
import { API } from '../api'
import { useUser } from '../hooks/useUser'

export default function Feed() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sort, setSort] = useState<'top' | 'new' | 'followed' | 'voted'>('top')
  const navigate = useNavigate()
  const { userId } = useUser()

  async function fetchIdeas() {
    setLoading(true)
    setError(null)
    try {
      let url: string
      if (sort === 'followed') {
        url = `${API}/follows?user_id=${userId}`
      } else {
        url = `${API}/ideas?sort=${sort}`
      }
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch ideas')
      const data: Idea[] = await res.json()
      setIdeas(data)
    } catch {
      setError('Could not load ideas. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIdeas()
  }, [sort])

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '14px 16px', background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <img src="/mangai/logo.png" alt="MangAI" style={{ width: 28, height: 28 }} />
        <span style={{ fontSize: 18, fontWeight: 700 }}>MangAI</span>
      </div>

      {/* Filter tab bar */}
      <div style={{
        display: 'flex', gap: 8, padding: '10px 16px',
        overflowX: 'auto', borderBottom: '1px solid var(--border)',
        scrollbarWidth: 'none',
      }}>
        {(['top', 'new', 'followed', 'voted'] as const).map(s => (
          <button key={s} onClick={() => setSort(s)} style={{
            padding: '6px 16px', borderRadius: 20, whiteSpace: 'nowrap',
            border: '1px solid',
            borderColor: sort === s ? 'var(--accent)' : 'var(--border)',
            background: sort === s ? 'rgba(230,57,70,0.12)' : 'var(--surface2)',
            color: sort === s ? 'var(--accent)' : 'var(--muted)',
            fontWeight: sort === s ? 700 : 400, fontSize: 13,
          }}>
            {s === 'top' ? '🔥 Top' : s === 'new' ? '✨ New' : s === 'followed' ? '📌 Followed' : '🗳️ Voted'}
          </button>
        ))}
      </div>

      <div style={{ padding: 16 }}>
        {loading && (
          <p style={{ color: 'var(--muted)', textAlign: 'center', paddingTop: 32 }}>
            Loading ideas...
          </p>
        )}

        {!loading && error && (
          <p style={{ color: 'var(--accent)', textAlign: 'center', paddingTop: 32 }}>
            {error}
          </p>
        )}

        {!loading && !error && ideas.length === 0 && (
          <p style={{ color: 'var(--muted)', textAlign: 'center', paddingTop: 32 }}>
            No ideas yet. Be the first to submit one!
          </p>
        )}

        {!loading && !error && ideas.map((idea) => (
          <IdeaCard
            key={idea.id}
            idea={idea}
            onClick={() => navigate(`/ideas/${idea.id}`)}
          />
        ))}
      </div>
    </div>
  )
}
