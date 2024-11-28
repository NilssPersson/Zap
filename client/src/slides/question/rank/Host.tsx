import { Participant, RankSlide } from "@/models/Quiz";
import { BaseQuestionRender } from "../base/QuestionRender";

import { Button } from "@/components/ui/button";


function randomizeList<T>(list: T[]): T[] {
  if (!Array.isArray(list)) {
    throw new Error("The provided list is not an array.");
  }

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
  slide: RankSlide;
  participants: Participant[];
  onNextSlide: () => void;
}) {
  const randomizedRanking = randomizeList(slide.ranking);
  return (
    <div className="mt-5">
      <BaseQuestionRender participants={participants} slide={slide}>
        <div
          className="w-full max-w-1000px grid gap-2 pb-5"
          style={{
            display: "grid",
            gridTemplateRows: "repeat(2, 1fr)", // Two rows
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", // Adjust based on the number of items
            justifyContent: "center", // Center-align content
          }}
        >
          {randomizedRanking.map((text, index) => (
            <div
              key={index}
              className="min-w-full flex items-center justify-center p-4 rounded-lg shadow-md"
            >
              {/* Option Text */}
              <div
                className="flex items-center justify-center p-4 rounded-lg shadow-md bg-[#FFEEA9] text-3xl font-display text-[#333333] min-h-[80px]"
                style={{
                  minWidth: "400px", // Ensures each option has a minimum width
                  maxWidth: "400px", // Prevents the options from expanding too wide
                }}
              >
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

