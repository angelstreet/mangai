import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BottomNav } from './components/layout/BottomNav'
import { useUser } from './hooks/useUser'
import Login from './pages/Login'
import Feed from './pages/Feed'
import Submit from './pages/Submit'
import IdeaDetail from './pages/IdeaDetail'
import Starred from './pages/Starred'
import MyIdeas from './pages/MyIdeas'
import Profile from './pages/Profile'

export default function App() {
  const { user, loading } = useUser()

  if (loading) return null

  if (!user) return <Login onLogin={() => window.location.reload()} />

  return (
    <BrowserRouter basename="/mangai">
      <main>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/ideas/:id" element={<IdeaDetail />} />
          <Route path="/starred" element={<Starred />} />
          <Route path="/my-ideas" element={<MyIdeas />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      <BottomNav />
    </BrowserRouter>
  )
}
