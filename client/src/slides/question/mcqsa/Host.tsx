import { MCQSASlide, Participant } from "@/models/Quiz";
import { BaseQuestionRender } from "../base/QuestionRender";
import { getColor } from "../base/QuizColors";
import { Button } from "@/components/ui/button";
import NextSlide from "@/slides/_components/NextSlide";

export function Host({
  slide,
  participants,
  onNextSlide,
}: {
  slide: MCQSASlide;
  participants: Participant[];
  onNextSlide: () => void;
}) {
  return (
    <BaseQuestionRender slide={slide} participants={participants}>
      <div className="flex flex-col items-center justify-center p-10">
        <div className="grid grid-cols-2 gap-6 w-full max-w-3xl">
          {/* Only display 4 options, without any click functionality */}
          {slide.options.map((option, index) => (
            <div
              key={option.id}
              style={{
                backgroundColor: getColor(index), // Get different color for each div
              }}
              className="flex items-center justify-start text-2xl text-white font-display h-24 p-6 gap-4 rounded-lg box-border" // Same padding and box-border as Preview
            >
              <span>{option.text}</span>
            </div>
          ))}
        </div>
        <NextSlide onClick={onNextSlide} />
      </div>
    </BaseQuestionRender>
  );
}
