import { Preview } from "./Preview";
import { ScoreSlide } from "@/models/Quiz";

export function HostAnswer({ slide }: { slide: ScoreSlide }) {
  return <Preview slide={slide} />;
}
