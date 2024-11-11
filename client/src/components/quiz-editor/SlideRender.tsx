import type { Slide } from "@/types/quiz";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";

interface SlideRenderProps {
    slide: Slide;
    className?: string;
    thumbnail?: boolean;
}

const SLIDE_WIDTH = 1920;
const SLIDE_HEIGHT = 1080;

export function SlideRender({ slide, className, thumbnail = false }: SlideRenderProps) {
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
            return (
                <h2 className="font-display text-[60px] text-center leading-tight">
                    {slide.title}
                </h2>
            );
        }

        switch (slide.type) {
            case 'info':
                return (
                    <div className="space-y-8">
                        <h2 className="font-display text-[120px] text-center leading-tight">
                            {slide.title}
                        </h2>
                        {slide.content && (
                            <p className="text-[40px] text-center leading-normal">
                                {slide.content}
                            </p>
                        )}
                    </div>
                );

            case 'score':
                return (
                    <div className="space-y-12">
                        <h2 className="font-display text-[120px] text-center leading-tight">
                            {slide.title}
                        </h2>
                        <div className="space-y-6">
                            {slide.mockScores?.map((score, index) => (
                                <div key={index} className="flex justify-between items-center text-[40px]">
                                    <span>{score.playerName}</span>
                                    <span className="font-bold">{score.score}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'question':
                return (
                    <div className="space-y-12 w-full">
                        <div className="space-y-8">
                            <h2 className="font-display text-[120px] text-center leading-tight">
                                {slide.title}
                            </h2>
                            {slide.content && (
                                <p className="text-[40px] text-center leading-normal">
                                    {slide.content}
                                </p>
                            )}
                        </div>

                        {'options' in slide ? (
                            <div className="grid grid-cols-2 gap-8 w-full">
                                {slide.options.map((option) => (
                                    <div 
                                        key={option.id}
                                        className="flex items-center gap-4 text-[40px] p-6 rounded-xl bg-white/10 backdrop-blur"
                                    >
                                        {slide.questionType === 'MCQSA' ? (
                                            <Circle className={cn(
                                                "w-8 h-8",
                                                option.isCorrect && "text-green-500"
                                            )} />
                                        ) : (
                                            <CheckCircle2 className={cn(
                                                "w-8 h-8",
                                                option.isCorrect && "text-green-500"
                                            )} />
                                        )}
                                        <span>{option.text}</span>
                                    </div>
                                ))}
                            </div>
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
                "relative bg-[url('/assets/bg-desktop.svg')] bg-cover bg-center",
                "aspect-video w-full",
                "overflow-hidden",
                className
            )}
        >
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