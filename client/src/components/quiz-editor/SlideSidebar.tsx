import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusIcon, CopyIcon, TrashIcon, MoveUpIcon, MoveDownIcon, WrenchIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { SlideCreationMenu } from "./SlideCreationMenu";
import type { Slide } from "@/types/quiz";
import { SlideRender } from "./SlideRender";
import { useEffect } from "react";

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
            <div className="p-3">
                <span className="flex items-center justify-between gap-2">
                    <h2 className="text-xl font-bold text-secondary-foreground">{quizName}</h2>
                    <div className="flex gap-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button 
                                        size="sm" 
                                        className="aspect-square w-6 h-6"
                                        onClick={onSettingsClick}
                                    >
                                        <WrenchIcon className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Quiz Settings</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <Popover>
                                    <TooltipTrigger asChild>
                                        <PopoverTrigger asChild>
                                            <Button variant="destructive" size="sm" className="aspect-square w-6 h-6">
                                                <PlusIcon className="w-4 h-4" />
                                            </Button>
                                        </PopoverTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Add Slide</p>
                                    </TooltipContent>
                                    <SlideCreationMenu onAddSlide={onAddSlide} />
                                </Popover>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </span>
                <Separator className="mt-2" />
            </div>
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
                            
                            {/* Slide Actions */}
                            <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <TooltipProvider>
                                    {index > 0 && (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="secondary"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onSlideMove(slide.id, 'up');
                                                    }}
                                                >
                                                    <MoveUpIcon className="h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Move Up</TooltipContent>
                                        </Tooltip>
                                    )}
                                    
                                    {index < slides.length - 1 && (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="secondary"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onSlideMove(slide.id, 'down');
                                                    }}
                                                >
                                                    <MoveDownIcon className="h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Move Down</TooltipContent>
                                        </Tooltip>
                                    )}
                                    
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="secondary"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onSlideDuplicate(slide.id);
                                                }}
                                            >
                                                <CopyIcon className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Duplicate</TooltipContent>
                                    </Tooltip>
                                    
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onSlideDelete(slide.id);
                                                }}
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Delete</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                    ))}
                    
                    {/* New Slide Button */}
                    <TooltipProvider>
                        <Tooltip>
                            <Popover>
                                <TooltipTrigger asChild>
                                    <PopoverTrigger asChild>
                                        <div 
                                            className="aspect-video border-2 border-dashed rounded flex items-center justify-center cursor-pointer
                                                hover:border-primary/50 hover:bg-muted/50 transition-colors"
                                        >
                                            <PlusIcon className="w-8 h-8 text-muted-foreground" />
                                        </div>
                                    </PopoverTrigger>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Add Slide</p>
                                </TooltipContent>
                                <SlideCreationMenu onAddSlide={onAddSlide} />
                            </Popover>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        </aside>
    );
} 