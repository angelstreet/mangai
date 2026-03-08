import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Star } from 'lucide-react'
import { Header } from '../components/layout/Header'
import { ProtagonistList } from '../components/idea/ProtagonistList'
import { VoteForm } from '../components/idea/VoteForm'
import { AISuggestions } from '../components/idea/AISuggestions'
import { FollowButton } from '../components/idea/FollowButton'
import { VersionHistory } from '../components/idea/VersionHistory'
import { useUser } from '../hooks/useUser'
import type { Idea } from '../types'
import { API } from '../api'

function ReadonlyStars({ score }: { score: number }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map((s) => {
        const filled = score >= s
        const partial = !filled && score > s - 1
        return (
          <Star
            key={s}
            size={22}
            fill={filled ? 'var(--accent)' : 'none'}
            stroke={filled || partial ? 'var(--accent)' : 'var(--muted)'}
            strokeWidth={1.5}
            style={{ opacity: partial ? 0.5 : 1 }}
          />
        )
      })}
    </div>
  )
}

export default function IdeaDetail() {
  const { id } = useParams<{ id: string }>()
  const { userId } = useUser()
  const [idea, setIdea] = useState<Idea | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    fetch(`${API}/ideas/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Idea not found')
        return res.json() as Promise<Idea>
      })
      .then((data) => {
        setIdea(data)
      })
      .catch(() => {
        setError('Could not load this idea.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div>
        <Header title="Idea Detail" showBack />
        <div style={{ padding: 16 }}>
          <p style={{ color: 'var(--muted)', textAlign: 'center', paddingTop: 32 }}>
            Loading...
          </p>
        </div>
      </div>
    )
  }

  if (error || !idea) {
    return (
      <div>
        <Header title="Idea Detail" showBack />
        <div style={{ padding: 16 }}>
          <p style={{ color: 'var(--accent)', textAlign: 'center', paddingTop: 32 }}>
            {error ?? 'Idea not found.'}
          </p>
        </div>
      </div>
    )
  }

  const sectionStyle: React.CSSProperties = { marginBottom: 24 }

  return (
    <div>
      <Header title="Idea Detail" showBack />
      <div style={{ padding: 16 }}>

        {/* Hook */}
        <div style={sectionStyle}>
          <div className="section-label">Hook</div>
          <p style={{ fontSize: 17, fontWeight: 600, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
            {idea.hook}
          </p>
        </div>

        {/* Protagonists */}
        <div style={sectionStyle}>
          <div className="section-label">Protagonists</div>
          <ProtagonistList protagonists={idea.protagonists} />
        </div>

        {/* Sell Pitch */}
        <div style={sectionStyle}>
          <div className="section-label">Pitch</div>
          <p style={{ lineHeight: 1.6 }}>{idea.sell_pitch}</p>
        </div>

        {/* Theme */}
        <div style={sectionStyle}>
          <div className="section-label">Theme</div>
          <span className="tag accent">{idea.theme}</span>
        </div>

        {/* Twist (optional) */}
        {idea.twist && (
          <div style={sectionStyle}>
            <div className="section-label">Plot Twist</div>
            <p style={{ fontStyle: 'italic', lineHeight: 1.6, color: 'var(--muted)' }}>
              {idea.twist}
            </p>
          </div>
        )}

        {/* Storyline */}
        <div style={sectionStyle}>
          <div className="section-label">Storyline Engine</div>
          <p style={{ lineHeight: 1.6 }}>{idea.storyline}</p>
        </div>

        {/* Score summary */}
        <div className="card" style={sectionStyle}>
          <div
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: 'var(--accent)',
              lineHeight: 1,
              marginBottom: 8,
            }}
          >
            {idea.avg_score.toFixed(1)}
            <span style={{ fontSize: 20, color: 'var(--muted)', fontWeight: 400 }}> / 5</span>
          </div>
          <div style={{ marginBottom: 8 }}>
            <ReadonlyStars score={idea.avg_score} />
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 14, color: 'var(--muted)' }}>
            <span>{idea.vote_count} votes</span>
            <span>⭐ {idea.star_count} stars</span>
          </div>
          {idea.user_id !== userId && <FollowButton ideaId={idea.id} followCount={idea.follow_count ?? 0} />}
        </div>

        {/* Vote form — hidden on own ideas */}
        {idea.user_id !== userId && (
          <div className="card" style={sectionStyle}>
            <VoteForm ideaId={idea.id} />
          </div>
        )}

        {/* Version History — only if more than one version */}
        {(idea.version ?? 1) > 1 && (
          <VersionHistory ideaId={idea.id} currentVersion={idea.version ?? 1} />
        )}

        {/* AI Suggestions — only for own ideas */}
        {id && idea.user_id === userId && <AISuggestions ideaId={id} />}

      </div>
    </div>
  )
}
