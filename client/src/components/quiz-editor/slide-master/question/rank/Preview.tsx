import { RankSlide } from "@/models/Quiz";
import { BaseQuestionRender } from "../base/QuestionRender";
import SlideRank from "../../../slide-content/SlideRank";

export function Preview({ slide }: { slide: RankSlide }) {
    return (
        <BaseQuestionRender slide={slide}>
            <SlideRank ranking={slide.ranking} />
        </BaseQuestionRender>
    );
} 