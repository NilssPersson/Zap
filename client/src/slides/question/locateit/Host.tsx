import { LocateItSlide, Participant } from "@/models/Quiz";
import { Button } from "@/components/ui/button";

export function Host({
  slide,
  participants,
  onNextSlide,
}: {
  slide: LocateItSlide;
  participants: Participant[];
  onNextSlide: () => void;
}) {
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <Button onClick={onNextSlide}>Next</Button>
    </div>
  );
}
