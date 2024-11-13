import supabase from "@/api/client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useParams } from "react-router-dom";
import { useParticipant } from "@/hooks/useParticipant";
import { RealtimeChannel } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { useOngoingQuiz } from "@/hooks/useOngoingQuizzes";

export default function ParticipantManager() {
  const [answer, setAnswer] = useState("");
  const { quiz_code, participantId } = useParams();
  const { participant, getParticipant, updateParticipantAnswer } =
    useParticipant();
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const { ongoingQuiz, getOngoingQuiz, getCurrentSlide } = useOngoingQuiz();
  //const [currentSlide, setCurrentSlide] = useState<any>(null);

  useEffect(() => {
    if (quiz_code && !ongoingQuiz) {
      getOngoingQuiz(quiz_code);
      //const slide = getCurrentSlide(quiz_code);
      //setCurrentSlide(slide);
    }
  }, [quiz_code, ongoingQuiz, getOngoingQuiz, getCurrentSlide]);

  useEffect(() => {
    if (!quiz_code || !participant || channel !== null) return;

    const newChannel = supabase.channel(quiz_code);
    setChannel(newChannel);

    console.log("Participant", participant);
    console.log(newChannel);
    newChannel.send({
      type: "broadcast",
      event: "PlayerJoined",
      payload: { participant },
    });
  }, [quiz_code, participant, channel]);

  useEffect(() => {
    if (participantId) {
      getParticipant(participantId);
    }
  }, [participantId, getParticipant]);

  // Answer the question
  function answerQuestion() {
    if (participantId === undefined) return;
    console.log("????");
    channel?.send({
      type: "broadcast",
      event: "Answer",
      payload: { participantId, answer },
    });
    updateParticipantAnswer(participantId, answer);
    setAnswer("");
  }

  // Answer the question
  function leaveGame() {
    if (participantId === undefined) return;
    channel?.send({
      type: "broadcast",
      event: "PlayerLeft",
      payload: { participant },
    });
    //navigate("/home");
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
      <button onClick={answerQuestion}>Answer</button>
      <Button onClick={leaveGame}>Leave Game</Button>
    </div>
  );
}
