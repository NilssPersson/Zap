import { FTASLide, Participant } from "@/models/Quiz";
import { Preview } from "./Preview";
import { Button } from "@/components/ui/button";

export function Host({
  slide,
  participants,
  onNextSlide,
}: {
  slide: FTASLide;
  participants: Participant[];
  onNextSlide: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col">
      <Preview slide={slide} participants={participants} />
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
