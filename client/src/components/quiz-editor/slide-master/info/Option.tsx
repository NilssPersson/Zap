import { SlideTypes } from "@/models/Quiz";
import { SlideOption } from "../../SlideOption";
import { InfoIcon } from "lucide-react";
import { OptionProps } from "../";

export function Option({ handleAddSlide }: OptionProps) {
    return (
        <SlideOption
            label="Information Slide"
            icon={InfoIcon}
            onClick={() => {
                handleAddSlide(SlideTypes.info);
            }}
        />
    );
}
Option.displayName = "Info";