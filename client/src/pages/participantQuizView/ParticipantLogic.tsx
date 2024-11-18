import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { addAnswer, useGameStatus } from "@/services/client";
import TeamInfo from "./components/teamInfo";

export default function ParticipantLogic() {
  const [answer, setAnswer] = useState("");
  const { quizCode, participantId } = useParams();

  const { hasAnswered, currentSlide, score } = useGameStatus(
    quizCode as string,
    participantId as string,
  );

  console.log(hasAnswered, currentSlide, score);

  async function answerQuestion() {
    console.log(quizCode);
    if (!quizCode || !participantId || !answer) return;
    await addAnswer(quizCode, participantId, answer);
  }

  return (
    <div>
      <h1>Room Test</h1>
      <Input
        value={answer}
        placeholder="Message"
        className="text-black"
        onChange={(e) => setAnswer(e.target.value)}
      />
      <Button disabled={hasAnswered} onClick={answerQuestion}>
        Answer
      </Button>
      <TeamInfo name={"Test"} score={score} avatar="test" />
    </div>
  );
}
