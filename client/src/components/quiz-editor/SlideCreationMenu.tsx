import { Separator } from "@/components/ui/separator";
import { PopoverContent } from "@/components/ui/popover";
import { type SlideType, type QuestionType, SlideTypes } from "@/models/Quiz";
import * as Slides from "./slide-master";
import { SlideOption } from "./SlideOption";
import { SlideInfo } from "./slide-master";

interface SlideCreationMenuProps {
  onAddSlide: (type: SlideType, questionType?: QuestionType) => void;
}

// Replace existing slides and questions arrays with optionGroups
const optionGroups = [
  {
    label: "Slides",
    options: Object.values(Slides)
      .filter((slide) => slide.Info.slideType !== SlideTypes.question)
      .map((slide) => slide.Info)
  },
  {
    label: "Question Types",
    options: Object.values(Slides)
      .filter((slide) => slide.Info.slideType === SlideTypes.question)
      .map((slide) => slide.Info)
  }
] as const;

interface RenderOptionsProps {
  options: SlideInfo[];
  onAddSlide: (type: SlideType, questionType?: QuestionType) => void;
}

function RenderOptions({ options, onAddSlide }: RenderOptionsProps) {
  return options.map((option) => {
    return (
      <SlideOption
        key={option.value}
        label={option.label}
        icon={option.icon}
        onClick={() => onAddSlide(option.slideType, option.questionType)}
      />
    );
  });
}

export function SlideCreationMenu({ onAddSlide }: SlideCreationMenuProps) {
  return (
    <PopoverContent className="w-56">
      <div className="space-y-2">
        {optionGroups.map((group, index) => (
          <div key={group.label} className="flex flex-col gap-2">
            {index > 0 && <Separator className="my-2" />}
            <h4 className="font-medium leading-none mb-3">{group.label}</h4>
            <RenderOptions options={group.options} onAddSlide={onAddSlide} />
          </div>
        ))}
      </div>
    </PopoverContent>
  );
}
