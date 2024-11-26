import { Confetti } from "@/components/particles/Confetti";
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
      <Confetti />
      <ScoreBoard slide={slide} participants={participants} />
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
