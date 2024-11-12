import supabase from "@/api/client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useParams } from "react-router-dom";
import { useParticipant } from "@/hooks/useParticipant";
import { RealtimeChannel } from "@supabase/supabase-js";

export default function ParticipantManager() {
  const [answer, setAnswer] = useState("");
  const { quiz_code, participantId } = useParams();
  const { participant, getParticipant, updateParticipantAnswer } =
    useParticipant();
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!quiz_code || !participant || channel !== null) return;

    const newChannel = supabase.channel(quiz_code);
    setChannel(newChannel);

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
    channel?.send({
      type: "broadcast",
      event: "Answer",
      payload: { answer },
    });
    updateParticipantAnswer(participantId, answer);
    setAnswer("");
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
    </div>
  );
}
