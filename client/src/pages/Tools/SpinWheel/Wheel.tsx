import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { InputItem } from '@/components/ui/dynamic-input-list';

interface WheelItem extends InputItem {
  percentage: number;
  color: string;
  used?: boolean;
}

interface WheelProps {
  isSpinning: boolean;
  rotation: number;
  idleRotation: number;
  wheelItems: WheelItem[];
  setWinner: (winner: WheelItem | null) => void;
  setPreviousIdleRotation: (value: number) => void;
  setIsSpinning: (value: boolean) => void;
  setIdleRotation: (value: number) => void;
  setRotation: (value: number) => void;
  setShowModal: (value: boolean) => void;
  previousIdleRotation: number;
}

export default function Wheel({
  isSpinning,
  rotation,
  idleRotation,
  wheelItems,
  setWinner,
  setPreviousIdleRotation,
  setIsSpinning,
  setIdleRotation,
  setRotation,
  setShowModal,
  previousIdleRotation,
}: WheelProps) {
  const { t } = useTranslation();

  const spinWheel = () => {
    if (isSpinning) return;

    setWinner(null);
    setPreviousIdleRotation(idleRotation); // Save current idle rotation
    setIsSpinning(true);

    const spinDuration = 3000; // 3 seconds
    const extraSpins = 5; // Number of full rotations
    const randomAngle = Math.random() * 360; // Random final position
    const totalRotation = 360 * extraSpins + randomAngle;

    setRotation(rotation + totalRotation);

    // Calculate winner after spin
    setTimeout(() => {
      setIsSpinning(false);
      const finalAngle = (rotation + totalRotation) % 360;
      const adjustedIdleRotation =
        (previousIdleRotation + (finalAngle - previousIdleRotation)) % 360;
      setIdleRotation(adjustedIdleRotation); // Continue smoothly
      const winningItem = getWinningItem(finalAngle);
      if (winningItem) {
        setWinner(winningItem);
        setShowModal(true); // Show modal
      }
    }, spinDuration);
  };

  const getWinningItem = (finalAngle: number): WheelItem | null => {
    const normalizedAngle = (360 - (finalAngle % 360) + 90) % 360;
    let currentAngle = 0;

    const validItems = wheelItems.filter(
      (item) => item.text !== '' && !item.used
    );

    for (const item of validItems) {
      currentAngle += item.percentage * 3.6;
      if (normalizedAngle <= currentAngle) {
        return item;
      }
    }

    return validItems[0] || null;
  };

  function calculateRotation(index: number): number {
    const validItems = wheelItems.filter((item) => item.text !== '');
    let totalPercentage = 0;
    for (let i = 0; i < index; i++) {
      totalPercentage += validItems[i].percentage;
    }
    return (totalPercentage / 100) * 360;
  }

  return (
    <div className="space-y-4 w-full max-w-2xl mx-auto">
      <div className="relative aspect-square">
        <motion.div
          className="w-full h-full"
          animate={{ rotate: isSpinning ? rotation : idleRotation }}
          transition={{
            duration: isSpinning ? 3 : 0,
            ease: isSpinning ? 'easeOut' : 'linear',
          }}
          style={{
            transformOrigin: 'center center',
            position: 'relative',
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {wheelItems
              .filter((item) => item.text !== '' && !item.used)
              .map((item, index) => {
                const startAngle = calculateRotation(index);
                const endAngle = startAngle + (item.percentage / 100) * 360;
                const largeArcFlag = item.percentage > 50 ? 1 : 0;

                const startX =
                  50 + 50 * Math.cos((startAngle - 90) * (Math.PI / 180));
                const startY =
                  50 + 50 * Math.sin((startAngle - 90) * (Math.PI / 180));
                const endX =
                  50 + 50 * Math.cos((endAngle - 90) * (Math.PI / 180));
                const endY =
                  50 + 50 * Math.sin((endAngle - 90) * (Math.PI / 180));

                const pathData = `
                                M 50 50
                                L ${startX} ${startY}
                                A 50 50 0 ${largeArcFlag} 1 ${endX} ${endY}
                                Z
                              `;

                return (
                  <g key={item.id}>
                    <path
                      d={pathData}
                      fill={item.color}
                      stroke="white"
                      strokeWidth="0.5"
                    />
                    <text
                      className="font-display"
                      x={50}
                      y={50}
                      fill="white"
                      fontSize="4"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{ userSelect: 'none' }}
                      transform={`
                                    rotate(${(startAngle + endAngle) / 2}, 50, 50)
                                    translate(0, -35)
                                  `}
                    >
                      {item.text}
                    </text>
                  </g>
                );
              })}
          </svg>
        </motion.div>

        {/* Pointer */}
        <div className="absolute -right-4 top-1/2 transform -translate-y-1/2">
          <div
            className="w-8 h-8 bg-foreground shadow-lg"
            style={{
              clipPath: 'polygon(100% 0, 100% 100%, 0 50%)',
            }}
          />
        </div>

        <Button
          className="font-display absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full w-12 h-12 lg:w-24 lg:h-24 lg:text-2xl p-0"
          onClick={spinWheel}
          disabled={wheelItems.filter((item) => item.text !== '').length < 2}
        >
          {t('general:spinWheel.spin')}
        </Button>
      </div>
    </div>
  );
}
