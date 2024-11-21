import { ShowCorrectAnswerTypes } from "@/models/Quiz";
import { ToolbarProps } from "@/slides/";
import DefaultToolbar from "@/slides/toolbar/DefaultToolbar";
import { Label } from "@/components/ui/label";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select";

interface BaseQuestionToolbarProps extends ToolbarProps {
    children?: React.ReactNode;
}

export function BaseQuestionToolbar({ slide, onSlideUpdate, children }: BaseQuestionToolbarProps) {
    if (slide.type !== "question") return null;

    return (
        <>
            <DefaultToolbar slide={slide} onSlideUpdate={onSlideUpdate} />
            <div className="flex items-center space-x-2">
                <Label>Show Correct Answer</Label>
                <Select
                    value={slide.showCorrectAnswer || "auto"}
                    onValueChange={(value) => onSlideUpdate({ ...slide, showCorrectAnswer: value as ShowCorrectAnswerTypes })}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="auto">Auto</SelectItem>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {children}
        </>
    );
} 