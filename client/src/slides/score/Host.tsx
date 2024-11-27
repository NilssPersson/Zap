import { Confetti } from "@/components/particles/Confetti";
import { Button } from "@/components/ui/button";
import { ScoreSlide, Participant, Slide } from "@/models/Quiz";

import ScoreBoard from "@/slides/_components/Scoreboard";

export function Host({
  slide,
  participants, slides, currentSlide,
  onNextSlide,
}: {
  slide: ScoreSlide;
  participants: Participant[], slides: Slide[], currentSlide: number;
  onNextSlide: () => void;
}) {
  return (
    <div>
      <Confetti />
      <ScoreBoard currentSlide={currentSlide} slides={slides} slide={slide} participants={participants} />
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
