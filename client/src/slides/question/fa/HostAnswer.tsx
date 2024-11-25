import { FASlide } from "@/models/Quiz";
import { Preview } from "./Preview";

export function HostAnswer({ slide }: { slide: FASlide }) {
  return <Preview slide={slide} />;
}
