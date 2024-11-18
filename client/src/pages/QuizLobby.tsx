import { useEffect, useState } from "react";
import Participant from "@/models/Participant";
import "tw-elements"; // Import Tailwind Elements JS
import "tailwindcss/tailwind.css"; // Tailwind CSS
import Avatar, { genConfig } from "react-nice-avatar";
import { useOngoingQuiz } from "@/services/host";
import { Button } from "@/components/ui/button";
import QRCode from "react-qr-code";


interface LobbyProps {
  quizCode: string;
  participants: Record<string, Participant>;
}

//animations och key frames

export default function QuizLobby({ quizCode, participants }: LobbyProps) {
  const [participantList, setParticipantList] = useState<Participant[]>([]);
  const { incrementSlide } = useOngoingQuiz();

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
        <div className="flex flex-row items-center justify-between p-20 mb-20 mt-20">
      <h1 className="text-5xl font-display ">Join Lobby: {quizCode}</h1>
        <QRCode
          style={{ height: "auto", width: "20%", margin:"3" }}
          value={"https://game-shack-iota.vercel.app/play/" + { quizCode }}
          viewBox={`0 0 256 256`}
        />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {participantList.map((participant, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-4 rounded-lg animate-[zoom-in_1s_ease-in-out]"
          >
            <Avatar
              style={{ width: "4.5rem", height: "4.5rem" }}
              {...genConfig(participant.avatar ? participant.avatar : "")}
            />
            <span className="text-2xl font-display">{participant.name}</span>
          </div>
        ))}
      </div>
      <Button onClick={startGame} className="m-5">
        Start Game
      </Button>
    </div>
  );
}
