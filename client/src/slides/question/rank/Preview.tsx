import { Participant, RankSlide } from "@/models/Quiz";
import { BaseQuestionRender } from "@/slides/question/base/QuestionRender";
import SlideRank from "@/slides/_components/SlideRank";

export function Preview({ slide, participants }: { slide: RankSlide, participants: Participant[] }) {
  return (
    <BaseQuestionRender slide={slide} participants={participants}>
      <SlideRank ranking={slide.ranking} />
    </BaseQuestionRender>
  );
}
