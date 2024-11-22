import { MCQMASlide } from "@/models/Quiz";
import { Preview } from "./Preview";

export function Host({ slide }: { slide: MCQMASlide }) {
  return <Preview slide={slide} />;
}
