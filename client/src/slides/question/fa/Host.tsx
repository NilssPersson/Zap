import { FASlide } from "@/models/Quiz";
import { Preview } from "./Preview";

export function Host({ slide }: { slide: FASlide }) {
  return <Preview slide={slide} />;
}
