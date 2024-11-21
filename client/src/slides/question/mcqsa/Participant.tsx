import { Button } from "@/components/ui/button";
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

export function Participant({ slide, answerQuestion }: McqsaViewProps) {
  const colors = [
    "bg-[#FF333D] text-white",
    "bg-[#1AFF12] text-black",
    "bg-[#ECEC00] text-black",
    "bg-[#FF33E0] text-white",
  ];
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-center space-y-10 h-1/2">
        <h1 className="text-3xl font-display">{slide.title}</h1>
        <div className="grid grid-cols-1 gap-6 w-full">
          {slide.options.map((option: Options, index: number) => (
            <Button
              className={`w-full py-3 text-center ${
                colors[index % colors.length]
              }`}
              key={option.text}
              onClick={() => answerQuestion([option.text])}
            >
              {option.text}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
