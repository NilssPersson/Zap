import supabase from "@/api/client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useParams } from "react-router-dom";
import { useParticipant } from "@/hooks/useParticipant";
import { useEffect } from "react";

//import Participant from "@/models/Participant";

// Broadcast Payload
/*interface BroadcastParticipantPayload {
  event: string; // Player joined or left event
  payload: {
    participant: Participant;
  };
  type: string;
}*/

export default function ParticipantManager() {
  const [message, setMessage] = useState("test");
  const { quiz_code, participantId } = useParams();
  const channelA = supabase.channel(quiz_code?.toString() ?? "ABCDEF");
  const { participant, getParticipant } = useParticipant();

  console.log(participant);

  useEffect(() => {
    if (participantId) {
      getParticipant(participantId);
    }
  }, [participantId, getParticipant]);

  function join() {
    channelA.send({
      type: "broadcast",
      event: "test",
      payload: { participant: participant },
    });
  }

  function leave() {
    channelA.send({
      type: "broadcast",
      event: "PlayerLeft",
      payload: { participant: participant },
    });
  }

  return (
    <div>
      <h1>Room Test</h1>
      <Input
        value={message}
        placeholder="Message"
        className="text-black"
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={join}>JOIN</button>
      <button onClick={leave}>LEAVE</button>
    </div>
  );
}
