import { Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import About from './pages/About'
import Home from './pages/Home'

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  )
}

export default App