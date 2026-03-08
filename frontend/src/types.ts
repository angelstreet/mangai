export interface Protagonist {
  name: string
  pitch: string
}

export interface Idea {
  id: string
  user_id: string
  title: string
  hook: string
  protagonists: Protagonist[]
  sell_pitch: string
  theme: string
  twist: string | null
  storyline: string
  avg_score: number
  vote_count: number
  star_count: number
  follow_count: number
  version: number
  status: string
  created_at: string
}

export interface Vote {
  id: string
  idea_id: string
  user_id: string
  score: number
  comment: string
  action: string | null
  created_at: string
}
