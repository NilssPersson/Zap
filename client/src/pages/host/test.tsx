import { useEffect, useState } from "react";
import Avatar, { genConfig } from "react-nice-avatar";
import { motion, AnimatePresence } from "framer-motion";
import { Participant } from "@/models/Quiz";

function Counter({ value, shouldAnimate }: { value: number; shouldAnimate: boolean }) {
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
    Object.values(scoreboard).map((p) => ({
      ...p,
      totalScore: p.score.reduce((sum, s) => sum + s, 0), // Calculate initial total score
    }))
  );

  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isScoresUpdated, setIsScoresUpdated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Update total scores
      const updatedPlayers = participants.map((participant) => {
        const totalScore = participant.score.reduce((sum, s) => sum + s, 0);
        return {
          ...participant,
          totalScore,
        };
      });

      // Sort by total scores
      updatedPlayers.sort((a, b) => b.totalScore - a.totalScore);

      setParticipants(updatedPlayers); // Update state
      setIsFirstRender(false); // Allow animations
      setIsScoresUpdated(true); // Enable Counter animation
    }, 1500);

    return () => clearTimeout(timer);
  }, [scoreboard, participants]); // Only run when the `scoreboard` prop changes

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
              <span className="text-component-background font-display text-3xl w-8">
                {index + 1}
              </span>
              <Avatar
                style={{ width: "8rem", height: "8rem" }}
                {...genConfig(participant.avatar)}
              />
              <div className="bg-component-background flex items-center justify-between font-display px-2 py-2 rounded-lg w-full">
                <span className="text-textonwbg-grayonw text-2xl">{participant.name}</span>
                <span className="text-textonwbg-grayonw text-2xl">
                  <Counter value={participant.totalScore} shouldAnimate={isScoresUpdated} />
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
