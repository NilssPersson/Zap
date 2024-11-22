import { Participant } from "@/models/Quiz";

export function ParticipantAnswer({
  participant,
}: {
  participant: Participant;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-display text-center">{participant.name}</h1>
    </div>
  );
}
