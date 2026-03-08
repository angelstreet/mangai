import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { StepHeader } from '../components/form/StepHeader'
import { NavButtons } from '../components/form/NavButtons'
import { useUser } from '../hooks/useUser'
import { API } from '../api'

interface Protagonist {
  name: string
  pitch: string
}

const TOTAL_STEPS = 9

const STEP_TITLES: Record<number, string> = {
  1: 'Title',
  2: 'Genre Tags',
  3: 'Hook',
  4: 'Protagonists',
  5: 'Sell Pitch',
  6: 'Theme',
  7: 'Plot Twist',
  8: 'Storyline Engine',
  9: 'Preview & Submit',
}

const ALL_TAGS = [
  'Shonen', 'Shojo', 'Seinen', 'Josei',
  'Action', 'Adventure', 'Fantasy', 'Sci-Fi',
  'Romance', 'Horror', 'Mystery', 'Thriller',
  'Isekai', 'Slice of Life', 'Comedy', 'Drama',
  'Supernatural', 'Mecha', 'Sports', 'Historical',
]

const emptyProtagonist = (): Protagonist => ({ name: '', pitch: '' })

export default function Submit() {
  const navigate = useNavigate()
  const { userId } = useUser()

  const [step, setStep] = useState(1)
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [hook, setHook] = useState('')
  const [protagonists, setProtagonists] = useState<Protagonist[]>([
    emptyProtagonist(),
    emptyProtagonist(),
    emptyProtagonist(),
  ])
  const [sellPitch, setSellPitch] = useState('')
  const [theme, setTheme] = useState('')
  const [twist, setTwist] = useState('')
  const [noTwist, setNoTwist] = useState(false)
  const [storyline, setStoryline] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // ── helpers ────────────────────────────────────────────────────────────────

  const hookLines = hook === '' ? 0 : hook.split('\n').length
  const hookValid = hookLines <= 3
  const hookError = !hookValid ? 'Max 3 lines' : ''

  const goBack = () => setStep((s) => s - 1)
  const goNext = () => { setError(''); setStep((s) => s + 1) }

  // ── protagonist helpers ────────────────────────────────────────────────────

  const updateProtagonist = (idx: number, field: keyof Protagonist, value: string) => {
    setProtagonists((prev) => {
      const next = [...prev]
      next[idx] = { ...next[idx], [field]: value }
      return next
    })
  }

  const addProtagonist = () => {
    if (protagonists.length < 5) setProtagonists((p) => [...p, emptyProtagonist()])
  }

  const removeProtagonist = (idx: number) => {
    if (protagonists.length > 3) setProtagonists((p) => p.filter((_, i) => i !== idx))
  }

  // ── submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API}/ideas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          tags,
          hook,
          protagonists,
          sell_pitch: sellPitch,
          theme,
          twist: noTwist ? null : twist,
          storyline,
          user_id: userId,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data as { message?: string }).message ?? `Error ${res.status}`)
      }
      const data = await res.json() as { id: string }
      navigate(`/ideas/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // ── shared style ───────────────────────────────────────────────────────────

  const stepWrap: React.CSSProperties = {
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  }

  // ── steps ──────────────────────────────────────────────────────────────────

  const renderStep = () => {
    switch (step) {
      // ── Step 1: Title ───────────────────────────────────────────────────────
      case 1:
        return (
          <div style={stepWrap}>
            <StepHeader step={step} total={TOTAL_STEPS} title={STEP_TITLES[step]} />
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>The name of your manga — keep it short and memorable.</p>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Beast King"
              maxLength={60}
              autoFocus
            />
            <NavButtons onNext={goNext} disabled={title.trim() === ''} />
          </div>
        )

      // ── Step 2: Genre Tags ──────────────────────────────────────────────────
      case 2:
        return (
          <div style={stepWrap}>
            <StepHeader step={step} total={TOTAL_STEPS} title={STEP_TITLES[step]} />
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>Pick up to 4 genres that describe your manga.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {ALL_TAGS.map(tag => {
                const selected = tags.includes(tag)
                return (
                  <button
                    key={tag}
                    onClick={() => setTags(prev =>
                      selected ? prev.filter(t => t !== tag)
                        : prev.length < 4 ? [...prev, tag] : prev
                    )}
                    style={{
                      padding: '6px 14px', borderRadius: 20, fontSize: 13, cursor: 'pointer',
                      border: `1px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
                      background: selected ? 'rgba(230,57,70,0.12)' : 'var(--surface2)',
                      color: selected ? 'var(--accent)' : 'var(--muted)',
                      fontWeight: selected ? 700 : 400,
                      opacity: (!selected && tags.length >= 4) ? 0.4 : 1,
                    }}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>
            {tags.length > 0 && (
              <p style={{ fontSize: 12, color: 'var(--muted)' }}>{tags.length} / 4 selected</p>
            )}
            <NavButtons onBack={goBack} onNext={goNext} disabled={tags.length === 0} />
          </div>
        )

      // ── Step 3: Hook ────────────────────────────────────────────────────────
      case 3:
        return (
          <div style={stepWrap}>
            <StepHeader step={step} total={TOTAL_STEPS} title={STEP_TITLES[step]} />
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>
              The opening hook — 3 lines max.
            </p>
            <div>
              <textarea
                rows={4}
                value={hook}
                onChange={(e) => setHook(e.target.value)}
                placeholder="Write your hook here..."
                style={{ resize: 'none' }}
              />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 6,
                fontSize: 13,
              }}>
                <span style={{ color: hookError ? 'var(--accent)' : 'var(--muted)' }}>
                  {hookError || '\u00a0'}
                </span>
                <span style={{ color: hookLines > 3 ? 'var(--accent)' : 'var(--muted)' }}>
                  {hookLines} / 3 lines
                </span>
              </div>
            </div>
            <NavButtons
              onNext={goNext}
              disabled={!hookValid || hook.trim() === ''}
            />
          </div>
        )

      // ── Step 4: Protagonists ────────────────────────────────────────────────
      case 4:
        return (
          <div style={stepWrap}>
            <StepHeader step={step} total={TOTAL_STEPS} title={STEP_TITLES[step]} />
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>
              3–5 protagonists. Each needs a name and a one-line pitch.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {protagonists.map((p, idx) => (
                <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="section-label">Protagonist {idx + 1}</span>
                    <button
                      onClick={() => removeProtagonist(idx)}
                      disabled={protagonists.length <= 3}
                      style={{
                        fontSize: 12,
                        color: protagonists.length <= 3 ? 'var(--border)' : 'var(--muted)',
                        padding: '2px 8px',
                        border: '1px solid var(--border)',
                        borderRadius: 6,
                        cursor: protagonists.length <= 3 ? 'not-allowed' : 'pointer',
                      }}
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Name"
                    value={p.name}
                    onChange={(e) => updateProtagonist(idx, 'name', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="One-line pitch"
                    value={p.pitch}
                    onChange={(e) => updateProtagonist(idx, 'pitch', e.target.value)}
                  />
                </div>
              ))}
            </div>
            <button
              className="btn-secondary"
              onClick={addProtagonist}
              disabled={protagonists.length >= 5}
              style={{
                opacity: protagonists.length >= 5 ? 0.45 : 1,
                cursor: protagonists.length >= 5 ? 'not-allowed' : 'pointer',
              }}
            >
              + Add protagonist ({protagonists.length} / 5)
            </button>
            <NavButtons
              onBack={goBack}
              onNext={goNext}
              disabled={protagonists.length < 3 || protagonists.some((p) => p.name.trim() === '')}
            />
          </div>
        )

      // ── Step 5: Sell Pitch ──────────────────────────────────────────────────
      case 5:
        return (
          <div style={stepWrap}>
            <StepHeader step={step} total={TOTAL_STEPS} title={STEP_TITLES[step]} />
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>
              2–3 sentences — why should someone read this?
            </p>
            <textarea
              rows={5}
              value={sellPitch}
              onChange={(e) => setSellPitch(e.target.value)}
              placeholder="Make them want to read it..."
              style={{ resize: 'none' }}
            />
            <NavButtons
              onBack={goBack}
              onNext={goNext}
              disabled={sellPitch.trim() === ''}
            />
          </div>
        )

      // ── Step 6: Theme ───────────────────────────────────────────────────────
      case 6:
        return (
          <div style={stepWrap}>
            <StepHeader step={step} total={TOTAL_STEPS} title={STEP_TITLES[step]} />
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>
              The central question or tension (1 line).
            </p>
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="e.g. Can identity survive power?"
            />
            <NavButtons
              onBack={goBack}
              onNext={goNext}
              disabled={theme.trim() === ''}
            />
          </div>
        )

      // ── Step 7: Plot Twist ──────────────────────────────────────────────────
      case 7:
        return (
          <div style={stepWrap}>
            <StepHeader step={step} total={TOTAL_STEPS} title={STEP_TITLES[step]} />
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={noTwist}
                onChange={(e) => setNoTwist(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: 'var(--accent)' }}
              />
              <span style={{ fontSize: 14, color: 'var(--muted)' }}>No twist — this story plays it straight</span>
            </label>
            {!noTwist && (
              <textarea
                rows={4}
                value={twist}
                onChange={(e) => setTwist(e.target.value)}
                placeholder="Describe the plot twist..."
                style={{ resize: 'none' }}
              />
            )}
            <NavButtons
              onBack={goBack}
              onNext={goNext}
            />
          </div>
        )

      // ── Step 8: Storyline Engine ────────────────────────────────────────────
      case 8:
        return (
          <div style={stepWrap}>
            <StepHeader step={step} total={TOTAL_STEPS} title={STEP_TITLES[step]} />
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>
              The main narrative driver (e.g. Wall Expansion + Rite Hunt).
            </p>
            <input
              type="text"
              value={storyline}
              onChange={(e) => setStoryline(e.target.value)}
              placeholder="e.g. Exile Arc + Redemption Loop"
            />
            <NavButtons
              onBack={goBack}
              onNext={goNext}
              disabled={storyline.trim() === ''}
            />
          </div>
        )

      // ── Step 9: Preview + Submit ────────────────────────────────────────────
      case 9:
        return (
          <div style={stepWrap}>
            <StepHeader step={step} total={TOTAL_STEPS} title={STEP_TITLES[step]} />
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>Review your idea before submitting.</p>

            <div className="card">
              <p className="section-label">Title</p>
              <p style={{ fontWeight: 700, fontSize: 16 }}>{title}</p>
            </div>

            <div className="card">
              <p className="section-label">Tags</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                {tags.map(t => (
                  <span key={t} style={{ fontSize: 12, padding: '2px 10px', borderRadius: 20, background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted)' }}>{t}</span>
                ))}
              </div>
            </div>

            <div className="card">
              <p className="section-label">Hook</p>
              <p style={{ whiteSpace: 'pre-line' }}>{hook}</p>
            </div>

            <div className="card">
              <p className="section-label">Protagonists</p>
              <ol style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                {protagonists.map((p, idx) => (
                  <li key={idx} style={{ fontSize: 14 }}>
                    <strong>{p.name}</strong>
                    {p.pitch && <span style={{ color: 'var(--muted)' }}> — {p.pitch}</span>}
                  </li>
                ))}
              </ol>
            </div>

            <div className="card">
              <p className="section-label">Sell Pitch</p>
              <p style={{ fontSize: 14 }}>{sellPitch}</p>
            </div>

            <div className="card">
              <p className="section-label">Theme</p>
              <p style={{ fontSize: 14 }}>{theme}</p>
            </div>

            <div className="card">
              <p className="section-label">Plot Twist</p>
              {noTwist
                ? <p style={{ fontSize: 14, color: 'var(--muted)', fontStyle: 'italic' }}>None</p>
                : (
                  <p style={{ fontSize: 14, whiteSpace: 'pre-line' }}>
                    {twist.trim() !== ''
                      ? twist
                      : <span style={{ color: 'var(--muted)', fontStyle: 'italic' }}>Not provided</span>
                    }
                  </p>
                )
              }
            </div>

            <div className="card">
              <p className="section-label">Storyline Engine</p>
              <p style={{ fontSize: 14 }}>{storyline}</p>
            </div>

            {error && (
              <p style={{ color: 'var(--accent)', fontSize: 14, textAlign: 'center' }}>{error}</p>
            )}

            <NavButtons
              onBack={goBack}
              onNext={handleSubmit}
              nextLabel={loading ? 'Submitting...' : 'Submit Idea'}
              disabled={loading}
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div>
      <Header title="Submit Idea" showBack />
      {renderStep()}
    </div>
  )
}
