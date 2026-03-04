import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Ideas from './pages/Ideas'
import Submit from './pages/Submit'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav>
          <h1>MangAI</h1>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/ideas">Ideas</a></li>
            <li><a href="/submit">Submit</a></li>
          </ul>
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ideas" element={<Ideas />} />
            <Route path="/submit" element={<Submit />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
