import { Button } from "@/components/ui/button";
import { Preview } from "./Preview";
import { ScoreSlide } from "@/models/Quiz";
import { Confetti } from "@/components/particles/Confetti";

export function HostAnswer({
  slide,
  onNextSlide,
}: {
  slide: ScoreSlide;
  onNextSlide: () => void;
}) {
  return (
    <div>
      <Confetti />
      <Preview slide={slide} />
      <Button
        onClick={() => {
          onNextSlide();
        }}
        className="absolute right-5 bottom-5"
      >
        Next Slide
      </Button>
    </div>
  );
}
