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
import BombTimer from "@/slides/question/bomb/Preview";
import { Participant } from "@/models/Quiz";
export function AppRoutes() {
  const { isAuthenticated } = useKindeAuth();


  const mockParticipants: Participant[] = [
    {
      answers: [
        { slideNumber: 1, answer: ["Yes"], time: "2024-11-18T10:05:00Z" },
        { slideNumber: 2, answer: ["No"], time: "2024-11-18T10:10:00Z" },
      ],
      hasAnswered: true,
      avatar: "https://example.com/avatar1.png",
      name: "Alice Johnson",
      participantId: "P001",
      score: [8, 12],
    },
    {
      answers: [
        { slideNumber: 1, answer: ["Maybe"], time: "2024-11-18T10:06:00Z" },
        { slideNumber: 2, answer: ["Yes"], time: "2024-11-18T10:11:00Z" },
      ],
      hasAnswered: true,
      avatar: "https://example.com/avatar2.png",
      name: "Bob Smith",
      participantId: "P002",
      score: [10, 15],
    },
    {
      answers: [{ slideNumber: 1, answer: ["No"], time: "2024-11-18T10:07:00Z" }],
      hasAnswered: true,
      avatar: "https://example.com/avatar3.png",
      name: "Charlie Brown",
      participantId: "P003",
      score: [5],
    },
    {
      answers: [],
      hasAnswered: false,
      avatar: "https://example.com/avatar4.png",
      name: "Diana Prince",
      participantId: "P004",
      score: [],
    },
    {
      answers: [
        { slideNumber: 1, answer: ["Agree"], time: "2024-11-18T10:08:00Z" },
        { slideNumber: 3, answer: ["Disagree"], time: "2024-11-18T10:15:00Z" },
      ],
      hasAnswered: true,
      avatar: "https://example.com/avatar5.png",
      name: "Ethan Hunt",
      participantId: "P005",
      score: [9, 11],
    },
  ];
  

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
      <Route path="/bomb" element={<BombTimer participants={mockParticipants} initialTime={2} />} /> 
    </Routes>
  );
}
