import { ScoreSlide, Participant } from "@/models/Quiz";

import ScoreBoard from "@/pages/host/Scoreboard";


export function Host({slide, participants }: { slide: ScoreSlide , participants: Participant[]}) {
  return (
    <div>
     <ScoreBoard slide={slide} participants={participants} />
    </div>
  );
}
