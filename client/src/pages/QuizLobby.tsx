import React, { useEffect, useState } from "react";
import { useParams /* useNavigate */ } from "react-router-dom";
import supabase from "@/api/client";
import { useOngoingQuiz } from "@/hooks/useOngoingQuizzes";
import Participant from "@/models/Participant";

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
  const [participants, setParticipants] = useState<Participant[]>([]); // Track connected players
  const { getOngoingQuiz, getParticipants } = useOngoingQuiz();
  // const navigate = useNavigate();

  const channelA = supabase.channel(id?.toString() ?? "ABCDEF"); //TODO: error handling

  function messageReceived(payload: BroadcastParticipantPayload) {
    if (payload.payload?.participant) {

      const newParticipants = [payload.payload.participant];

      setParticipants((prevParticipants) => {
        // Filter out any new participants that are already in prevParticipants
        const uniqueNewParticipants = newParticipants.filter(
          (newParticipant) =>
            !prevParticipants.some(
              (existingParticipant) =>
                existingParticipant.id === newParticipant.id
            )
        );

        // Return the previous participants plus only the unique new ones
        return [...prevParticipants, ...uniqueNewParticipants];
      });
    } else {
      console.log("Unexpected payload structure:", payload);
    }
  }

  channelA
    .on(
      "broadcast",
      { event: "PlayerJoined" },
      (payload: BroadcastParticipantPayload) => {
        messageReceived(payload);
        console.log("received");
      }
    )
    .subscribe();


  useEffect(() => {
    const setupLobby = async () => {
      try {
        const ongoingQuiz = await getOngoingQuiz(id || "");
        // Add initial participants from database
        if (ongoingQuiz?.id) {
          const initialParticipants = await getParticipants(ongoingQuiz.id);
          if (initialParticipants) {
            setParticipants(initialParticipants);
          }
        } // TODO: handle no ID
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

      <h2>Connected Players</h2>

      <ul>
        {participants.map((player) => (
          <li key={player.id}>{player.name}</li>
        ))}
      </ul>
      {/* <button onClick={startGame} disabled={players.length === 0}>
        Start Game
      </button> */}
    </div>
  );
};

export default Lobby;
