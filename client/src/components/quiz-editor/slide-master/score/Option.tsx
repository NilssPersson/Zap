import { SlideTypes } from "@/models/Quiz";
import { SlideOption } from "../../SlideOption";
import { BarChart3Icon } from "lucide-react";
import { OptionProps } from "../";

export function Option({ handleAddSlide }: OptionProps) {
    return (
        <SlideOption
            label="Score Slide"
            icon={BarChart3Icon}
            onClick={() => {
                handleAddSlide(SlideTypes.score);
            }}
        />
    );
}
Option.displayName = "Score";