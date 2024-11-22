import { RankSlide } from "@/models/Quiz";
import { Participant } from "@/models/Quiz";
import ParticipantCorrect from "../base/ParticipantCorrect";
import ParticipantIncorrect from "../base/ParticipantIncorrect";

export function ParticipantAnswer({
  slide,
  participant,
  slideNumber,
}: {
  slide: RankSlide;
  participant: Participant;
  slideNumber: number;
}) {
  const answer =
    participant.answers.find((a) => a.slideNumber === slideNumber)?.answer ||
    [];

  // Check if the participant's ranking matches exactly with the slide's correct ranking
  const wasCorrect = JSON.stringify(answer) === JSON.stringify(slide.ranking);

  return wasCorrect ? <ParticipantCorrect /> : <ParticipantIncorrect />;
}
