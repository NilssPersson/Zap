import { ScoreSlide } from "@/models/Quiz";
import { Preview } from "./Preview";

export function Host({ slide }: { slide: ScoreSlide }) {
  return <Preview slide={slide} />;
}
