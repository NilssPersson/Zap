import { Button } from "@/components/ui/button";
import { Preview } from "./Preview";
import { MCQSASlide } from "@/models/Quiz";

export function HostAnswer({ slide, onNextSlide }: { slide: MCQSASlide; onNextSlide: () => void }) {
  return (
    <div>
      <Preview slide={slide} />
      <Button
        onClick={() => {
          onNextSlide();
        }}
        className="m-5"
      >
        Next Slide
      </Button>
    </div>
  );
}
