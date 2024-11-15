import { useEffect, useState } from "react";
import Avatar, { genConfig } from "react-nice-avatar";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface Player {
  name: string;
  points: number;
  newPoints: number;
}

interface ScoreBoardProps {
  scoreboard: Player[];
}

function Counter({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // Calculate the difference between the current value and the target value
    const gap = Math.abs(value - displayValue);

    // Adjust the speed based on the gap
    const speed = Math.max(5, 1000 / gap); // Increase speed for smaller gaps and limit the minimum speed
    const increment = value > displayValue ? 1 : -1;

    const timer = setInterval(() => {
      setDisplayValue((prev) => {
        if (prev === value) {
          clearInterval(timer);
          return prev;
        }
        return prev + increment;
      });
    }, speed); // Dynamic speed

    return () => clearInterval(timer);
  }, [value, displayValue]);

  return <span>{displayValue}</span>;
}


function ScoreBoard({ scoreboard }: ScoreBoardProps) {
  const [players, setPlayers] = useState(
    scoreboard.map((player) => ({ ...player, avatar: genConfig() }))
  );



  // Function to update scores and re-sort the players
  function handleUpdateScores() {
    const updatedPlayers = players.map((player) => ({
      ...player,
      points: player.newPoints, // Update current points with newPoints
    }));
    updatedPlayers.sort((a, b) => b.points - a.points); // Sort by points (descending)
    setPlayers(updatedPlayers);
 
  }

  return (
    <div className="flex-1 w-full flex-col items-center justify-center overflow-hidden p-4">
      <div className="flex w-full flex-col items-center justify-center overflow-hidden p-4">
        <AnimatePresence>
          {players.map((player, index) => (
            <motion.div
              key={player.name}
              layout // Enables smooth position updates
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 2 }}
              className="flex items-center space-x-4 m-3 w-full max-w-md justify-start"
            >
              {/* Position number on the left */}
              <span className="text-component-background font-display text-3xl w-8">
                {index + 1}
              </span>

              {/* Avatar outside the background */}
              <Avatar
                style={{ width: "4rem", height: "3rem" }}
                {...player.avatar}
              />

              {/* Player info with background */}
              <div className="bg-component-background flex items-center justify-between font-display px-2 py-2 rounded-lg w-full">
                <span className="text-textonwbg-grayonw text-2xl">
                  {player.name}
                </span>
                {/* Animated Counter */}
                <span className="text-textonwbg-grayonw text-2xl">
                  <Counter value={player.points} />
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <Button onClick={handleUpdateScores}>Update Scores</Button>
      </div>
    </div>
  );
}

export default ScoreBoard;
