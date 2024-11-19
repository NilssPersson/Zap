import { FASlide, QuestionTypes, SlideTypes } from "@/models/Quiz";
import { SlideOption } from "../SlideOption";
import { TypeIcon } from "lucide-react";
import { BaseQuestionRender, BaseQuestionToolbar } from "./master-question";
import { OptionProps, ToolbarProps } from ".";

// OPTION: Renders the button to add a Free Answer slide
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

// RENDER: Renders the FA slide
export function Render({ slide }: { slide: FASlide }) {
    return <BaseQuestionRender slide={slide} />;
}

// TOOLBAR: Renders the FA slide toolbar
export function Toolbar(props: ToolbarProps) {
    return <BaseQuestionToolbar {...props} />;
}

export const Info = {
    value: "question:FA",
    icon: TypeIcon,
    label: "Free Answer Question",
} as const;
