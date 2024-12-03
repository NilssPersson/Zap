import { Participant, MatchingSlide } from "@/models/Quiz";
import { BaseQuestionRender } from "../base/QuestionRender";
import { getColor } from "../base/QuizColors";

export function Preview({ slide, participants }: { slide: MatchingSlide, participants: Participant[] }) {
  const unAssignedOptions = slide.options.filter((option) => !slide.labels.some((label) => label.correctOptions.includes(option)));
  return (
    <div>
      <BaseQuestionRender slide={slide} participants={participants}>
        <div className="flex flex-col space-y-4">
          {slide.labels.map((label, idx) => (
            <div key={label.id} style={{ backgroundColor: getColor(idx) }} className="p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">{label.text}</h3>
              <div className="p-1 bg-background/50 rounded-lg border-2 border-dashed border-muted-foreground/50 flex gap-2">
                {label.correctOptions.map((option) => (
                  <div key={option} className="bg-primary/20 p-3 rounded-lg">
                    {option}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="flex flex-wrap gap-2 mt-4">
            {unAssignedOptions.map((option, index) => (
              <div
                key={index}
                className="bg-primary/10 p-3 rounded-lg"
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      </BaseQuestionRender>
    </div>
  );
} 