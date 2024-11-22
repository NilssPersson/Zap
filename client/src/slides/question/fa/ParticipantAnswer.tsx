import { FASlide } from "@/models/Quiz";
import { Participant } from "@/models/Quiz";

export function ParticipantAnswer({
  slide,
  participant,
  slideNumber,
}: {
  slide: FASlide;
  participant: Participant;
  slideNumber: number;
}) {
  const answer = participant.answers
    .find((a) => a.slideNumber === slideNumber)
    ?.answer?.join(", ");

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-display text-center">
        [{slide.questionType}] saknar rätt svar. Men du svarade: [{answer}]
      </h1>
    </div>
  );
}
