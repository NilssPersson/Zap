import { ToolbarProps } from "../config";
import TextInput from "./TextInput";
import { Slide } from "@/models/Quiz";

export default function ContentInput<T extends Slide>({ slide, onSlideUpdate }: ToolbarProps<T>) {
    return (
        <TextInput 
            slide={slide} 
            onSlideUpdate={onSlideUpdate} 
            label="Content"
            field="content"
            placeholder="Enter content..."
            textArea
        />
    )
}