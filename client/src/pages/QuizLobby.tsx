import { useEffect, useState } from "react";
import Participant from "@/models/Participant";
import "tw-elements"; // Import Tailwind Elements JS
import "tailwindcss/tailwind.css"; // Tailwind CSS
import Avatar, { genConfig } from "react-nice-avatar";
import { useOngoingQuiz } from "@/services/host";
import { Button } from "@/components/ui/button";

interface LobbyProps {
  quizCode: string;
  participants: Record<string, Participant>;
}

//animations och key frames

export default function QuizLobby({ quizCode, participants }: LobbyProps) {
  const [participantList, setParticipantList] = useState<Participant[]>([]);
    const {incrementSlide} =
      useOngoingQuiz();

  useEffect(() => {
    const newParticipants = Object.values(participants); // Convert object to array of participants
    setParticipantList((prevList) => {
      const updatedList = [...prevList];
      newParticipants.forEach((participant) => {
        if (!prevList.some((p) => p.name === participant.name)) {
          updatedList.push(participant);
        }
      });
      return updatedList;
    });
  }, [participants]);

  const startGame = async () => {
    await incrementSlide(quizCode);
  };

  return (
    <div className="lobby-container">
      <h1 className="text-5xl font-display p-10">Join Lobby: {quizCode}</h1>
      <div className="grid grid-cols-4 gap-4">
        {" "}
        {/* grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 */}
        {participantList.map((participant, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-4 rounded-lg animate-[zoom-in_1s_ease-in-out]"
          >
            <Avatar
              style={{ width: "2.5rem", height: "2.5rem" }}
              {...genConfig(participant.avatar ? participant.avatar : "")}
            />
            <span>{participant.name}</span>
          </div>
        ))}
      </div>
      <Button onClick={startGame} className="m-5">Start Game</Button>
    </div>
  );
}
