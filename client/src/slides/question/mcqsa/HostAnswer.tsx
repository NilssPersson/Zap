import { Preview } from "./Preview";
import { MCQSASlide } from "@/models/Quiz";

export function HostAnswer({ slide }: { slide: MCQSASlide }) {
  return <Preview slide={slide} />;
}
