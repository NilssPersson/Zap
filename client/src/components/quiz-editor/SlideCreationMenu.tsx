import { Separator } from "@/components/ui/separator";
import { PopoverContent } from "@/components/ui/popover";
import type { SlideType, QuestionType } from "@/models/Quiz";
import { Info, Score, MCQSA, MCQMA, FA, Rank, OptionProps } from "./slide-master";

interface SlideCreationMenuProps {
  onAddSlide: (type: SlideType, questionType?: QuestionType) => void;
}

type Option = React.ComponentType<OptionProps>;

// Add new interface for option groups
interface OptionGroup {
  label: string;
  options: Option[];
}

// Replace existing slides and questions arrays with optionGroups
const optionGroups: OptionGroup[] = [
  {
    label: "Slides",
    options: [Info.Option, Score.Option]
  },
  {
    label: "Question Types",
    options: [MCQSA.Option, MCQMA.Option, FA.Option, Rank.Option]
  }
] as const;

interface RenderOptionsProps {
  options: Option[];
  onAddSlide: (type: SlideType, questionType?: QuestionType) => void;
}

function RenderOptions({ options, onAddSlide }: RenderOptionsProps) {
  return options.map((Option) => {
    return <Option key={Option.displayName} handleAddSlide={onAddSlide} />
  })
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
