import React, { useEffect, useState } from "react";
import { useParams, /* useNavigate */ } from "react-router-dom";
import supabase from "@/api/client";
import { useOngoingQuiz } from "@/hooks/useOngoingQuizzes";
import Participant from "@/models/Participant";
import { useParticipant } from "@/hooks/useParticipant";
import { QuizParticipants } from "@/models/Participant";

// Broadcast Payload
interface BroadcastParticipantPayload {
  event: string; // PlayerLeft or PlayerJoined
  payload: {
    participant: Participant;
  };
  type: string;
}


const Lobby: React.FC = () => {
  const { id } = useParams();
  const [playingParticipants, setPlayingParticipants] = useState<Participant[]>([]); // Track connected players
  const {
    ongoingQuiz,
    quizParticipants,
    getOngoingQuiz,
    getParticipants,
  } = useOngoingQuiz();
  const { participant, getParticipant } = useParticipant();
  // const navigate = useNavigate();

  const channelA = supabase.channel(id?.toString() ?? "ABCDEF"); //TODO: error handling

  function messageReceived(payload: BroadcastParticipantPayload) {
    if (payload.payload?.participant) {
      setPlayingParticipants((prevParticipants) => [
        ...prevParticipants,
        ...(Array.isArray(payload.payload.participant)
          ? payload.payload.participant
          : [payload.payload.participant]),
      ]);
    } else {
      console.log("Unexpected payload structure:", payload);
    }
  }

  channelA
    .on("broadcast", { event: "test" }, (payload: BroadcastParticipantPayload) => {
      messageReceived(payload);
      console.log("received");
    })
    .subscribe();

const addInitialParticipants = (quizParticipant: QuizParticipants): void => {
  getParticipant(quizParticipant.participant_id);
  if(participant){
    setPlayingParticipants([
      ...playingParticipants,
      participant,
    ]);
  }
  
};

  useEffect(() => {
    const setupLobby = async () => {
      try {
        getOngoingQuiz(id || ""); // TODO: handle no ID

        // Add initial participants from database
        if (ongoingQuiz?.id) {
          getParticipants(ongoingQuiz.id);
          if (quizParticipants) {
            quizParticipants.map((quizParticipant) =>
              addInitialParticipants(quizParticipant)
            );
          }
        }
      } catch (error) {
        console.error("Error setting up lobby:", error);
      }
    };

    setupLobby();
  }, [id]);

  // const startGame = () => {
  //   // Logic to start the game
  //   navigate(`/quizzes/${id}/play`);
  // };

  return (
    <div className="lobby-container">
      <h1>Lobby for Quiz {id}</h1>
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
