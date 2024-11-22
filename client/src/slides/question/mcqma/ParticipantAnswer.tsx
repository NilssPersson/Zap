import { MCQMASlide, Participant } from "@/models/Quiz";
import ParticipantCorrect from "../base/ParticipantCorrect";
import ParticipantIncorrect from "../base/ParticipantIncorrect";

export function ParticipantAnswer({
  slide,
  participant,
  slideNumber,
}: {
  slide: MCQMASlide;
  participant: Participant;
  slideNumber: number;
}) {
  const answer =
    participant.answers.find((a) => a.slideNumber === slideNumber)?.answer ||
    [];

  const correctAnswers = slide.options
    .filter((opt) => opt.isCorrect)
    .map((opt) => opt.text);

  const wasCorrect =
    answer.length === correctAnswers.length &&
    correctAnswers.every((ans) => answer.includes(ans));

  return wasCorrect ? <ParticipantCorrect /> : <ParticipantIncorrect />;
}
