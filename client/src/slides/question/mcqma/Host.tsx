import { MCQMASlide } from "@/models/Quiz";
import { BaseQuestionRender } from "../base/QuestionRender";
import { getColor } from "../base/QuizColors";

export function Host({ slide }: { slide: MCQMASlide }) {
  return (
    <BaseQuestionRender slide={slide}>
      <div className="flex flex-col items-center justify-center h-full p-10">
        <div className="grid grid-cols-2 gap-6 w-full max-w-3xl">
          {/* Only display 4 options, without any click functionality */}
          {slide.options.map((option, index) => (
            <div
              key={option.id}
              style={{
                backgroundColor: getColor(index), // Get different color for each div
              }}
              className="flex items-center justify-start text-2xl text-white font-display h-24 rounded-lg p-6 box-border" // Added box-border to include padding in the element's total size
            >
              <span className="text-left">{option.text}</span>
            </div>
          ))}
        </div>
      </div>
    </BaseQuestionRender>
  );
}
