import { useEffect, useState } from "react";
import { Participant } from "@/models/Quiz";
import Avatar, { genConfig } from "react-nice-avatar";
import { motion, AnimatePresence } from "framer-motion";
import DeathScreen from "@/components/particles/Deathscreen";

type BombTimerProps = {
  initialTime: number;
  participants: Participant[];
};

const BombTimer = ({ initialTime, participants }: BombTimerProps) => {
  const [time, setTime] = useState(initialTime);
  const [isExploded, setIsExploded] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [currentParticipants, setCurrentParticipants] = useState(participants);

  // Countdown logic
  useEffect(() => {
    const countdown = setInterval(() => {
      if (time > 0) {
        setTime((prevTime) => prevTime - 1);
      } else {
        clearInterval(countdown);
        setShowMessage(true);
        setIsExploded(true);
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, [time]);

  // Smooth participant rotation
  useEffect(() => {
    const rotateParticipants = setInterval(() => {
      setCurrentParticipants((prev) => {
        const [first, ...rest] = prev;
        return [...rest, first]; // Move the first participant to the end
      });
    }, 5000); // Rotate every 5 seconds

    return () => clearInterval(rotateParticipants);
  }, []);

  return (
    <motion.div
      style={{
        position: "relative",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "4rem",
        backgroundColor: "", // Optional: A light background for contrast
      }}
    >
      {/* Timer */}
      <div className="font-display text-9xl" style={{ textAlign: "center" }}>
        {time}
      </div>

      {/* Big Avatar */}
      <div>
        <AnimatePresence mode="wait">
          {currentParticipants[0] && (
            <motion.div
              key={currentParticipants[0].name}
              initial={{
                opacity: 0,
                x: "-100%",
                
               
              }}
              animate={{
                opacity: 1,
                x: "0%",
               
              }}
              exit={{
                opacity: 0,
                y: "+100%",
              
              }}
              transition={{
                duration: 0.75,
                ease: "easeInOut",
              }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                zIndex: 2,
              }}
            >
              <Avatar
                style={{
                  width: "12rem",
                  height: "12rem",
                }}
                {...genConfig(currentParticipants[0].avatar)}
              />
              <h3 className="font-display">{currentParticipants[0].name}</h3>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Avatar Row */}
      <motion.div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "2rem", // Consistent gap between avatars
          width: "100%", // Full-width container
          padding: "1rem 2rem", // Padding for layout breathing room
          overflow: "hidden", // Hide excess avatars
        }}
      >
        {currentParticipants.slice(1).map((participant, index) => (
          <motion.div
            key={participant.name}
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Avatar
              style={{
                width: "8rem",
                height: "8rem",
              }}
              {...genConfig(participant.avatar)}
            />
            <h3 className="font-display">{participant.name}</h3>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default BombTimer;
