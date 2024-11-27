import { Button } from "@/components/ui/button";
import { Preview } from "./Preview";
import { InfoSlide } from "@/models/Quiz";

export function HostAnswer({
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
        className="absolute bottom-5 right-5"
      >
        Next Slide
      </Button>
    </div>
  );
}
