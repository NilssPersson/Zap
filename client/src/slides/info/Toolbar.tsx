import { ToolbarProps } from "../";
import TextInput from "../_toolbar/TextInput";
import ImageInput from "../_toolbar/ImageInput";
import BackgroundInput from "../_toolbar/BackgroundInput";
import { InfoIcon } from "lucide-react";
import EmbedVideoInput from "./EmbedVideoInput";
import { InfoSlide } from "@/models/Quiz";

export interface EmbedVideoInputProps extends ToolbarProps {
  slide: InfoSlide;
}

export const Info = {
    value: "info",
    icon: InfoIcon,
    label: "Information Slide",
} as const;

export function Toolbar({ slide, onSlideUpdate }: EmbedVideoInputProps) {
    return (
        <>
            <TextInput
                slide={slide}
                onSlideUpdate={onSlideUpdate}
                label="Title"
                slideKey="title"
                placeholder="Slide Title"
            />
            <TextInput
                slide={slide}
                onSlideUpdate={onSlideUpdate}
                label="Content"
                slideKey="content"
                placeholder="Slide Content"
            />
            <ImageInput slide={slide} onSlideUpdate={onSlideUpdate} />
            <EmbedVideoInput slide={slide} onSlideUpdate={onSlideUpdate} />
            <BackgroundInput slide={slide} onSlideUpdate={onSlideUpdate} />
        </>
        
    )
}