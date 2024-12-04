import { Confetti } from "@/components/particles/Confetti";
import { Button } from "@/components/ui/button";
import { Participant, Slide } from "@/models/Quiz";

import ScoreBoard from "@/slides/_components/Scoreboard";

export function Host({
  participants,
  slides,
  currentSlide,
  onNextSlide,
}: {
  participants: Participant[];
  slides: Slide[];
  currentSlide: number;
  onNextSlide: () => void;
}) {
  return (
    <div>
      <Confetti />
      <ScoreBoard
        currentSlide={currentSlide}
        slides={slides}
        participants={participants}
      />
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
