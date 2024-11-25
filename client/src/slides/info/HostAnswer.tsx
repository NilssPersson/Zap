import { Preview } from "./Preview";
import { InfoSlide } from "@/models/Quiz";

export function HostAnswer({ slide }: { slide: InfoSlide }) {
  return <Preview slide={slide} />;
}
