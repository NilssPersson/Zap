import { Button } from "@/components/ui/button";
import { Preview } from "./Preview";
import { RankSlide } from "@/models/Quiz";

export function HostAnswer({ slide, onNextSlide }: { slide: RankSlide; onNextSlide: () => void }) {
  return (
    <div>
      <Preview slide={slide} />
      <Button
        onClick={() => {
          onNextSlide();
        }}
        className="absolute bottom-5 right-5"
      >
        Next Slide
      </Button>
    </div>
  );
}
