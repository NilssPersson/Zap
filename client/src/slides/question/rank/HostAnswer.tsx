import { Preview } from "./Preview";
import { RankSlide } from "@/models/Quiz";

export function HostAnswer({ slide }: { slide: RankSlide }) {
  return <Preview slide={slide} />;
}
