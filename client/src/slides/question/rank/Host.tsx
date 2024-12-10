import { RankSlide, Participant } from '@/models/Quiz';
import NextSlide from '@/slides/_components/NextSlide';
import { ParticipantAnswers } from '@/slides/_components/ParticipantAnswers';
import { getSlideComponents } from '@/slides/utils';

export function Host({
  slide,
  participants = [],
  onNextSlide,
}: {
  slide: RankSlide;
  participants: Participant[];
  onNextSlide: () => void;
}) {
  const SlideComponent = getSlideComponents(slide);
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white rounded p-4 mb-10 mt-20 text-wrap text-center flex-row flex items-center">
        <div className="flex flex-row items-center space-x-1">
          <SlideComponent.Info.icon className="w-16 h-16 text-black" />
          <h1 className="text-5xl text-black font-display">{slide.title}</h1>
        </div>
        {slide.imageUrl && (
          <div className="flex justify-center">
            <div className="relative flex items-center justify-center">
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="w-auto object-contain"
                style={{
                  height: `${(slide.imageScale || 1) * 400}px`,
                  transition: 'height 0.2s ease-out',
                }}
              />
            </div>
          </div>
        )}
      </div>
      <ParticipantAnswers participants={participants} />
      <NextSlide onClick={onNextSlide} />
    </div>
  );
}
