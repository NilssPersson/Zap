import { InfoSlide } from "@/models/Quiz";
import { Preview } from "./Preview";
import { Button } from "@/components/ui/button";

export function Host({
  slide,
  onNextSlide,
}: {
  slide: InfoSlide;
  onNextSlide: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col">
      <Preview slide={slide} />
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
