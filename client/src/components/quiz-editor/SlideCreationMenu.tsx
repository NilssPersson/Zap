import { Separator } from "@/components/ui/separator";
import { PopoverContent } from "@/components/ui/popover";
import type { SlideType, QuestionType } from "@/models/Quiz";
import { Info, Score, MCQSA, MCQMA, FA, Rank } from "./slide-master";

interface SlideCreationMenuProps {
  onAddSlide: (type: SlideType, questionType?: QuestionType) => void;
}

export function SlideCreationMenu({ onAddSlide }: SlideCreationMenuProps) {
  return (
    <PopoverContent className="w-56">
      <div className="space-y-2">
        <h4 className="font-medium leading-none mb-3">Add Slide</h4>
        <Info.Option handleAddSlide={onAddSlide} />
        <Score.Option handleAddSlide={onAddSlide} />

        <Separator className="my-2" />

        <h4 className="font-medium leading-none mb-2">Question Types</h4>
        <MCQSA.Option handleAddSlide={onAddSlide} />
        <MCQMA.Option handleAddSlide={onAddSlide} />
        <FA.Option handleAddSlide={onAddSlide} />
        <Rank.Option handleAddSlide={onAddSlide} />
      </div>
    </PopoverContent>
  );
}
