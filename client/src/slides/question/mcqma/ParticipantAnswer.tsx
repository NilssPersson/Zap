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

  // Extract all correct answers from the slide
  const correctAnswers = slide.options
    .filter((opt) => opt.isCorrect)
    .map((opt) => opt.text);

  // Check if the participant's answers are correct
  const wasCorrect =
    answer.length === correctAnswers.length && // Must have the exact number of correct answers
    correctAnswers.every((ans) => answer.includes(ans)); // All correct answers must be included

  return wasCorrect ? <ParticipantCorrect /> : <ParticipantIncorrect />;
}
