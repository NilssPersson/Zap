import { RankSlide } from "@/models/Quiz";
import { BaseQuestionRender } from "../base/QuestionRender";
import SlideRank from "@/slides/_components/SlideRank";

function randomizeList<T>(list: T[]): T[] {
  const shuffled = [...list];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }
  return shuffled;
}

export function Host({ slide }: { slide: RankSlide }) {
  const randomizedRanking = randomizeList(slide.ranking);
  return (
    <BaseQuestionRender slide={slide}>
      <SlideRank ranking={randomizedRanking} />
    </BaseQuestionRender>
  );
}
