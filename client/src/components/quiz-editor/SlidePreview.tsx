import type { Slide } from "@/models/Quiz";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { QuizBackground } from "./QuizBackground";
import { getSlideComponents } from "./slide-master/utils";

interface SlidePreviewProps {
  slide: Slide & { titleWiggle?: boolean; contentWiggle?: boolean };
  className?: string;
  thumbnail?: boolean;
  backgroundColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

const SLIDE_WIDTH = 1920;
const SLIDE_HEIGHT = 1080;

export function SlidePreview({
  slide,
  className,
  backgroundColor = "#000B58",
  primaryColor = "#006a67",
  secondaryColor = "#fff4b7",
}: SlidePreviewProps) {
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

  const SlideComponent = getSlideComponents(slide);

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
      <div
        className="origin-top-left relative"
        style={{
          width: SLIDE_WIDTH,
          height: SLIDE_HEIGHT,
          transform: `scale(${scale})`,
        }}
      >
        <div className="w-full h-full flex items-center justify-center p-16">
          <SlideComponent.Preview slide={slide as never} />
        </div>
      </div>
    </div>
  );
}
