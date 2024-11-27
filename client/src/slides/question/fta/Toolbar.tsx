import { FTASlide } from "@/models/Quiz";
import { ToolbarProps } from "../../";
import { BaseQuestionToolbar } from "../base/QuestionToolbar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type FASlideToolbarProps = ToolbarProps & {
  slide: FTASlide;
  onSlideUpdate: (slide: FTASlide) => void;
};

export function Toolbar({ slide, onSlideUpdate }: FASlideToolbarProps) {
  const updateCorrectAnswer = (value: string) => {
    const updatedSlide = {
      ...slide,
      correctAnswer: value,
    };
    onSlideUpdate(updatedSlide);
  };

  return (
    <BaseQuestionToolbar slide={slide} onSlideUpdate={onSlideUpdate}>
      <div className="space-y-2">
        <Label>Correct Answer</Label>
        <Input
          value={slide.correctAnswer || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateCorrectAnswer(e.target.value)
          }
          placeholder="Enter the correct answer..."
        />
      </div>
    </BaseQuestionToolbar>
  );
}
