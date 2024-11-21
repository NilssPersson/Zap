import { ScoreSlide } from "@/models/Quiz";

export function Participant({ slide }: { slide: ScoreSlide }) {
  return (
    <div className="flex flex-col items-center justify-center h-full pt-80">
      <h1 className="text-3xl font-display text-center">
        Look at the big screen to see your score! {slide.title}
      </h1>
    </div>
  );
}
