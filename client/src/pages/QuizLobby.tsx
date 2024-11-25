import { useEffect, useState, useRef } from "react";

import "tw-elements"; // Import Tailwind Elements JS
import "tailwindcss/tailwind.css"; // Tailwind CSS
import Avatar, { genConfig } from "react-nice-avatar";
import QRCode from "react-qr-code";
import { Participant } from "@/models/Quiz";
import { useAppContext } from "@/contexts/App/context";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface LobbyProps {
  quizCode: string;
  participants: Participant[];
  onStartGame: () => void;
}

//animations och key frames

export default function QuizLobby({
  quizCode,
  participants,
  onStartGame,
}: LobbyProps) {
  const [participantList, setParticipantList] = useState<Participant[]>([]);
  const participantsRef = useRef<HTMLDivElement>(null);

  const {
    quizzes: { optimisticUpdate },
    ongoingQuizzes: { optimisticDelete, resources: ongoingQuizzes },
  } = useAppContext();
  const navigate = useNavigate();
  const { id } = useParams();

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

  useEffect(() => {
    if (participantsRef.current) {
      // Ensure scrolling happens after the DOM is updated
      setTimeout(() => {
        participantsRef.current!.scrollTop =
          participantsRef.current!.scrollHeight;
      }, 0);
    }
  }, [participantList]);

  const handleEndQuiz = async () => {
    const onGoingQuiz = ongoingQuizzes.find((quiz) => quiz.id === id);
    if (!onGoingQuiz) return navigate("/");

    console.log(onGoingQuiz);

    await Promise.all([
      optimisticDelete(onGoingQuiz.id),
      optimisticUpdate(onGoingQuiz.quiz.id, { isHosted: false }),
    ]);

    console.log("Ending quiz, navigating to /");
    navigate("/");
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-10">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-5xl font-display ">Join Lobby: {quizCode}</h1>
        <QRCode
          style={{ height: "auto", width: "20%", margin: "3" }}
          value={"https://game-shack-iota.vercel.app/play/" + { quizCode }}
          viewBox={`0 0 256 256`}
        />
      </div>
      <div
        ref={participantsRef}
        className="grid grid-cols-4 gap-4 bg-black/50 backdrop-blur-md m-10 rounded-lg max-h-80 overflow-y-auto"
      >
        {participantList.map((participant, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-4 rounded-lg animate-[zoom-in_1s_ease-in-out] "
          >
            <Avatar
              style={{ width: "4.5rem", height: "4.5rem" }}
              {...genConfig(participant.avatar ? participant.avatar : "")}
            />
            <span className="text-2xl font-display">{participant.name}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-around">
        <Button onClick={handleEndQuiz}>End Quiz</Button>
        <Button onClick={onStartGame}>Start Game</Button>
      </div>
    </div>
  );
}
