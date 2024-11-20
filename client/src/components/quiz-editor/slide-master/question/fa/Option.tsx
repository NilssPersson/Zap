import { QuestionTypes, SlideTypes } from "@/models/Quiz";
import { SlideOption } from "../../../SlideOption";
import { TypeIcon } from "lucide-react";
import { OptionProps } from "../../";

export function Option({ handleAddSlide }: OptionProps) {
    return (
        <SlideOption
            label="Free Answer Question"
            icon={TypeIcon}
            onClick={() => {
                handleAddSlide(SlideTypes.question, QuestionTypes.FA);
            }}
        />
    );
}
Option.displayName = "FA"; 