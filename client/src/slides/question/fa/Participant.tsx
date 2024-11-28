import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FASlide } from "@/models/Quiz";

export function Participant({
  slide,
  answerQuestion,
}: {
  slide: FASlide;
  answerQuestion: (answer: string[]) => void;
}) {
  const [value] = useState("");
  return (
    <div className="flex flex-col items-center justify-center mt-60 bg-white p-8 space-y-5 m-4 rounded-md">
      <h1 className="text-3xl font-display text-center text-[#333333]">
        {slide.title}
      </h1>
      <Button
        className="w-44 h-44 rounded-full border bg-red"
        onClick={() => answerQuestion([value])}
      >
        Submit Answer
      </Button>
    </div>
  );
}
