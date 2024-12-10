import { Button } from "@/components/ui/button";
import { Preview } from "./Preview";
import { Participant, MatchingSlide } from "@/models/Quiz";
import NextSlide from "@/slides/_components/NextSlide";

export function HostAnswer({
  slide,
  participants,
  onNextSlide,
}: {
  slide: MatchingSlide;
  participants: Participant[];
  onNextSlide: () => void;
}) {
  return (
    <div>
      <Preview slide={slide} participants={participants} />
      <NextSlide onClick={onNextSlide} />
    </div>
  );
} 