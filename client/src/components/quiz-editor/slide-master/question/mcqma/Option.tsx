import { QuestionTypes, SlideTypes } from "@/models/Quiz";
import { SlideOption } from "../../../SlideOption";
import { CheckSquareIcon } from "lucide-react";
import { OptionProps } from "../../";

export function Option({ handleAddSlide }: OptionProps) {
    return (
        <SlideOption
            label="Multiple Answer MCQ"
            icon={CheckSquareIcon}
            onClick={() => {
                handleAddSlide(SlideTypes.question, QuestionTypes.MCQMA);
            }}
        />
    );
}
Option.displayName = "MCQMA"; 