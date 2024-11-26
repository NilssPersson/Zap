import { Button } from "@/components/ui/button";
import { ScoreSlide, Participant } from "@/models/Quiz";

import ScoreBoard from "@/slides/_components/Scoreboard";

export function Host({
  slide,
  participants,
  onNextSlide,
}: {
  slide: ScoreSlide;
  participants: Participant[];
  onNextSlide: () => void;
}) {
  return (
    <div>
      <ScoreBoard slide={slide} participants={participants} />
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
