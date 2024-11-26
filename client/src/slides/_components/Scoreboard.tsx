import { useEffect, useState } from "react";
import Avatar, { genConfig } from "react-nice-avatar";
import { motion, AnimatePresence } from "framer-motion";
import { Participant, ScoreSlide } from "@/models/Quiz";

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
  slide:ScoreSlide;
  participants: Participant[]
  
}


function ScoreBoard({ participants }: ScoreBoardProps) {
  const [processedParticipants, setProcessedParticipants] = useState(
    participants.map((p) => {
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
      // Compute and update total scores
      const updatedParticipants = processedParticipants.map((p) => ({
        ...p,
        previousTotalScore: p.totalScore, // Update previousTotalScore to match totalScore
        totalScore: p.score.reduce((sum, s) => sum + s, 0), // Recompute total score
      }));

      // Sort participants by total score
      updatedParticipants.sort((a, b) => b.totalScore - a.totalScore);

      setProcessedParticipants(updatedParticipants); // Update state
      setIsFirstRender(false); // Allow animations
      setIsScoresUpdated(true); // Enable Counter animation
    }, 1500);

    return () => clearTimeout(timer);
  }, [participants, processedParticipants]); // Re-run when participants prop changes


  return (
    <div className="flex-1 w-full flex-col items-center justify-center overflow-hidden p-4">
      <div className="flex w-full flex-col items-center justify-center overflow-hidden p-4">
        <AnimatePresence>
          {processedParticipants.map((participant, index) => (
            <motion.div
              key={participant.name}
              layout
              initial={isFirstRender ? false : { opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 2 }}
              className="flex items-center space-x-4 m-3 w-full max-w-md justify-start"
            >
              <span className=" w-[20px] font-display text-component-background text-6xl mr-2  ">
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
                        ? participant.totalScore // Render the updated total score
                        : participant.previousTotalScore // Render the previous score initially
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
