import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { SlideCreationMenu } from "./SlideCreationMenu";
import type { Slide } from "@/types/quiz";

interface EditorSidebarProps {
    quizName: string;
    slides: Slide[];
    onAddSlide: Parameters<typeof SlideCreationMenu>[0]['onAddSlide'];
}

export function EditorSidebar({ quizName, slides, onAddSlide }: EditorSidebarProps) {
    return (
        <aside className="min-w-[300px] bg-secondary border-r shadow-md flex flex-col overflow-hidden">
            <div className="p-3">
                <span className="flex items-center justify-between gap-2">
                    <h2 className="text-xl font-bold text-secondary-foreground">{quizName}</h2>
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
                </span>
                <Separator className="mt-2" />
            </div>
            <div className="flex-1 overflow-y-auto px-3">
                <div className="flex flex-col gap-2">
                    {slides.map((slide) => (
                        <div key={slide.id} className="p-2 border rounded aspect-video bg-white">
                            <h3 className="text-sm font-bold text-secondary-foreground">{slide.title}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
} 