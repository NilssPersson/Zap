import { Button } from '@/components/ui/button';
import { BaseQuestionRender } from '../base/QuestionRender';
import { Participant, RankSlide } from '@/models/Quiz';
import SlideRank from '@/slides/_components/SlideRank';

export function HostAnswer({
  slide,
  participants,
  onNextSlide,
}: {
  slide: RankSlide;
  participants: Participant[];
  onNextSlide: () => void;
}) {
  return (
    <div>
      <BaseQuestionRender participants={participants} slide={slide}>
        <SlideRank ranking={slide.ranking} />
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
