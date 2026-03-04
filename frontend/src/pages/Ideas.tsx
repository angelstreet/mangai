import { useState, useEffect } from 'react'

interface Idea {
  id: string
  title: string
  premise: string
  genre: string
  likes: number
  status: 'idea' | 'pilot' | 'production' | 'rejected'
}

export default function Ideas() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  
  useEffect(() => {
    // Fetch ideas from API
    fetch('/api/ideas')
      .then(res => res.json())
      .then(data => setIdeas(data))
      .catch(console.error)
  }, [])
  
  return (
    <div className="ideas">
      <h2>Manga Ideas</h2>
      <div className="ideas-grid">
        {ideas.map(idea => (
          <div key={idea.id} className="idea-card">
            <h3>{idea.title}</h3>
            <p className="genre">{idea.genre}</p>
            <p className="premise">{idea.premise}</p>
            <div className="likes">
              <span>❤️</span> {idea.likes} / 1000
            </div>
            <div className="status">{idea.status}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
