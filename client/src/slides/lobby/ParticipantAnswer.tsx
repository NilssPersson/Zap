import { LobbySlide } from "@/models/Quiz";
import { Participant } from "./Participant";

export function ParticipantAnswer({ slide }: { slide: LobbySlide }) {
  return <Participant slide={slide} />;
}
