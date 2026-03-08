import { useState } from 'react'
import { Star, Bookmark } from 'lucide-react'
import type { Idea } from '../../types'
import { useUser } from '../../hooks/useUser'
import { API } from '../../api'

interface IdeaCardProps {
  idea: Idea
  onClick: () => void
}

function StarDisplay({ score }: { score: number }) {
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={12}
          fill={score >= s ? 'var(--accent)' : 'none'}
          stroke={score >= s ? 'var(--accent)' : 'var(--muted)'}
          strokeWidth={1.5}
        />
      ))}
    </div>
  )
}

export function IdeaCard({ idea, onClick }: IdeaCardProps) {
  const { userId } = useUser()
  const [followed, setFollowed] = useState(false)

  const title = idea.title || idea.hook.split('\n')[0]
  const description = idea.sell_pitch.length > 90
    ? idea.sell_pitch.slice(0, 90).trimEnd() + '…'
    : idea.sell_pitch
  const author = idea.user_id === 'user_dev' ? 'TestUser' : idea.user_id.slice(0, 10)
  const isOwn = idea.user_id === userId

  async function handleFollow(e: React.MouseEvent) {
    e.stopPropagation()
    const res = await fetch(`${API}/ideas/${idea.id}/follow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    })
    const data = await res.json()
    setFollowed(data.following)
  }

  return (
    <div
      className="card"
      onClick={onClick}
      style={{ marginBottom: 12, cursor: 'pointer', padding: '14px 16px' }}
    >
      {/* Row 1: title (left) + author badge (right) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
        <div style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.3, flex: 1 }}>
          {title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          {idea.version > 1 && (
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.04em',
              color: 'var(--accent2)', background: 'rgba(244,162,97,0.15)',
              padding: '2px 6px', borderRadius: 4,
            }}>
              v{idea.version}
            </span>
          )}
          <span style={{
            fontSize: 11, fontWeight: 600,
            color: isOwn ? 'var(--accent)' : 'var(--muted)',
            background: isOwn ? 'rgba(230,57,70,0.1)' : 'var(--surface2)',
            border: `1px solid ${isOwn ? 'rgba(230,57,70,0.3)' : 'var(--border)'}`,
            padding: '2px 8px', borderRadius: 20,
          }}>
            {author}
          </span>
        </div>
      </div>

      {/* Row 2: genre tags */}
      {idea.tags?.length > 0 && (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
          {idea.tags.map(tag => (
            <span key={tag} style={{
              fontSize: 11, fontWeight: 600, color: 'var(--muted)',
              background: 'var(--surface2)', border: '1px solid var(--border)',
              padding: '2px 8px', borderRadius: 20, letterSpacing: '0.02em',
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Row 3: short description — single line */}
      <p style={{
        fontSize: 13, color: 'var(--muted)', marginBottom: 12,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        {description}
      </p>

      {/* Row 4: stats + follow (hidden on own ideas) */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        onClick={(e) => e.stopPropagation()}
      >
        {!isOwn && <StarDisplay score={Math.round(idea.avg_score)} />}
        {!isOwn && (
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)' }}>
            {idea.avg_score > 0 ? idea.avg_score.toFixed(1) : '–'}
          </span>
        )}
        {!isOwn && <span style={{ fontSize: 12, color: 'var(--border)' }}>·</span>}
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>
          {idea.vote_count} vote{idea.vote_count !== 1 ? 's' : ''}
        </span>
        <span style={{ fontSize: 12, color: 'var(--border)' }}>·</span>
        <span style={{ fontSize: 12, color: 'var(--muted)', flex: 1 }}>
          {idea.follow_count} following
        </span>
        {!isOwn && (
          <button
            onClick={handleFollow}
            title="Follow"
            style={{
              padding: '4px 12px',
              borderRadius: 20,
              border: `1px solid ${followed ? 'var(--accent)' : 'var(--border)'}`,
              background: followed ? 'rgba(230,57,70,0.1)' : 'transparent',
              color: followed ? 'var(--accent)' : 'var(--muted)',
              display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500,
            }}
          >
            <Bookmark size={12} fill={followed ? 'var(--accent)' : 'none'} strokeWidth={1.5} />
            {followed ? 'Following' : 'Follow'}
          </button>
        )}
      </div>
    </div>
  )
}
