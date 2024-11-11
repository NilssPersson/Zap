import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "@/api/client";

// Types
type Player = {
  id: string;
  name: string;
};

// Broadcast Payload
interface BroadcastPayload {
  event: string;
  payload: {
    message: string;
  };
  type: string;
}

const Lobby: React.FC = () => {
  const { id } = useParams();
  const [ongoing_quiz_id, setOngoingQuizId] = useState<string | null>(null);
  const [quiz_code, setQuizCode] = useState<string | null>(null); // Store quiz_code
  const [players, setPlayers] = useState<Player[]>([]); // Track connected players
  const navigate = useNavigate();

  useEffect(() => {
    const setupLobby = async () => {
      const channelA = supabase.channel("room-1");

      // Fetch the quiz code
      try {
        const { data: quizCodeData, error: quizCodeError } = await supabase
          .from("QuizOngoing")
          .select("quiz_code")
          .eq("created_quiz_id", id)
          .single();

        if (quizCodeError) {
          console.log("Quiz id:",{ id });
          console.error("fetch quizcode error:");
          throw quizCodeError;
        } 
        if (quizCodeData) {
          setQuizCode(quizCodeData.quiz_code);
        }

      // Fetch ongoing quiz id
        const { data: quizData, error: quizError } = await supabase
          .from("QuizOngoing")
          .select("id")
          .eq("created_quiz_id", id)
          .single();

        if (quizError){
          console.error("fetch ongoing quiz id error:");
          throw quizError; 
        } 
        if (quizData) {
          setOngoingQuizId(quizData.id);

          const { data: initialPlayers, error: fetchError } = await supabase
            .from("QuizParticipants")
            .select("*")
            .eq("ongoing_quiz_id", quizData.id);

          if (fetchError) {
            console.error("Error fetching participants:", fetchError);
            throw fetchError;
          }

          if (initialPlayers) {
            setPlayers(initialPlayers);
          }

        }

        // function messageReceived(payload: BroadcastPayload) {
        //   if (payload.payload?.message) {
        //     console.log("Received message:", payload.payload.message);
        //   } else {
        //     console.log("Unexpected payload structure:", payload);
        //   }
        // }

        // channelA
        //   .on("broadcast", { event: "test" }, (payload: BroadcastPayload) => {
        //     messageReceived(payload);
        //   })
        //   .subscribe();
      } catch (error) {
        console.error("Error setting up lobby:", error);
      }
    };

    setupLobby();
  }, [id]);

  const startGame = () => {
    // Logic to start the game
    navigate(`/quizzes/${id}/play`);
  };

  return (
    <div className="lobby-container">
      <h1>Lobby for Quiz {quiz_code}</h1>
{/* 
      <h2>Connected Players</h2>
      <ul>
        {players.map((player) => (
          <li key={player.id}>{player.name}</li>
        ))}
      </ul>
      <button onClick={startGame} disabled={players.length === 0}>
        Start Game
      </button> */}
    </div>
  );
};

export default Lobby;