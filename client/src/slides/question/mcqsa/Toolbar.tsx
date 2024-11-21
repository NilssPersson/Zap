import { MCQMASlide } from "@/models/Quiz";
import { ToolbarProps } from "../../";
import { BaseQuestionToolbar } from "../base/QuestionToolbar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import { addOption, removeOption, updateOption } from "../helpers/options";

type MCQSAToolbarProps = ToolbarProps & {
    slide: MCQMASlide;
    onSlideUpdate: (slide: MCQMASlide) => void;
}

export function Toolbar({ slide, onSlideUpdate }: MCQSAToolbarProps) {
    return (
        <BaseQuestionToolbar slide={slide} onSlideUpdate={onSlideUpdate}>
            <div className="space-y-2">
                <Label>Options</Label>
                <div className="space-y-2">
                    {slide.options.map((option) => (
                        <div key={option.id} className="flex items-center gap-2">
                            <Switch
                                checked={option.isCorrect}
                                onCheckedChange={(checked: boolean) =>
                                    updateOption(slide, option.id, { isCorrect: checked }, onSlideUpdate)
                                }
                            />
                            <Input
                                value={option.text}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    updateOption(slide, option.id, { text: e.target.value }, onSlideUpdate)
                                }
                                placeholder="Option text..."
                            />
                            <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => removeOption(slide, option.id, onSlideUpdate)}
                            >
                                <MinusIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    <Button variant="outline" className="w-full" onClick={() => addOption(slide, onSlideUpdate)}>
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Add Option
                    </Button>
                </div>
            </div>
        </BaseQuestionToolbar>
    )
} 