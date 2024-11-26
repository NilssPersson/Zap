import { FASlide } from "@/models/Quiz";
import { Preview } from "./Preview";
import { Button } from "@/components/ui/button";

export function HostAnswer({
  slide,
  onNextSlide,
}: {
  slide: FASlide;
  onNextSlide: () => void;
}) {
  return (
    <div className="flex flex-col">
      <Preview slide={slide} />
      <h1>Showing answer...</h1>
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
