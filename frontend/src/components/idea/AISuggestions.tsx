import { useState } from 'react'
import { API } from '../../api'

interface Suggestion {
  hook?: string
  sell_pitch?: string
  theme?: string
  twist?: string
  storyline?: string
  general?: string
}

interface Props {
  ideaId: string
}

const FIELD_LABELS: Record<string, string> = {
  hook: 'Hook',
  sell_pitch: 'Sell Pitch',
  theme: 'Theme',
  twist: 'Plot Twist',
  storyline: 'Storyline',
  general: 'Overall Feedback',
}

export function AISuggestions({ ideaId }: Props) {
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  async function getSuggestions() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API}/ideas/${ideaId}/ai`, { method: 'POST' })
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      setSuggestions(json.data)
    } catch (e: any) {
      setError(e.message || 'Failed to get suggestions')
    } finally {
      setLoading(false)
    }
  }

  function copyField(key: string, value: string) {
    navigator.clipboard.writeText(value)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div style={{ marginTop: 24 }}>
      {!suggestions && (
        <button
          id="ai-suggest-btn"
          onClick={getSuggestions}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            background: loading ? 'var(--surface2)' : 'rgba(230,57,70,0.12)',
            border: '1px solid var(--accent)',
            borderRadius: 'var(--radius)',
            color: loading ? 'var(--muted)' : 'var(--accent)',
            fontWeight: 600,
            fontSize: 15,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          {loading ? '⏳ Thinking...' : '✨ Improve with AI'}
        </button>
      )}

      {error && (
        <p style={{ color: 'var(--accent)', marginTop: 8, fontSize: 14 }}>{error}</p>
      )}

      {suggestions && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p className="section-label">AI SUGGESTIONS</p>
            <button
              onClick={() => setSuggestions(null)}
              style={{ color: 'var(--muted)', fontSize: 12 }}
            >
              dismiss
            </button>
          </div>

          {Object.entries(suggestions).map(([key, value]) => {
            if (!value) return null
            return (
              <div key={key} className="card" style={{ position: 'relative' }}>
                <p className="section-label" style={{ marginBottom: 6 }}>
                  {FIELD_LABELS[key] || key}
                </p>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text)', paddingRight: 60 }}>
                  {value}
                </p>
                <button
                  onClick={() => copyField(key, value)}
                  style={{
                    position: 'absolute', top: 12, right: 12,
                    fontSize: 11, color: copied === key ? 'var(--accent)' : 'var(--muted)',
                    padding: '4px 8px',
                    background: 'var(--surface2)',
                    borderRadius: 6,
                    border: '1px solid var(--border)',
                  }}
                >
                  {copied === key ? '✓ copied' : 'copy'}
                </button>
              </div>
            )
          })}

          <button
            onClick={getSuggestions}
            style={{
              padding: '10px',
              background: 'none',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              color: 'var(--muted)',
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            ↻ Regenerate suggestions
          </button>
        </div>
      )}
    </div>
  )
}
