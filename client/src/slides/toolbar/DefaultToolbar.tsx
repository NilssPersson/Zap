import { ToolbarProps } from "..";
import BackgroundInput from "./BackgroundInput";
import ImageInput from "./ImageInput";
import TextInput from "./TextInput";

export default function DefaultToolbar({ slide, onSlideUpdate }: ToolbarProps) {
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
            <BackgroundInput slide={slide} onSlideUpdate={onSlideUpdate} />
        </>
    )
}