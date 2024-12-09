import { Participant } from "@/models/Quiz";
import { Users } from "lucide-react";

export function ParticipantAnswers({
  participants = [],
}: {
  participants: Participant[];
}) {
  const noParticipants = participants.length;
  const noAnswers = participants.filter((participant) => participant.hasAnswered).length;
  const noTempAnswers = participants.filter(
    (participant) => participant.tempAnswer
  ).length;
  return (
    <div className="absolute top-4 right-4 flex justify-center items-center w-44 h-24 rounded-2xl border bg-primary text-white">
      <div className="flex items-center space-x-4">
        <div className="text-center font-display">
          <h1 className="text-4xl">
            {noAnswers>noTempAnswers? noAnswers:noTempAnswers} / {noParticipants}
          </h1>
        </div>
        <Users size={48} />
      </div>
    </div>
  );
}
