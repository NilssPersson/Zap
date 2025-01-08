import { Preview } from './Preview';
import { ScoreSlide } from '@/models/Quiz';
import { Confetti } from '@/components/particles/Confetti';
import NextSlide from '../_components/NextSlide';

export function HostAnswer({
  slide,
  onNextSlide,
  onPrevSlide,
}: {
  slide: ScoreSlide;
  onNextSlide: () => void;
  onPrevSlide: () => void;
}) {
  return (
    <div>
      <Confetti delayProp={5000} />
      <Preview slide={slide} />
       <NextSlide onPrev={onPrevSlide} onNext={onNextSlide} />
    </div>
  );
}
