import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusIcon, WrenchIcon } from "lucide-react";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
import { SlideCreationMenu } from "./SlideCreationMenu";

interface SidebarHeaderProps {
    quizName: string;
    onSettingsClick: () => void;
    onAddSlide: Parameters<typeof SlideCreationMenu>[0]['onAddSlide'];
}

export function SidebarHeader({ quizName, onSettingsClick, onAddSlide }: SidebarHeaderProps) {
    return (
        <div className="p-3">
            <span className="flex items-center justify-between gap-2">
                <h2 className="text-xl font-bold text-secondary-foreground">{quizName}</h2>
                <div className="flex gap-2">
                    <CustomTooltip content="Quiz Settings">
                        <Button 
                            size="sm" 
                            className="aspect-square w-6 h-6"
                            onClick={onSettingsClick}
                        >
                            <WrenchIcon className="w-4 h-4" />
                        </Button>
                    </CustomTooltip>

                    <Popover>
                        <CustomTooltip content="Add Slide">
                            <PopoverTrigger asChild>
                                <Button variant="destructive" size="sm" className="aspect-square w-6 h-6">
                                    <PlusIcon className="w-4 h-4" />
                                </Button>
                            </PopoverTrigger>
                        </CustomTooltip>
                        <SlideCreationMenu onAddSlide={onAddSlide} />
                    </Popover>
                </div>
            </span>
            <Separator className="mt-2" />
        </div>
    );
} 