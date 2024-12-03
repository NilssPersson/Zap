import { ToolbarProps } from "@/slides/toolbar";
import TextInput from "@/slides/_toolbar/inputs/TextInput";
import ImageInput from "@/slides/_toolbar/inputs/ImageInput";
import BackgroundInput from "@/slides/_toolbar/inputs/BackgroundInput";
import { InfoIcon } from "lucide-react";
import EmbedVideoInput from "@/slides/_toolbar/inputs/EmbedVideoInput";
import { InfoSlide } from "@/models/Quiz";

export interface EmbedVideoInputProps extends ToolbarProps<InfoSlide> {
  slide: InfoSlide;
  onSlideUpdate: (slide: InfoSlide) => void;
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
        field="title"
        placeholder="Slide Title"
      />
      <TextInput
        slide={slide}
        onSlideUpdate={onSlideUpdate}
        label="Content"
        field="content"
        placeholder="Slide Content"
      />
      <ImageInput slide={slide} onSlideUpdate={onSlideUpdate} />
      <EmbedVideoInput slide={slide} onSlideUpdate={onSlideUpdate} />
      <BackgroundInput slide={slide} onSlideUpdate={onSlideUpdate} />
    </>
  );
}
