import { MCQMASlide, QuestionTypes, SlideTypes } from "@/models/Quiz";
import { SlideOption } from "../SlideOption";
import { CircleDotIcon, PlusIcon, MinusIcon } from "lucide-react";
import { BaseQuestionRender, BaseQuestionToolbar } from "./master-question";
import { OptionProps, ToolbarProps } from ".";
import { QuestionOptions } from "../slide-content/QuestionOptions";
import { addOption } from "./master-question-options-helper";
import { removeOption, updateOption } from "./master-question-options-helper";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// OPTION: Renders the button to add an MCQSA slide
export function Option({ handleAddSlide }: OptionProps) {
    return (
        <SlideOption
            label="Single Answer MCQ"
            icon={CircleDotIcon}
            onClick={() => {
                handleAddSlide(SlideTypes.question, QuestionTypes.MCQSA);
            }}
        />
    );
}
Option.displayName = "MCQSA";

// RENDER: Renders the MCQSA slide
export function Render({ slide }: { slide: MCQMASlide }) {
    return <BaseQuestionRender slide={slide}>
        <QuestionOptions options={slide.options} type={slide.questionType} />
    </BaseQuestionRender>
}

// TOOLBAR: Renders the MCQSA slide toolbar
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

export const Info = {
    value: "question:MCQSA",
    icon: CircleDotIcon,
    label: "Single Answer MCQ",
} as const;
