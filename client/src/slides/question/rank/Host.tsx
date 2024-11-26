import { Participant, RankSlide } from "@/models/Quiz";
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
  participants,
  onNextSlide,
}: {
  slide: RankSlide;
  participants: Participant[];
  onNextSlide: () => void;
}) {
  const randomizedRanking = randomizeList(slide.ranking);
  return (
    <div>
      <BaseQuestionRender participants={participants} slide={slide}>
        <SlideRank ranking={randomizedRanking} />
      </BaseQuestionRender>
      <Button
        onClick={() => {
          onNextSlide();
        }}
        className="absolute bottom-5 right-5"
      >
        Next Slide
      </Button>
    </div>
  );
}
