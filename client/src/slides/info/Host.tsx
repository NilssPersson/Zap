import { InfoSlide } from "@/models/Quiz";
import { Preview } from "./Preview";

export function Host({ slide }: { slide: InfoSlide }) {
  return <Preview slide={slide} />;
}
