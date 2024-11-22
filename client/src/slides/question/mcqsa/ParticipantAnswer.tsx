import { MCQSASlide, Participant } from "@/models/Quiz";
import ParticipantCorrect from "../base/ParticipantCorrect";
import ParticipantIncorrect from "../base/ParticipantIncorrect";

export function ParticipantAnswer({
  slide,
  participant,
  slideNumber,
}: {
  slide: MCQSASlide;
  participant: Participant;
  slideNumber: number;
}) {
  const answer = participant.answers
    .find((a) => a.slideNumber === slideNumber)
    ?.answer?.join(", ");
  const wasCorrect = slide.options.some(
    (opt) => opt.isCorrect && opt.text === answer,
  );

  return wasCorrect ? <ParticipantCorrect /> : <ParticipantIncorrect />;
}
