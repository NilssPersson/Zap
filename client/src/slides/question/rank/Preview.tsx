import { RankSlide } from "@/models/Quiz";
import { BaseQuestionRender } from "@/slides/question/base/QuestionRender";
import SlideRank from "@/slides/_components/SlideRank";

export function Preview({ slide }: { slide: RankSlide }) {
    return (
        <BaseQuestionRender slide={slide}>
            <SlideRank ranking={slide.ranking} />
        </BaseQuestionRender>
    );
} 