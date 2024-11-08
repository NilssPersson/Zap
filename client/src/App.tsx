import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import About from "./pages/About";
import Home from "./pages/Home";
import RoomTest from "./pages/RoomTest";

function App() {
  return (
    <div className="min-h-screen bg-[url('/assets/bg-mobile.svg')] md:bg-[url('/assets/bg-desktop.svg')] bg-cover bg-no-repeat bg-center">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/room-test" element={<RoomTest />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
