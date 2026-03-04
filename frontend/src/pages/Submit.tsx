import { useState } from 'react'

export default function Submit() {
  const [form, setForm] = useState({
    title: '',
    premise: '',
    genre: '',
    targetAudience: '',
    uniqueSellingPoints: ''
  })
  const [submitting, setSubmitting] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (res.ok) {
        alert('Idea submitted successfully!')
        setForm({
          title: '',
          premise: '',
          genre: '',
          targetAudience: '',
          uniqueSellingPoints: ''
        })
      }
    } catch (err) {
      console.error(err)
      alert('Error submitting idea')
    } finally {
      setSubmitting(false)
    }
  }
  
  return (
    <div className="submit">
      <h2>Submit Manga Idea</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({...form, title: e.target.value})}
          required
        />
        <textarea
          placeholder="Premise"
          value={form.premise}
          onChange={e => setForm({...form, premise: e.target.value})}
          rows={4}
          required
        />
        <select
          value={form.genre}
          onChange={e => setForm({...form, genre: e.target.value})}
          required
        >
          <option value="">Select Genre</option>
          <option value="shonen">Shonen</option>
          <option value="shojo">Shojo</option>
          <option value="seinen">Seinen</option>
          <option value="josei">Josei</option>
          <option value="kodomo">Kodomo</option>
          <option value="other">Other</option>
        </select>
        <input
          type="text"
          placeholder="Target Audience"
          value={form.targetAudience}
          onChange={e => setForm({...form, targetAudience: e.target.value})}
        />
        <textarea
          placeholder="Unique Selling Points"
          value={form.uniqueSellingPoints}
          onChange={e => setForm({...form, uniqueSellingPoints: e.target.value})}
          rows={3}
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Idea'}
        </button>
      </form>
    </div>
  )
}
