import { Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import About from './pages/About'

import Home from './pages/Home'
import Phomescreen from './pages/phone/Phomescreen'

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/Phomescreen" element={<Phomescreen />} />
        </Routes>
      </main>
    </div>
  )
}

export default App