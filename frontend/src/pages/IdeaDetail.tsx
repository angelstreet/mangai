import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Star, ChevronDown, ChevronRight } from 'lucide-react'
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

function Section({
  label,
  defaultOpen = true,
  extra,
  children,
}: {
  label: string
  defaultOpen?: boolean
  extra?: React.ReactNode
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ marginBottom: 24 }}>
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          cursor: 'pointer', marginBottom: open ? 6 : 0,
        }}
        onClick={() => setOpen(o => !o)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {open
            ? <ChevronDown size={14} color="var(--muted)" />
            : <ChevronRight size={14} color="var(--muted)" />}
          <span className="section-label" style={{ marginBottom: 0 }}>{label}</span>
        </div>
        {extra && <div onClick={e => e.stopPropagation()}>{extra}</div>}
      </div>
      {open && children}
    </div>
  )
}

const FONT_SIZES = { S: 13, M: 15, L: 18 }
type FontSize = keyof typeof FONT_SIZES

export default function IdeaDetail() {
  const { id } = useParams<{ id: string }>()
  const { userId } = useUser()
  const [idea, setIdea] = useState<Idea | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fontSize, setFontSize] = useState<FontSize>('M')

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

  const fontSizePicker = (
    <div style={{ display: 'flex', gap: 4 }}>
      {(['S', 'M', 'L'] as FontSize[]).map(s => (
        <button
          key={s}
          onClick={() => setFontSize(s)}
          style={{
            fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 6,
            border: '1px solid var(--border)',
            background: fontSize === s ? 'var(--accent)' : 'var(--surface2)',
            color: fontSize === s ? '#fff' : 'var(--muted)',
            cursor: 'pointer',
          }}
        >{s}</button>
      ))}
    </div>
  )

  return (
    <div>
      <Header title="Idea Detail" showBack />
      <div style={{ padding: 16 }}>

        <Section label="Hook" extra={fontSizePicker}>
          <p style={{ fontSize: FONT_SIZES[fontSize], whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
            {idea.hook}
          </p>
        </Section>

        <Section label="Protagonists">
          <ProtagonistList protagonists={idea.protagonists} />
        </Section>

        <Section label="Synopsis">
          <p style={{ lineHeight: 1.6 }}>{idea.sell_pitch}</p>
        </Section>

        <Section label="Theme">
          <p style={{ lineHeight: 1.6 }}>🚩 {idea.theme}</p>
        </Section>

        {idea.tags?.length > 0 && (
          <Section label="Genres">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
              {idea.tags.map(tag => (
                <span key={tag} style={{
                  fontSize: 12, fontWeight: 600, padding: '3px 12px', borderRadius: 20,
                  background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted)',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </Section>
        )}

        {idea.twist && (
          <Section label="Plot Twist">
            <p style={{ fontStyle: 'italic', lineHeight: 1.6, color: 'var(--muted)' }}>
              {idea.twist}
            </p>
          </Section>
        )}

        <Section label="Storyline Engine">
          <p style={{ lineHeight: 1.6 }}>{idea.storyline}</p>
        </Section>

        {/* Score summary */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 40, fontWeight: 700, color: 'var(--accent)', lineHeight: 1, marginBottom: 8 }}>
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
          <div className="card" style={{ marginBottom: 24 }}>
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
