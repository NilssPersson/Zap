import React, { useEffect, useState } from "react";
import { useParams /* useNavigate */ } from "react-router-dom";
import supabase from "@/api/client";
import Participant from "@/models/Participant";
import { useOngoingQuiz } from "@/services/host";

const Lobby: React.FC = () => {
  const { id } = useParams();
  const [ongoingQuiz, setQuizOngoing] = useState<any | null>();
  const { quizCode, incrementSlide, getOngoingQuiz } = useOngoingQuiz();

  useEffect(() => {
    const setupLobby = async () => {
      try {
        const ongoingQuiz = await getOngoingQuiz(id || "");
        // Add initial participants from database
        if (ongoingQuiz) {
          setQuizOngoing(ongoingQuiz);
        }
      } catch (error) {
        console.error("Error setting up lobby:", error);
      }
    };

    setupLobby();
  }, [id]);

  const startGame = async () => {
    const startedQuiz = await incrementSlide(quizCode);
    setQuizOngoing(startedQuiz);

    // Logic to start the game
    // navigate(`/quizzes/${id}/play`);
  };

  return (
    <div className="lobby-container">
      <h1></h1>
      <h1>Lobby for Quiz {quizCode}</h1>
      {/* <h1>Current slide {ongoingQuiz.currentSlide}</h1>
      <button onClick={startGame}>Start Game</button> */}
    </div>
  );
};

{
  /* <h1>Lobby for Quiz {quizCode}</h1>
      <h1>On slide {ongoingQuiz.currentSlide}</h1>
      <h2>Connected Players</h2>
      {/* <ul>
        {ongoingQuiz.participants.map((player:any) => (
          <li key={player.id}>{player.name}</li>
        ))}
      </ul> */
}

export default Lobby;
