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

    const handleAddSlide = (type: SlideType, questionType?: QuestionType) => {
        onAddSlide(type, questionType);
    };

    return (
        <PopoverContent className="w-56">
            <div className="space-y-2">
                <h4 className="font-medium leading-none mb-3">Add Slide</h4>
                <SlideOption 
                    label="Information Slide"
                    icon={InfoIcon}
                    onClick={() => handleAddSlide("info")}
                />
                <SlideOption 
                    label="Score Slide"
                    icon={BarChart3Icon}
                    onClick={() => handleAddSlide("score")}
                />
                <Separator className="my-2" />
                <h4 className="font-medium leading-none mb-2">Question Types</h4>
                <SlideOption 
                    label="Single Answer MCQ"
                    icon={CircleDotIcon}
                    onClick={() => handleAddSlide("question", "MCQSA")}
                />
                <SlideOption 
                    label="Multiple Answer MCQ"
                    icon={CheckSquareIcon}
                    onClick={() => handleAddSlide("question", "MCQMA")}
                />
                <SlideOption 
                    label="Free Answer"
                    icon={TypeIcon}
                    onClick={() => handleAddSlide("question", "FA")}
                />
            </div>
        </PopoverContent>
    );
} 