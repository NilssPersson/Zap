import { ScoreSlide } from "@/models/Quiz";

export function ParticipantAnswer({ slide }: { slide: ScoreSlide }) {
  return <p>{slide.title}</p>;
}
