import { ScoreSlide, Participant, Slide } from "@/models/Quiz";

import ScoreBoard from "@/pages/host/Scoreboard";


export function Host({slide, participants, slides, currentSlide }: { slide: ScoreSlide , participants: Participant[], slides: Slide[], currentSlide: number}) {
  return (
    <div>
     <ScoreBoard currentSlide={currentSlide} slides={slides} slide={slide} participants={participants} />
    </div>
  );
}
