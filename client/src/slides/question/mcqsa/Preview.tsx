import { MCQMASlide } from "@/models/Quiz";
import { BaseQuestionRender } from "@/slides/question/base/QuestionRender";
import { QuestionOptions } from "@/slides/_components/QuestionOptions";

export function Preview({ slide }: { slide: MCQMASlide }) {
    return <BaseQuestionRender slide={slide}>
        <QuestionOptions options={slide.options} type={slide.questionType} />
    </BaseQuestionRender>
} 