import { MCQSASlide } from "@/models/Quiz";
import { Preview } from "./Preview";

export function Host({ slide }: { slide: MCQSASlide }) {
  return <Preview slide={slide} />;
}
