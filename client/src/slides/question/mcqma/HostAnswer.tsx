import { MCQMASlide } from "@/models/Quiz";
import { Preview } from "./Preview";
import { Button } from "@/components/ui/button";

export function HostAnswer({
  slide,
  onNextSlide,
}: {
  slide: MCQMASlide;
  onNextSlide: ()=>void
}) {
  return (
    <div>
      <Preview slide={slide} />
      <Button
        onClick={() => {
          onNextSlide();
        }}
        className="m-5"
      >
        Next Slide
      </Button>{" "}
    </div>
  );
}
