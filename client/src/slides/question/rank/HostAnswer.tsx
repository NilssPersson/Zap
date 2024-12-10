import { BaseQuestionRender } from '../base/QuestionRender';
import { Participant, RankSlide } from '@/models/Quiz';
import SlideRank from '@/slides/_components/SlideRank';
import NextSlide from '@/slides/_components/NextSlide';

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
      <NextSlide onClick={onNextSlide} />
    </div>
  );
}
