import { SlideTypes, InfoSlide } from "@/models/Quiz";
import { SlideOption } from "../SlideOption";
import { InfoIcon } from "lucide-react";
import { SlideTitle } from "../slide-content/SlideTitle";
import { SlideContent } from "../slide-content/SlideContent";
import { OptionProps, ToolbarProps } from "./";
import DefaultToolbar from "./toolbar/DefaultToolbar";

// OPTION: Renders the button to add an info slide
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

// RENDER: Renders the info slide
export function Render({ slide }: { slide: InfoSlide }) {
    return <div className="space-y-8">
        <SlideTitle title={slide.title} />
        {slide.imageUrl && (
            <div className="flex justify-center">
                <div className="relative flex items-center justify-center">
                    <img
                        src={slide.imageUrl}
                        alt={slide.title}
                        className="w-auto object-contain"
                        style={{
                            height: `${(slide.imageScale || 1) * 400}px`,
                            transition: "height 0.2s ease-out",
                        }}
                    />
                </div>
            </div>
        )}
        <SlideContent
            content={slide.content}
        />
    </div>
}
    
// TOOLBAR: Renders the info slide toolbar
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