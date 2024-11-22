import { MCQSASlide } from "@/models/Quiz";

interface Options {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface McqsaViewProps {
  slide: MCQSASlide;
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
  return colors[index % colors.length];
};

export function Participant({ slide, answerQuestion }: McqsaViewProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-10">
      <h1 className="text-5xl font-display font-bold text-center mb-8">
        {slide.title}
      </h1>
      <div className="grid grid-cols-2 gap-6 w-full max-w-3xl">
        {slide.options.map((option: Options, index: number) => (
          <div
            key={option.id}
            onClick={() => answerQuestion([option.text])} // Answer instantly on click
            style={{
              backgroundColor: getColor(index),
              cursor: "pointer",
            }}
            className="flex items-center justify-center text-2xl text-white font-display h-24 rounded-lg hover:ring-4 hover:ring-white"
          >
            {option.text}
          </div>
        ))}
      </div>
    </div>
  );
}
