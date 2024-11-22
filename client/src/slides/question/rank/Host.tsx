import { RankSlide } from "@/models/Quiz";
import { Preview } from "./Preview";

export function Host({ slide }: { slide: RankSlide }) {
  return <Preview slide={slide} />;
}
