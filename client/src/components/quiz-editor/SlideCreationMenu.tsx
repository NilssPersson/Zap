import { Separator } from "@/components/ui/separator";
import { PopoverContent } from "@/components/ui/popover";
import { 
    InfoIcon, 
    BarChart3Icon, 
    CircleDotIcon, 
    CheckSquareIcon, 
    TypeIcon 
} from "lucide-react";
import type { SlideType, QuestionType } from "@/types/quiz";
import { SlideOption } from "./SlideOption";

interface SlideCreationMenuProps {
    onAddSlide: (type: SlideType, questionType?: QuestionType) => void;
}

export function SlideCreationMenu({ onAddSlide }: SlideCreationMenuProps) {
    return (
        <PopoverContent className="w-56">
            <div className="space-y-2">
                <h4 className="font-medium leading-none mb-3">Add Slide</h4>
                <SlideOption 
                    label="Information Slide"
                    icon={InfoIcon}
                    onClick={() => onAddSlide("info")}
                />
                <SlideOption 
                    label="Score Slide"
                    icon={BarChart3Icon}
                    onClick={() => onAddSlide("score")}
                />
                <Separator className="my-2" />
                <h4 className="font-medium leading-none mb-2">Question Types</h4>
                <SlideOption 
                    label="Single Answer MCQ"
                    icon={CircleDotIcon}
                    onClick={() => onAddSlide("question", "MCQSA")}
                />
                <SlideOption 
                    label="Multiple Answer MCQ"
                    icon={CheckSquareIcon}
                    onClick={() => onAddSlide("question", "MCQMA")}
                />
                <SlideOption 
                    label="Free Answer"
                    icon={TypeIcon}
                    onClick={() => onAddSlide("question", "FA")}
                />
            </div>
        </PopoverContent>
    );
} 