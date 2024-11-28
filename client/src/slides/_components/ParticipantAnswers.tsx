import { Participant } from "@/models/Quiz";
import { Users } from "lucide-react";

export function ParticipantAnswers({
  participants,
}: {
  participants: Participant[];
}) {
  const noParticipants = participants?.length ? participants?.length : 0;
  let noAnswers = 0;
  if (participants) {
    noAnswers = participants.filter(
      (participant) => participant.hasAnswered,
    ).length;
  }

  return (
    <div className="flex justify-center items-center w-44 h-24 rounded-2xl border bg-primary text-white">
      <div className="flex items-center space-x-4">
        <div className="text-center font-display">
          <h1 className="text-4xl">
            {noAnswers} / {noParticipants}
          </h1>
        </div>
        <Users size={48} />
      </div>
    </div>
  );
}
