import { RankSlide } from "@/models/Quiz";
import { BaseQuestionRender } from "../base/QuestionRender";
import SlideRank from "@/slides/_components/SlideRank";
import { Button } from "@/components/ui/button";

function randomizeList<T>(list: T[]): T[] {
  const shuffled = [...list];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }
  return shuffled;
}

export function Host({
  slide,
  onNextSlide,
}: {
  slide: RankSlide;
  onNextSlide: () => void;
}) {
  const randomizedRanking = randomizeList(slide.ranking);
  return (
    <div>
      <BaseQuestionRender slide={slide}>
        <SlideRank ranking={randomizedRanking} />
      </BaseQuestionRender>
      <Button
        onClick={() => {
          onNextSlide();
        }}
        className="m-5"
      >
        Next Slide
      </Button>
    </div>
  );
}
