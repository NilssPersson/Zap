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
import FastAnswer from "../pages/hostQuestions/FastAnswer";
import Profile from "@/pages/User/Profile";
import SlideRank from "@/components/quiz-editor/slide-content/SlideRank";

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
      <Route
        path="/fast-answer"
        element={
          <FastAnswer
            players={["jacob", "nisee", "knorr", "lisa"]}
            numberOfClicks={4}
            countDownAnswer={30}
            question="How old is Jacob?"
          />
        }
      />
      <Route path="/profile" element={<Profile />} />
      <Route
        path="sliderank"
        element={
          <SlideRank
            ranking={[
              { name: "Tyskland", score: 1 },
              { name: "Tyskland", score: 1 },
              { name: "Tyskland", score: 1 },
              { name: "Tyskland", score: 1 },
              { name: "Frankrike", score: 2 },
              { name: "Grekland", score: 4 },
              { name: "Holland", score: 5 },
              { name: "Sverige", score: 3 },
            ]}
            
          />
        }
      />
    </Routes>
  );
}
