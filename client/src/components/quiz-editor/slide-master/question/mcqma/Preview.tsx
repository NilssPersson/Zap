import { MCQMASlide } from "@/models/Quiz";
import { BaseQuestionRender } from "../base/QuestionRender";
import { QuestionOptions } from "../../../slide-content/QuestionOptions";

export function Preview({ slide }: { slide: MCQMASlide }) {
    return <BaseQuestionRender slide={slide}>
        <QuestionOptions options={slide.options} type={slide.questionType} />
    </BaseQuestionRender>
} 