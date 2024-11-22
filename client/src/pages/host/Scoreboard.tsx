import { useEffect, useState } from "react";
import Avatar, { genConfig } from "react-nice-avatar";
import { motion, AnimatePresence } from "framer-motion";
import { Participant } from "@/models/Quiz";

function Counter({
  value,
  shouldAnimate,
}: {
  value: number;
  shouldAnimate: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (!shouldAnimate) return;

    const gap = Math.abs(value - displayValue);
    const speed = Math.max(2.5, 500 / gap);
    const increment = value > displayValue ? 1 : -1;

    const timer = setInterval(() => {
      setDisplayValue((prev) => {
        if (prev === value) {
          clearInterval(timer);
          return prev;
        }
        return prev + increment;
      });
    }, speed);

    return () => clearInterval(timer);
  }, [value, displayValue, shouldAnimate]);

  return <span>{displayValue}</span>;
}

interface ScoreBoardProps {
  scoreboard: { [id: string]: Participant };
}

function ScoreBoard({ scoreboard }: ScoreBoardProps) {
  const [participants, setParticipants] = useState(
    Object.values(scoreboard).map((p) => {
      const totalScore = p.score.reduce((sum, s) => sum + s, 0);
      const previousTotalScore =
        totalScore - (p.score[p.score.length - 1] || 0); // Sum minus last score
      return {
        ...p,
        totalScore,
        previousTotalScore,
      };
    })
  );

  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isScoresUpdated, setIsScoresUpdated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Update total scores to the actual total
      const updatedPlayers = participants.map((participant) => ({
        ...participant,
        previousTotalScore: participant.totalScore, // Update previousTotalScore to match totalScore
      }));

      // Sort by total scores
      updatedPlayers.sort((a, b) => b.totalScore - a.totalScore);

      setParticipants(updatedPlayers); // Update state
      setIsFirstRender(false); // Allow animations
      setIsScoresUpdated(true); // Enable Counter animation
    }, 1500);

    return () => clearTimeout(timer);
  }, [participants]);

  return (
    <div className="flex-1 w-full flex-col items-center justify-center overflow-hidden p-4">
      <div className="flex w-full flex-col items-center justify-center overflow-hidden p-4">
        <AnimatePresence>
          {participants.map((participant, index) => (
            <motion.div
              key={participant.name}
              layout
              initial={isFirstRender ? false : { opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 2 }}
              className="flex items-center space-x-4 m-3 w-full max-w-md justify-start"
            >
              <span className=" font-display text-component-background text-6xl  w-8">
                {index + 1}
              </span>
              <Avatar
                style={{ width: "4rem", height: "4rem" }}
                {...genConfig(participant.avatar)}
              />
              <div className="bg-component-background flex items-center justify-between font-display p-4 rounded-lg w-full flex-grow min-w-0">
                <span className="text-textonwbg-grayonw text-3xl truncate">
                  {participant.name}
                </span>
                <span className="text-textonwbg-grayonw text-3xl">
                  <Counter
                    value={
                      isScoresUpdated
                        ? participant.totalScore // Final total score
                        : participant.previousTotalScore // Initial score
                    }
                    shouldAnimate={isScoresUpdated}
                  />
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ScoreBoard;
