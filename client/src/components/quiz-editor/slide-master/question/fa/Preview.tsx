import { FASlide } from "@/models/Quiz";
import { BaseQuestionRender } from "../base/QuestionRender";

export function Preview({ slide }: { slide: FASlide }) {
    return <BaseQuestionRender slide={slide} />;
} 