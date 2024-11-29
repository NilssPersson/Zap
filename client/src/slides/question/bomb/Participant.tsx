import { useState } from "react";
import { MCQMASlide } from "@/models/Quiz";

interface Options {
  id: string;
  text: string;
  isCorrect: boolean;
}
interface McqmaViewProps {
  slide: MCQMASlide;
  answerQuestion: (answer: string[]) => void;
}

const getColor = (index: number): string => {
  const colors = [
    "rgb(178,0,255)", // Purple
    "rgb(255,0,195)", // Pink
    "rgb(0,230,255)", // Light Blue
    "rgb(255,204,0)", // Yellow
    "rgb(255,128,0)", // Orange
    "rgb(0,0,255)", // Blue
    "rgb(255,0,0)", // Red
    "rgb(0,255,0)", // Green
  ];
  return colors[index % colors.length]; // Loop through colors if there are more options
};

export function Participant({ slide, answerQuestion }: McqmaViewProps) {
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);

  const toggleOption = (index: number) => {
    setSelectedIndexes(
      (prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index) // Remove if already selected
          : [...prev, index], // Add if not selected
    );
  };

  const handleSubmit = () => {
    const selectedAnswers = selectedIndexes.map(
      (index) => slide.options[index].text,
    );
    answerQuestion(selectedAnswers);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-10">
      <h1 className="text-5xl font-display font-bold text-center mb-8 ">
        {slide.title}
      </h1>
      <div className="grid grid-cols-2 gap-6 w-full max-w-3xl">
        {slide.options.map((option: Options, index: number) => (
          <div
            key={option.id}
            onClick={() => toggleOption(index)}
            style={{
              backgroundColor: getColor(index),
              cursor: "pointer",
            }}
            className={`flex items-center justify-center text-2xl text-white font-display h-24 rounded-lg  ${
              selectedIndexes.includes(index) ? "ring-4 ring-white" : ""
            }`}
          >
            {option.text}
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        disabled={selectedIndexes.length === 0}
        className="mt-8 py-4 px-6 text-2xl font-bold text-white bg-green-500 rounded-lg hover:bg-green-600 disabled:opacity-50"
      >
        Submit Answer
      </button>
    </div>
  );
}
