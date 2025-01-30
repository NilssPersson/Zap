import { useState, useEffect } from 'react';
import { InputItem } from '@/components/ui/dynamic-input-list';
import { useTools } from '@/contexts/Tools/context';
import { PlayerList } from './PlayerList';
import PreviousWinners from './PreviousWinners';
import WinnerModal from './WinnerModal';
import Wheel from './Wheel';

const COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#FFEEAD',
  '#D4A5A5',
  '#9B59B6',
  '#3498DB',
  '#E67E22',
  '#2ECC71',
];

interface WheelItem extends InputItem {
  percentage: number;
  color: string;
  used?: boolean;
}

const tempUsers: WheelItem[] = ['Bob', 'Samantha', 'Chris', 'Chloe', ''].map(
  (name, index) => ({
    id: Date.now().toString() + index, // Ensure unique ID
    text: name,
    percentage: 25,
    color: COLORS[index % COLORS.length], // Cycle through the color palette
    used: false,
  })
);

export default function SpinWheel() {
  const { currentItems, setCurrentItems } = useTools();
  const [wheelItems, setWheelItems] = useState<WheelItem[]>(tempUsers); // Default to an empty array
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<WheelItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [idleRotation, setIdleRotation] = useState(0); // Idle rotation angle
  const [previousIdleRotation, setPreviousIdleRotation] = useState(0);

  useEffect(() => {
    if (currentItems.length > 1) {
      setWheelItems(
        currentItems.map((item, index) => ({
          ...item,
          percentage: item.text
            ? 100 / currentItems.filter((i) => i.text !== '').length
            : 0,
          color: COLORS[index % COLORS.length],
          used: false,
        }))
      );
    }
  }, [currentItems]);

  useEffect(() => {
    let idleInterval: NodeJS.Timeout;

    // Start idle rotation only if not spinning and modal is not shown
    if (!isSpinning && !showModal) {
      idleInterval = setInterval(() => {
        setIdleRotation((prev) => (prev + 0.2) % 360); // Increment rotation
      }, 50); // Adjust interval for speed
    }

    // Clear the interval when spinning starts or modal opens
    return () => {
      clearInterval(idleInterval);
    };
  }, [isSpinning, showModal]); // Dependency on isSpinning and showModal

  useEffect(() => {
    let idleInterval: NodeJS.Timeout;

    if (!isSpinning) {
      // Start idle rotation when not spinning
      idleInterval = setInterval(() => {
        setIdleRotation((prev) => (prev + 0.2) % 360); // Increment by 0.2 degrees per interval
      }, 50); // Adjust interval for speed
    }

    return () => clearInterval(idleInterval); // Clear interval on component unmount or when spinning starts
  }, [isSpinning]);

  const normalizePercentages = (items: WheelItem[]): WheelItem[] => {
    const validItems = items.filter((item) => item.text !== '' && !item.used);
    if (validItems.length === 0) return items;

    const total = validItems.reduce((sum, item) => sum + item.percentage, 0);
    if (Math.abs(total - 100) < 0.01) return items;

    return items.map((item) => {
      if (item.text !== '' && !item.used) {
        return {
          ...item,
          percentage: (item.percentage / total) * 100,
        };
      }
      return item;
    });
  };

  return (
    <>
      <div className="hidden md:block">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-8">
            <PlayerList
              COLORS={COLORS}
              setWheelItems={setWheelItems}
              setWinner={setWinner}
              wheelItems={wheelItems}
              normalizePercentages={normalizePercentages}
            />
            <PreviousWinners
              wheelItems={wheelItems}
              setIdleRotation={setIdleRotation}
              setRotation={setRotation}
              setWinner={setWinner}
              setWheelItems={setWheelItems}
            />
          </div>

          <Wheel
            isSpinning={isSpinning}
            rotation={rotation}
            idleRotation={idleRotation}
            wheelItems={wheelItems}
            setWinner={setWinner}
            setRotation={setRotation}
            setIdleRotation={setIdleRotation}
            setIsSpinning={setIsSpinning}
            setShowModal={setShowModal}
            setPreviousIdleRotation={setPreviousIdleRotation}
            previousIdleRotation={previousIdleRotation}
          />
        </div>
      </div>
      <div className="md:hidden block w-full mx-auto p-2 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-8">
            <Wheel
              isSpinning={isSpinning}
              rotation={rotation}
              idleRotation={idleRotation}
              wheelItems={wheelItems}
              setWinner={setWinner}
              setRotation={setRotation}
              setIdleRotation={setIdleRotation}
              setIsSpinning={setIsSpinning}
              setShowModal={setShowModal}
              setPreviousIdleRotation={setPreviousIdleRotation}
              previousIdleRotation={previousIdleRotation}
            />
            <PlayerList
              COLORS={COLORS}
              setWheelItems={setWheelItems}
              setWinner={setWinner}
              wheelItems={wheelItems}
              normalizePercentages={normalizePercentages}
            />
            <PreviousWinners
              wheelItems={wheelItems}
              setIdleRotation={setIdleRotation}
              setRotation={setRotation}
              setWinner={setWinner}
              setWheelItems={setWheelItems}
            />
          </div>
        </div>
      </div>

      <WinnerModal
        winner={winner}
        showModal={showModal}
        setShowModal={setShowModal}
        wheelItems={wheelItems}
        setWheelItems={setWheelItems}
        setCurrentItems={setCurrentItems}
        rotation={rotation}
        setIdleRotation={setIdleRotation}
        normalizePercentages={normalizePercentages}
      />
    </>
  );
}
