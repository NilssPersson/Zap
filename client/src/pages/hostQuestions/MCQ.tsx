import {useState, useEffect} from "react";

type TrueOrFalseProps = {
  question: string;
  alternatives: string[];
  countDownAnswer: number;
};

const getColor = (index:number): string => {
  const colors = [
    "rgb(178,0,255)", //Purple
    "rgb(255,0,195)", //Pink
    "rgb(0,230,255)", //Light Blue
    "rgb(255,234,0)", //Yellow
    "rgb(255,128,0)", //Orange
    "rgb(0,0,255)", //Blue
    "rgb(255,0,0)", //Red
    "rgb(0,255,0)", // Green
  ]; 
  return colors[index];
};

const TrueOrFalse: React.FC<TrueOrFalseProps> = ({
  question,
  alternatives,
  countDownAnswer,
}) => {
  const [timeLeft, setTimeLeft] = useState(countDownAnswer);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <div className="flex-1 flex flex-col items-center h-full">
      <h1 className="text-6xl flex-1 font-bold font-display flex items-center">
        {question}
      </h1>
      <div className="mb-4 text-xl">Time Left: {timeLeft}s</div>
      <div className="flex-1 grid grid-cols-2 gap-6 p-10 w-full items-center">
        {alternatives.map((alternative, index) => (
          <div
            key={index}
            style={{ backgroundColor: getColor(index) }}
            className="flex items-center justify-center text-4xl text-white font-display h-full text-wrap rounded-lg"
          >
            {alternative}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrueOrFalse;
