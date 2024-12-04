import { ToolbarProps } from "@/slides/toolbar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FTASlide } from "@/models/Quiz";

export function AnswerText({ slide, onSlideUpdate }: ToolbarProps<FTASlide>) {
  // Ensure the slide is of type FTASlide

  return (
    <div className="space-y-2">
      <Label>Correct Answer</Label>
      <Input
        value={slide.correctAnswer}
        onChange={(e) => {
          const updatedSlide = {
            ...slide,
            correctAnswer: e.target.value, // Update the correctAnswer
          };
          onSlideUpdate(updatedSlide); // Trigger the slide update
        }}
        placeholder="Enter the correct answer..."
      />
    </div>
  );
}
