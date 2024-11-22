import { Routes, Route } from "react-router-dom";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import About from "../pages/About";
import Home from "../pages/Home";
import Quizzes from "../pages/Quizzes";
import StartScreen from "@/pages/joinQuiz/StartScreen";
import QuizView from "../pages/QuizView";
import QuizEdit from "../pages/QuizEdit";
import ParticipantLogic from "@/pages/participantQuizView/ParticipantLogic";
import Profile from "@/pages/User/Profile";
import HostLogic from "@/pages/HostLogic";

export function AppRoutes() {
  const { isAuthenticated } = useKindeAuth();

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Quizzes /> : <Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/play" element={<StartScreen />} />
      <Route path="/quizzes/:id" element={<QuizView />} />
      <Route path="/quizzes/:id/edit" element={<QuizEdit />} />
      <Route path="/play/:quizCode/" element={<ParticipantLogic />} />
      <Route path="/quizzes/:id/lobby" element={<HostLogic />} />
      <Route path="/profile" element={<Profile />} /> 
    </Routes>
  );
}
