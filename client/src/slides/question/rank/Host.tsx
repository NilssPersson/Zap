import { Participant, RankSlide } from "@/models/Quiz";
import { BaseQuestionRender } from "../base/QuestionRender";

import { Button } from "@/components/ui/button";
import NextSlide from "@/slides/_components/NextSlide";

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
          className="w-full max-w-1000px flex gap-2 pb-5"
          style={{
            justifyContent: "center", // Center-align content horizontally
            alignItems: "center", // Align items vertically if heights differ
            flexWrap: "wrap", // Allow wrapping to the next line
          }}
        >
          {randomizedRanking.map((text, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-4 rounded-lg shadow-md"
              style={{
                flexBasis: "calc(25% - 10px)", // Set to 25% width, minus gap
                maxWidth: "100%", // Ensure no more than 4 items per row
              }}
            >
              {/* Option Text */}
              <div
                className="flex items-center justify-center p-4 rounded-lg shadow-md bg-[#FFEEA9] text-3xl font-display text-[#333333] min-h-[80px]"
                style={{
                  minWidth: "100%", // Ensures the item fills the space available
                  maxWidth: "100%", // Prevents overflow
                }}
              >
                {text}
              </div>
            </div>
          ))}
        </div>
        <NextSlide onClick={onNextSlide} />
      </BaseQuestionRender>
    </div>
  );
}
