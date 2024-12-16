import { Participant } from "@/models/Quiz";
import Avatar, { genConfig } from "react-nice-avatar";

export default function Participants({ participants }: { participants: Participant[] }) {
  return Object.values(participants).map((participant, index) => (
    <div
      key={index}
      className="flex flex-col items-center justify-center p-4 rounded-lg animate-[zoom-in_1s_ease-in-out] min-w-36 w-36 max-w-36"
    >
      <Avatar
        style={{ width: "4.5rem", height: "4.5rem" }}
        {...genConfig(participant.avatar ? participant.avatar : "")}
      />
      <span className="text-2xl font-display truncate mt-2 bg-white text-black px-3 py-1 rounded max-w-32">{participant.name}</span>
    </div>
  ));
}
