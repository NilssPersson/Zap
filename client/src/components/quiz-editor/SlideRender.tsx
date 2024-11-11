import type { Slide } from "@/types/quiz";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { QuizBackground } from "./QuizBackground";
import { SlideTitle } from "./slide-content/SlideTitle";
import { SlideContent } from "./slide-content/SlideContent";
import { QuestionOptions } from "./slide-content/QuestionOptions";
import { ScoreDisplay } from "./slide-content/ScoreDisplay";

interface SlideRenderProps {
    slide: Slide & { titleWiggle?: boolean; contentWiggle?: boolean };
    className?: string;
    thumbnail?: boolean;
    backgroundColor?: string;
    primaryColor?: string;
    secondaryColor?: string;
}

const SLIDE_WIDTH = 1920;
const SLIDE_HEIGHT = 1080;

export function SlideRender({ 
    slide, 
    className, 
    thumbnail = false, 
    backgroundColor = "#000B58",
    primaryColor = "#006a67",
    secondaryColor = "#fff4b7",
}: SlideRenderProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const updateScale = () => {
            if (!containerRef.current) return;
            const containerWidth = containerRef.current.offsetWidth;
            const newScale = containerWidth / SLIDE_WIDTH;
            setScale(newScale);
        };

        updateScale();
        const resizeObserver = new ResizeObserver(updateScale);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => resizeObserver.disconnect();
    }, []);

    const renderContent = () => {
        if (thumbnail) {
            return <SlideTitle title={slide.title} size="small" />;
        }

        switch (slide.type) {
            case 'info':
                return (
                    <div className="space-y-8">
                        <SlideTitle 
                            title={slide.title} 
                            wiggle={slide.titleWiggle}
                        />
                        <SlideContent 
                            content={slide.content} 
                            wiggle={slide.contentWiggle}
                        />
                    </div>
                );

            case 'score':
                return (
                    <div className="space-y-12">
                        <SlideTitle 
                            title={slide.title} 
                            wiggle={slide.titleWiggle}
                        />
                        <ScoreDisplay scores={slide.mockScores} />
                    </div>
                );

            case 'question':
                return (
                    <div className="space-y-12 w-full">
                        <div className="space-y-8">
                            <SlideTitle 
                                title={slide.title} 
                                wiggle={slide.titleWiggle}
                            />
                            <SlideContent 
                                content={slide.content} 
                                wiggle={slide.contentWiggle}
                            />
                        </div>

                        {'options' in slide ? (
                            <QuestionOptions 
                                options={slide.options}
                                type={slide.questionType}
                            />
                        ) : (
                            <div className="text-[40px] text-center italic text-muted-foreground">
                                Free text answer
                            </div>
                        )}
                    </div>
                );
        }
    };

    return (
        <div 
            ref={containerRef}
            className={cn(
                "relative",
                "aspect-video w-full",
                "overflow-hidden",
                className
            )}
        >
            <QuizBackground
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                backgroundColor={backgroundColor}
                className="absolute inset-0"
                style={slide.backgroundStyle}
            />
            {slide.imageUrl && (
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-20"
                    style={{ backgroundImage: `url(${slide.imageUrl})` }}
                />
            )}
            <div 
                className="origin-top-left relative"
                style={{ 
                    width: SLIDE_WIDTH,
                    height: SLIDE_HEIGHT,
                    transform: `scale(${scale})`,
                }}
            >
                <div className="w-full h-full flex items-center justify-center p-16">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
} 