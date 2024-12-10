import { Participant, MatchingSlide } from "@/models/Quiz";
import { BaseQuestionRender } from "../base/QuestionRender";
import { Button } from "@/components/ui/button";
import { getColor } from "../base/QuizColors";
import NextSlide from "@/slides/_components/NextSlide";

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
  slide: MatchingSlide;
  participants: Participant[];
  onNextSlide: () => void;
}) {
  const randomizedOptions = randomizeList(slide.options);
  
  return (
    <div className="flex flex-1 flex-col items-center justify-center h-full">
      <BaseQuestionRender participants={participants} slide={slide}>
        <div className="flex flex-1 space-x-16 justify-center">
          <div className="flex flex-1 flex-col flex-wrap justify-between max-h-80 gap-4">
            {slide.labels.map((label, idx) => (
              <div key={label.id}  style={{ backgroundColor: getColor(idx) }} className="p-4 rounded-lg">
                <h3 className="text-4xl font-bold">{label.text}</h3>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 flex-1 gap-4 max-h-80 auto-rows-min content-between">
            {randomizedOptions.map((option, index) => (
              <div
                key={index}
                className="bg-primary/30 p-3 rounded-lg text-2xl font-semibold text-center"
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      </BaseQuestionRender>
      <NextSlide onClick={onNextSlide} />
    </div>
  );
} 