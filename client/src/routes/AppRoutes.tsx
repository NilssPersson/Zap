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
import ScoreBoard from "@/pages/host/Scoreboard";
import { Participant } from "@/models/Quiz";

export function AppRoutes() {
  const { isAuthenticated } = useKindeAuth();


  const mockParticipants: { [id: string]: Participant } = {
    p1: {
      answers: [
        { slideNumber: 1, answer: ["A"], time: "2024-11-22T10:00:00Z" },
        { slideNumber: 2, answer: ["B"], time: "2024-11-22T10:02:00Z" },
      ],
      hasAnswered: true,
      avatar: "nils",
      name: "Alice",
      participantId: "p1",
      score: [10, 20, 15], // Total score: 45
    },
    p2: {
      answers: [
        { slideNumber: 1, answer: ["C"], time: "2024-11-22T10:01:00Z" },
        { slideNumber: 2, answer: ["D"], time: "2024-11-22T10:03:00Z" },
      ],
      hasAnswered: true,
      avatar: "jacob",
      name: "Bob",
      participantId: "p2",
      score: [5, 10, 5], // Total score: 20
    },
    p3: {
      answers: [
        { slideNumber: 1, answer: ["E"], time: "2024-11-22T10:04:00Z" },
      ],
      hasAnswered: false,
      avatar: "knorr",
      name: "Charlie",
      participantId: "p3",
      score: [0, 0, 0], // Total score: 0
    },
    p4: {
      answers: [
        { slideNumber: 1, answer: ["F"], time: "2024-11-22T10:05:00Z" },
      ],
      hasAnswered: true,
      avatar: "lol  ",
      name: "harahsikini",
      participantId: "p4",
      score: [25, 30, 20], // Total score: 75
    },
    p5: {
      answers: [
        { slideNumber: 1, answer: ["G"], time: "2024-11-22T10:06:00Z" },
      ],
      hasAnswered: true,
      avatar: "hej",
      name: "Eve",
      participantId: "p5",
      score: [15, 20, 10], // Total score: 45
    },
  };

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
      <Route path="scoreboard" element= {<ScoreBoard scoreboard={mockParticipants}/>} />
    </Routes>
  );
}
