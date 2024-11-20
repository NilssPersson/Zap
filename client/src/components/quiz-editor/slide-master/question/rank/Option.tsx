import { QuestionTypes, SlideTypes } from "@/models/Quiz";
import { SlideOption } from "../../../SlideOption";
import { ListOrdered } from "lucide-react";
import { OptionProps } from "../../";

export function Option({ handleAddSlide }: OptionProps) {
    return (
        <SlideOption
            label="Rank Answers"
            icon={ListOrdered}
            onClick={() => {
                handleAddSlide(SlideTypes.question, QuestionTypes.RANK);
            }}
        />
    );
}
Option.displayName = "RANK"; 