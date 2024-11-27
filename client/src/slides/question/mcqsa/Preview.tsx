import { MCQSASlide } from "@/models/Quiz";
import { BaseQuestionRender } from "@/slides/question/base/QuestionRender";
import { yesNoColors } from "../base/QuizColors";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Preview({ slide }: { slide: MCQSASlide }) {
  return (
    <BaseQuestionRender slide={slide} participants={[]}>
      <div className="flex flex-col items-center justify-center h-full p-10">
        <div className="grid grid-cols-2 gap-6 w-full max-w-3xl">
          {slide.options.map((option) => (
            <div
              key={option.id}
              className={cn(
                "flex items-center justify-between text-2xl text-white font-display h-24 p-6 gap-4 rounded-lg box-border", // Unified padding and box-border
                {
                  "bg-white/10 backdrop-blur outline outline-white/50":
                    !option.isCorrect, // Blur effect for wrong options
                  "ring-4 ring-white": option.isCorrect, // Green border for correct options
                },
              )}
              style={{
                backgroundColor: option.isCorrect
                  ? yesNoColors(true) // Green for correct
                  : "bg-white/10 backdrop-blur outline outline-white/50", // Red for incorrect
              }}
            >
              <span className="text-left">{option.text}</span>
              {option.isCorrect && (
                <CheckCircle2 className="w-8 h-8 text-green-500 ml-4" />
              )}
            </div>
          ))}
        </div>
      </div>
    </BaseQuestionRender>
  );
}
