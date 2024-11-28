import { Button } from "@/components/ui/button";
import { BaseQuestionRender } from "../base/QuestionRender";
import { Participant, RankSlide } from "@/models/Quiz";
import { rankColors } from "../base/QuizColors";

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
        <div className="grid grid-cols-2 gap-4 w-full pb-5">
          {slide.ranking.map((text, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 p-4 rounded-lg shadow-md"
              style={{ minWidth: "400px" }} // Proper object syntax for style
            >
              {/* Rank Number with Color */}
              <h2
                style={{
                  backgroundColor: rankColors(),
                }}
                className="font-display text-2xl font-bold text-center p-4 rounded-lg text-[#F4F3F2] w-20"
              >
                {index + 1}
              </h2>

              {/* Option Text */}
              <div className="flex items-center w-full p-4 rounded-lg shadow-md bg-[#F4F3F2] text-xl font-display   text-[#333333]">
                {text}
              </div>
            </div>
          ))}
        </div>
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
