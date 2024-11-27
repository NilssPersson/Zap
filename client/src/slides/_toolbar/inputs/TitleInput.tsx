import { ToolbarProps } from "../../toolbar";
import TextInput from "./TextInput";
import { Slide } from "@/models/Quiz";

export default function TitleInput<T extends Slide>({ slide, onSlideUpdate }: ToolbarProps<T>) {
    return (
        <TextInput 
            slide={slide} 
            onSlideUpdate={onSlideUpdate} 
            label="Title"
            field="title"
            placeholder="Enter title..."
        />
    )
}