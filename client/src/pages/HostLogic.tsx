import React, { useEffect, useState } from "react";
import { useParams /* useNavigate */ } from "react-router-dom";
import { useOngoingQuiz } from "@/services/host";
import QuizLobby from "./QuizLobby";
const HostLogic: React.FC = () => {
  const { id } = useParams();
  const [ongoingQuiz, setOngoingQuiz] = useState<any | null>();
  const { quizCode, participants, incrementSlide, getOngoingQuiz } = useOngoingQuiz();

  useEffect(() => {
    const setupLobby = async () => {
      try {
        const currentQuiz = await getOngoingQuiz(id || "");
        
        // Add initial participants from database
        if (currentQuiz) {
          setOngoingQuiz(currentQuiz);
          console.log("ongoingQuiz set: ", ongoingQuiz);
        }
      } catch (error) {
        console.error("Error setting up lobby:", error);
      }
    };

    setupLobby();
  }, [id]);

  const startGame = async () => {
    const startedQuiz = await incrementSlide(quizCode);
    setOngoingQuiz(startedQuiz);
  };

  if (ongoingQuiz?.currentSlide === 0) {
    console.log([participants]);
    // Render QuizLobby when currentSlide is 0
    return (
      <QuizLobby quizCode={quizCode} participants={participants} />
    );
  }

  return (
    <div className="lobby-container">
      <h1></h1>
      <h1>Lobby for Quiz {id}</h1>
      <h1>Current slide {ongoingQuiz?.currentSlide}</h1>
      <h2>Participants:</h2>
      <ul>
        {ongoingQuiz?.participants &&
          Object.entries(participants).map(([id, participant]) => (
            <li key={id}>{participant.name}</li>
          ))}
      </ul>
      <button onClick={startGame}>Start Game</button>
    </div>
  );
};

export default HostLogic;
