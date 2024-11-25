import { ScoreSlide } from "@/models/Quiz";
import { ToolbarProps } from "../";
import DefaultToolbar from "../toolbar/DefaultToolbar";



type ScoreToolbarProps = ToolbarProps & {
    slide: ScoreSlide;
}

export function Toolbar({ slide, onSlideUpdate }: ScoreToolbarProps) {
   
    return (
        <>
            <DefaultToolbar slide={slide} onSlideUpdate={onSlideUpdate} />
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    
                </div>
                <div className="space-y-2">
                </div>
            </div>
        </>
    );
} 