import { ToolbarProps } from "../";
import DefaultToolbar from "../toolbar/DefaultToolbar";
import { InfoIcon } from "lucide-react";

export const Info = {
    value: "info",
    icon: InfoIcon,
    label: "Information Slide",
} as const;

export function Toolbar({ slide, onSlideUpdate }: ToolbarProps) {
    return (
        <DefaultToolbar slide={slide} onSlideUpdate={onSlideUpdate} />
    )
}