import { ToolbarProps } from "../";
import DefaultToolbar from "@/slides/toolbar/DefaultToolbar";
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