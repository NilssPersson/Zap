import { Preview } from "./Preview";
import { InfoSlide } from "@/models/Quiz";
import NextSlide from "../_components/NextSlide";

export function HostAnswer({
  slide,
  onNextSlide,
  onPrevSlide,
}: {
  slide: InfoSlide;
  onNextSlide: () => void;
  onPrevSlide: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col">
      <Preview slide={slide} />
      <NextSlide onPrev={onPrevSlide} onNext={onNextSlide} />
    </div>
  );
}
