import { MCQSASlide } from "@/models/Quiz";
import { Participant } from "@/models/Quiz";

export function ParticipantAnswer({
  slide,
  participant,
}: {
  slide: MCQSASlide;
  participant: Participant;
}) {
  return (
    <div>
      <p>
        Rätt svar: {slide.title}, du: {participant.name}
      </p>
    </div>
  );
}
