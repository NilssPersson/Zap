import { QuestionTypes, SlideTypes } from "@/models/Quiz";
import { SlideOption } from "../../../SlideOption";
import { CircleDotIcon } from "lucide-react";
import { OptionProps } from "../../";

export function Option({ handleAddSlide }: OptionProps) {
    return (
        <SlideOption
            label="Single Answer MCQ"
            icon={CircleDotIcon}
            onClick={() => {
                handleAddSlide(SlideTypes.question, QuestionTypes.MCQSA);
            }}
        />
    );
}
Option.displayName = "MCQSA"; 