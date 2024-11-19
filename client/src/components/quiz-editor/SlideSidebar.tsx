import { PlusIcon } from "lucide-react";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { SlideCreationMenu } from "./SlideCreationMenu";
import type { Slide } from "@/models/Quiz";
import { SlideRender } from "./SlideRender";
import { useEffect } from "react";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
import { SidebarHeader } from "./SidebarHeader";
import { SlideActions } from "./SlideActions";

interface SlideSidebarProps {
    quizName: string;
    slides: Slide[];
    onAddSlide: Parameters<typeof SlideCreationMenu>[0]['onAddSlide'];
    activeSlideId: string | null;
    onSlideSelect: (slideId: string) => void;
    onSlideDelete: (slideId: string) => void;
    onSlideDuplicate: (slideId: string) => void;
    onSlideMove: (slideId: string, direction: 'up' | 'down') => void;
    onSettingsClick: () => void;
    onSaveClick: () => void;
    backgroundColor: string;
    primaryColor: string;
    secondaryColor: string;
}

export function SlideSidebar({ 
    quizName, 
    slides, 
    onAddSlide,
    activeSlideId,
    onSlideSelect,
    onSlideDelete,
    onSlideDuplicate,
    onSlideMove,
    onSettingsClick,
    onSaveClick,
    backgroundColor,
    primaryColor,
    secondaryColor
}: SlideSidebarProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!activeSlideId || !document.activeElement?.closest('.slides-container')) return;

            const currentIndex = slides.findIndex(slide => slide.id === activeSlideId);
            if (currentIndex === -1) return;

            switch (e.key) {
                case 'ArrowUp':
                case 'ArrowLeft':
                    if (currentIndex > 0) {
                        e.preventDefault();
                        onSlideSelect(slides[currentIndex - 1].id);
                    }
                    break;
                case 'ArrowDown':
                case 'ArrowRight':
                    if (currentIndex < slides.length - 1) {
                        e.preventDefault();
                        onSlideSelect(slides[currentIndex + 1].id);
                    }
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [activeSlideId, slides, onSlideSelect]);

    return (
        <aside className="min-w-[200px] bg-secondary/90 h-full border-r shadow-md flex flex-col overflow-hidden">
            <SidebarHeader 
                quizName={quizName}
                onSettingsClick={onSettingsClick}
                onAddSlide={onAddSlide}
                onSaveClick={onSaveClick}
            />
            
            <div className="flex-1 overflow-y-auto px-3 pt-1 slides-container">
                <div className="flex flex-col gap-2 pb-3">
                    {slides.map((slide, index) => (
                        <div 
                            key={slide.id} 
                            className={`group relative border rounded overflow-hidden transition-colors
                                ${activeSlideId === slide.id ? 'border-primary ring-2 ring-primary' : 'hover:border-primary/50'}
                            `}
                            onClick={() => onSlideSelect(slide.id)}
                            tabIndex={0}
                            role="button"
                            aria-selected={activeSlideId === slide.id}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    onSlideSelect(slide.id);
                                }
                            }}
                        >
                            <div className="cursor-pointer">
                                <SlideRender 
                                    slide={slide} 
                                    backgroundColor={backgroundColor}
                                    primaryColor={primaryColor}
                                    secondaryColor={secondaryColor}
                                />
                            </div>
                            
                            <SlideActions 
                                index={index}
                                totalSlides={slides.length}
                                onSlideMove={onSlideMove}
                                onSlideDuplicate={onSlideDuplicate}
                                onSlideDelete={onSlideDelete}
                                slideId={slide.id}
                            />
                        </div>
                    ))}
                    
                    {/* New Slide Button */}
                    <Popover>
                        <CustomTooltip content="Add Slide">
                            <PopoverTrigger asChild>
                                <div className="aspect-video border-2 border-dashed rounded flex items-center justify-center cursor-pointer
                                    hover:border-primary/50 hover:bg-muted/50 transition-colors">
                                    <PlusIcon className="w-8 h-8 text-muted-foreground" />
                                </div>
                            </PopoverTrigger>
                        </CustomTooltip>
                        <SlideCreationMenu onAddSlide={onAddSlide} />
                    </Popover>
                </div>
            </div>
        </aside>
    );
} 