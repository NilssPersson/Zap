import { MCQMASlide, QuestionTypes, SlideTypes } from "@/models/Quiz";
import { SlideOption } from "../SlideOption";
import { CheckSquareIcon, MinusIcon, PlusIcon } from "lucide-react";
import { BaseQuestionRender, BaseQuestionToolbar } from "./master-question";
import { OptionProps, ToolbarProps } from ".";
import { QuestionOptions } from "../slide-content/QuestionOptions";
import { updateOption } from "./master-question-options-helper";
import { addOption, removeOption } from "./master-question-options-helper";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

// OPTION: Renders the button to add an MCQMA slide
export function Option({ handleAddSlide }: OptionProps) {
    return (
        <SlideOption
            label="Multiple Answer MCQ"
            icon={CheckSquareIcon}
            onClick={() => {
                handleAddSlide(SlideTypes.question, QuestionTypes.MCQMA);
            }}
        />
    );
}
Option.displayName = "MCQMA";

// RENDER: Renders the MCQMA slide
export function Render({ slide }: { slide: MCQMASlide }) {
    return <BaseQuestionRender slide={slide}>
        <QuestionOptions options={slide.options} type={slide.questionType} />
    </BaseQuestionRender>
}

// TOOLBAR: Renders the MCQMA slide toolbar
type MCQMAToolbarProps = ToolbarProps & {
    slide: MCQMASlide;
    onSlideUpdate: (slide: MCQMASlide) => void;
}

export function Toolbar({ slide, onSlideUpdate }: MCQMAToolbarProps) {
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

export const Info = {
    value: "question:MCQMA",
    icon: CheckSquareIcon,
    label: "Multiple Answer MCQ",
} as const;
