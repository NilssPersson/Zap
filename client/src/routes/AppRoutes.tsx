import { Routes, Route } from "react-router-dom";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import About from "../pages/About";
import Home from "../pages/Home";
import RoomTest from "../pages/RoomTest";
import Builder from "../pages/Builder";
import TrueOrFalse from "../pages/hostQuestions/MSQ";
import StartScreen from "@/pages/phone/StartScreen";

export function AppRoutes() {
  const { isAuthenticated } = useKindeAuth();

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Builder /> : <Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/room-test" element={<RoomTest />} />
      <Route path="/home" element={<StartScreen />} />
      <Route
        path="/question-test"
        element={
          <TrueOrFalse
            question="What is your favourite fruit?"
            alternatives={["Apple", "Orange", "Pear", "Banana"]}
            countDownAnswer={30}
          />
        }
      />
    </Routes>
  );
} 