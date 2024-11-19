import { QuestionSlideBase } from "@/models/Quiz";
import { ToolbarProps } from ".";
import DefaultToolbar from "./toolbar/DefaultToolbar";
import { SlideTitle } from "../slide-content/SlideTitle";
import { SlideContent } from "../slide-content/SlideContent";

interface BaseQuestionToolbarProps extends ToolbarProps {
    children?: React.ReactNode;
}

// Base question toolbar that can be extended by specific question types
export function BaseQuestionToolbar({ slide, onSlideUpdate, children }: BaseQuestionToolbarProps) {
    if (slide.type !== "question") return null;

    return (
        <>
            <DefaultToolbar slide={slide} onSlideUpdate={onSlideUpdate} />
            {children}
        </>
    );
}

// Base render component for questions
export function BaseQuestionRender({ slide, children }: { slide: QuestionSlideBase, children?: React.ReactNode }) {
    return (
        <div className="space-y-12 w-full">
            <div className="space-y-8">
                <SlideTitle title={slide.title} wiggle={slide.titleWiggle} />
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
                <SlideContent content={slide.content} wiggle={slide.contentWiggle} />
            </div>
            {children}
        </div>
    );
}
