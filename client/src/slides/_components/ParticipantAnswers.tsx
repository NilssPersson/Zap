import { Participant } from "@/models/Quiz";

export function ParticipantAnswers({
  participants,
}: {
  participants: Participant[];
}) {
  const noParticipants = participants?.length ? participants?.length : 0;
  var noAnswers = 0;
  if (participants) {
    noAnswers = participants.filter(
      (participant) => participant.hasAnswered
    ).length;
  }

  return (
    <div className="flex justify-center items-center w-44 h-44 rounded-full border bg-primary text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Svar</h1>
        <p className="text-2xl">
          {noAnswers} / {noParticipants}
        </p>
      </div>
    </div>
  );
}
