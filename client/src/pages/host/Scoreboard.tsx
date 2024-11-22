import { useEffect, useState } from "react";
import Avatar, { genConfig } from "react-nice-avatar";
import { motion, AnimatePresence } from "framer-motion";



function Counter({ value, shouldAnimate }: { value: number; shouldAnimate: boolean }) {
  const [displayValue, setDisplayValue] = useState(value); // Initialize with the final value

  useEffect(() => {
    if (!shouldAnimate) return; // Skip animation if it shouldn't animate

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
  scoreboard: Player[];
}

interface Player {
  name: string;
  points: number;
  newPoints: number;
}

function ScoreBoard({ scoreboard }: ScoreBoardProps) {
  const [players, setPlayers] = useState(
    scoreboard.map((player) => ({ ...player, avatar: genConfig() }))
  );
  const [isFirstRender, setIsFirstRender] = useState(true); // Track initial render
  const [isScoresUpdated, setIsScoresUpdated] = useState(false); // Track score updates

  useEffect(() => {
    const timer = setTimeout(() => {
      const updatedPlayers = players.map((player) => ({
        ...player,
        points: player.newPoints,
      }));
      updatedPlayers.sort((a, b) => b.points - a.points);
      setPlayers(updatedPlayers);
      setIsFirstRender(false); // Allow animations after scores are updated
      setIsScoresUpdated(true); // Enable Counter animation
    }, 1500); // Delay of 2 seconds

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [players]);

  return (
    <div className="flex-1 w-full flex-col items-center justify-center overflow-hidden p-4">
      <div className="flex w-full flex-col items-center justify-center overflow-hidden p-4">
        <AnimatePresence>
          {players.map((player, index) => (
            <motion.div
              key={player.name}
              layout
              initial={isFirstRender ? false : { opacity: 0, y: -20 }} // Disable animation on first render
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 2 }}
              className="flex items-center space-x-4 m-3 w-full max-w-md justify-start"
            >
              <span className="text-component-background font-display text-3xl w-8">
                {index + 1}
              </span>
              <Avatar
                style={{ width: "4rem", height: "3rem" }}
                {...player.avatar}
              />
              <div className="bg-component-background flex items-center justify-between font-display px-2 py-2 rounded-lg w-full">
                <span className="text-textonwbg-grayonw text-2xl">
                  {player.name}
                </span>
                <span className="text-textonwbg-grayonw text-2xl">
                  <Counter value={player.points} shouldAnimate={isScoresUpdated} />
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
