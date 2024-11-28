import { Participant } from "@/models/Quiz";
import Avatar, { genConfig } from "react-nice-avatar";

export default function Participants({ participants }: { participants: Participant[] }) {
  return Object.values(participants).map((participant, index) => (
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
  ));
}
