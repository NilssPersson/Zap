import { Participant } from "@/models/Quiz";
import Avatar, { genConfig } from "react-nice-avatar";

export default function ParticipantCard({ participant }: { participant: Participant }) {
  return (
    <div className="flex items-center gap-2 bg-black/30 p-2 rounded-lg cursor-move">
      <Avatar
        style={{ width: "2rem", height: "2rem" }}
        {...genConfig(participant.avatar)}
      />
      <span className="text-sm font-display">{participant.name}</span>
    </div>
  );
} 