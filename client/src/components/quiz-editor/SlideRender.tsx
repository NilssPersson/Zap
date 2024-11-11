import type { Slide } from "@/types/quiz";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface SlideRenderProps {
    slide: Slide;
    className?: string;
}

const SLIDE_WIDTH = 1920;
const SLIDE_HEIGHT = 1080;

export function SlideRender({ slide, className }: SlideRenderProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const updateScale = () => {
            if (!containerRef.current) return;
            const containerWidth = containerRef.current.offsetWidth;
            const newScale = containerWidth / SLIDE_WIDTH;
            setScale(newScale);
        };

        // Initial calculation
        updateScale();

        // Update on resize
        const resizeObserver = new ResizeObserver(updateScale);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => resizeObserver.disconnect();
    }, []);

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
            <div 
                className="origin-top-left"
                style={{ 
                    width: SLIDE_WIDTH,
                    height: SLIDE_HEIGHT,
                    transform: `scale(${scale})`,
                }}
            >
                <div className="w-full h-full flex items-center justify-center p-16">
                    <h2 className="font-display text-[120px] text-center leading-tight">
                        {slide.title}
                    </h2>
                </div>
            </div>
        </div>
    );
} 