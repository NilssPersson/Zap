import { Routes, Route } from "react-router-dom";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import About from "../pages/About";
import Home from "../pages/Home";
import RoomTest from "../pages/RoomTest";
import Quizzes from "../pages/Quizzes";
import MCQ from "../pages/hostQuestions/MCQ";
import StartScreen from "@/pages/Participant/StartScreen";
import QuizView from "../pages/QuizView";
import QuizEdit from "../pages/QuizEdit";
import ParticipantManager from "@/pages/Participant/ParticipantManager";
import QuizLobby from "../pages/QuizLobby";

export function AppRoutes() {
  const { isAuthenticated } = useKindeAuth();

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Quizzes /> : <Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/room-test" element={<RoomTest />} />
      <Route path="/home" element={<StartScreen />} />

      <Route
        path="/question-test"
        element={
          <MCQ
            question="What is your favourite fruit?"
            alternatives={["Apple", "Orange", "Pear", "Banana"]}
            countDownAnswer={30}
          />
        }
      />
      <Route path="/quizzes/:id" element={<QuizView />} />
      <Route path="/quizzes/:id/edit" element={<QuizEdit />} />
      <Route
        path="/:quiz_code/:participantId"
        element={<ParticipantManager />}
      />
      <Route path="/quizzes/:id/lobby" element={<QuizLobby />} />
    </Routes>
  );
}
