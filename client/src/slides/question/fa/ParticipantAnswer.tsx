import { FASlide } from "@/models/Quiz";
import { Participant } from "@/models/Quiz";

export function ParticipantAnswer({
  slide,
  participant,
}: {
  slide: FASlide;
  participant: Participant;
}) {
  return (
    <div>
      <p>
        Rätt svar: {slide.answer}, du: {participant.name}
      </p>
    </div>
  );
}
