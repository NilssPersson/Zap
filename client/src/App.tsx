import { Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { KindeProvider } from '@kinde-oss/kinde-auth-react'
import About from './pages/About'
import Home from './pages/Home'

function App() {
  return (
    <div className="min-h-screen bg-[url('/assets/bg-mobile.svg')] md:bg-[url('/assets/bg-desktop.svg')] bg-cover bg-no-repeat bg-center">
      <main>
        <KindeProvider
          clientId="7b50afa95aec4cba88bad0abb4b94dfa"
          domain="https://gameshack.kinde.com"
          redirectUri="http://localhost:5173"
          logoutUri="http://localhost:5173"
        >
          <Header />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </KindeProvider>
      </main>
    </div>
  )
}

export default App