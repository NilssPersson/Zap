import { useEffect, useState } from "react";
import Participant from "@/models/Participant";

interface LobbyProps {
  quizCode: string;
  participants: Record<string, Participant>;
}

//animations och key frames

export default function QuizLobby({ quizCode, participants }: LobbyProps) {
  const [participantNames, setParticipantNames] = useState<string[]>([]);

  useEffect(() => {
    const newNames = Object.values(participants).map(
      (participant) => participant.name
    ); // Convert object to array
    setParticipantNames((prevNames) => {
      // Add only new participants to avoid duplicates
      const updatedNames = [...prevNames];
      newNames.forEach((name) => {
        if (!prevNames.includes(name)) {
          updatedNames.push(name);
        }
      });
      return updatedNames;
    });
  }, [participants]);

  return (
    <div className="lobby-container">
        <h1>Quiz Lobby: {quizCode}</h1>
      <h2>Participants:</h2>
      <ul>
        {participantNames.map((name, index) => (
          <li key={index} className="participant">
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}