import { MCQMASlide } from "@/models/Quiz";
import { Preview } from "./Preview";

export function HostAnswer({ slide }: { slide: MCQMASlide }) {
  return <Preview slide={slide} />;
}
