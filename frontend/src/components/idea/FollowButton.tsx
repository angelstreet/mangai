import { useState } from 'react'
import { useUser } from '../../hooks/useUser'
import { API } from '../../api'

export function FollowButton({ ideaId, followCount }: { ideaId: string; followCount: number }) {
  const { userId } = useUser()
  const [following, setFollowing] = useState(false)
  const [count, setCount] = useState(followCount)
  const [loading, setLoading] = useState(false)

  async function toggle() {
    setLoading(true)
    const res = await fetch(`${API}/ideas/${ideaId}/follow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId })
    })
    const data = await res.json()
    setFollowing(data.following)
    setCount(c => data.following ? c + 1 : c - 1)
    setLoading(false)
  }

  return (
    <button onClick={toggle} disabled={loading} style={{
      marginTop: 12, width: '100%', padding: '10px',
      borderRadius: 'var(--radius)',
      border: `1px solid ${following ? 'var(--accent)' : 'var(--border)'}`,
      background: following ? 'rgba(230,57,70,0.12)' : 'var(--surface2)',
      color: following ? 'var(--accent)' : 'var(--muted)',
      fontWeight: 600, fontSize: 14, cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    }}>
      {following ? '📌 Following' : '+ Follow'} · {count}
    </button>
  )
}
