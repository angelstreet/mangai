import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { IdeaCard } from '../components/idea/IdeaCard'
import { useUser } from '../hooks/useUser'
import { API } from '../api'
import type { Idea } from '../types'

export default function MyIdeas() {
  const { userId } = useUser()
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!userId) return
    fetch(`${API}/ideas`)
      .then(r => r.json())
      .then((all: Idea[]) => setIdeas(all.filter(i => i.user_id === userId)))
      .finally(() => setLoading(false))
  }, [userId])

  return (
    <div>
      <Header title="My Ideas" />
      <div style={{ padding: 16 }}>
        {loading && <p style={{ color: 'var(--muted)', textAlign: 'center', paddingTop: 32 }}>Loading…</p>}
        {!loading && ideas.length === 0 && (
          <p style={{ color: 'var(--muted)', textAlign: 'center', paddingTop: 32 }}>
            No ideas yet — submit your first one!
          </p>
        )}
        {ideas.map(idea => (
          <IdeaCard key={idea.id} idea={idea} onClick={() => navigate(`/ideas/${idea.id}`)} />
        ))}
      </div>
    </div>
  )
}
