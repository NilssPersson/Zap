import { Zap } from "lucide-react";
import { useEffect, useState } from "react";

export function GameShackTitle() {
  const [rotations, setRotations] = useState<number[]>([]);

  useEffect(() => {
    // Initial random rotations
    setRotations(
      Array.from(
        { length: "Zap!".length + 1 },
        () => (Math.random() - 0.5) * 20, // Random rotation between -10 and 10 degrees
      ),
    );

    // Update rotations every 500ms
    const interval = setInterval(() => {
      setRotations(
        Array.from({ length: "Zap!".length + 1 }, () => (Math.random() - 0.5) * 20),
      );
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <h1 className="text-7xl font-bold font-display flex items-center">
      <Zap
        className="w-20 h-20 -mr-2 text-primary transition-transform duration-500"
        style={{ transform: `rotate(${rotations[0]}deg)` }}
      />
      {"Zap!".split("").map((char, idx) => (
        <span
          key={idx}
          className="fancy-wrap inline-block transition-transform duration-500"
          style={{
            transform: `rotate(${rotations[idx + 1]}deg)`,
            zIndex: 100 - idx + 1,
          }}
        >
          {char}
        </span>
      ))}
    </h1>
  );
}
