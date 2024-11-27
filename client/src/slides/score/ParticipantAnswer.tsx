import { ScoreSlide } from "@/models/Quiz";
import { Participant } from "./Participant";

export function ParticipantAnswer({ slide }: { slide: ScoreSlide }) {
  return <Participant slide={slide as never} />;
}
