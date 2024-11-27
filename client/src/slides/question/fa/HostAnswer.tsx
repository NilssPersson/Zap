import { Button } from "@/components/ui/button";
import { Preview } from "./Preview";
import { FASlide, Participant } from "@/models/Quiz";

export function HostAnswer({
  slide,
  participants,
  onNextSlide,
}: {
  slide: FASlide;
  participants: Participant[];
  onNextSlide: () => void;
}) {
  return (
    <div>
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
