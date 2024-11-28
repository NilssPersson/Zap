import { Participant, MatchingSlide } from "@/models/Quiz";
import { BaseQuestionRender } from "../base/QuestionRender";

export function Preview({ slide, participants }: { slide: MatchingSlide, participants: Participant[] }) {
  return (
    <BaseQuestionRender slide={slide} participants={participants}>
      <div className="flex flex-col space-y-4">
        {slide.labels.map((label) => (
          <div key={label.id} className="bg-secondary p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">{label.text}</h3>
            <div className="h-16 bg-background/50 rounded-lg border-2 border-dashed border-muted-foreground/50" />
          </div>
        ))}
        <div className="flex flex-wrap gap-2 mt-4">
          {slide.options.map((option, index) => (
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
  );
} 