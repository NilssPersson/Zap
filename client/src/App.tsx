
import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import About from "./pages/About";
import Home from "./pages/Home";
import RoomTest from "./pages/RoomTest";
import { KindeProvider } from "@kinde-oss/kinde-auth-react";
import Builder from "./pages/Builder";


function App() {
  return (
    <div className="min-h-screen bg-[url('/assets/bg-mobile.svg')] md:bg-[url('/assets/bg-desktop.svg')] bg-cover bg-no-repeat bg-center">
      <main className="min-h-screen flex flex-col">
        <KindeProvider
          clientId="7b50afa95aec4cba88bad0abb4b94dfa"
          domain="https://gameshack.kinde.com"
          redirectUri="http://localhost:5173/builder"
          logoutUri="http://localhost:5173"
        >
          <Header />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/builder" element={<Builder />} />
            <Route path="/room-test" element={<RoomTest />} />
          </Routes>
        </KindeProvider>
      </main>
    </div>
  );
}

export default App;
