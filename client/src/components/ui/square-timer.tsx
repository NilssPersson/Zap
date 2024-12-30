import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Props {
  progress: number; // 0-100
  className?: string;
}

export const SquareTimer: React.FC<Props> = ({ progress, className }) => {
  // Calculate which squares should be filled based on progress
  // We want the squares to fill from the outside towards the center
  const squareOrder = useMemo(() => [
    0, 8,
    1, 7,
    2, 6,
    3, 5,
    4
  ], []);

  // Calculate how many squares should be filled
  const filledSquares = Math.floor((progress / 100) * 9);

  return (
    <div className={cn("flex gap-2 w-fit", className)}>
      {Array.from({ length: 9 }).map((_, index) => {
        const orderIndex = squareOrder.indexOf(index);
        const shouldBeFilled = orderIndex >= 9 - filledSquares;

        return (
          <motion.div
            key={index}
            className={cn(
              "w-8 h-8 rounded-sm border-2 border-white",
              shouldBeFilled ? "bg-white" : "bg-transparent"
            )}
            initial={false}
            animate={{
              scale: shouldBeFilled ? [1.2, 1] : 1,
              rotate: shouldBeFilled ? [10, 0] : 0,
            }}
            transition={{
              duration: 0.3,
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
          />
        );
      })}
    </div>
  );
}; 