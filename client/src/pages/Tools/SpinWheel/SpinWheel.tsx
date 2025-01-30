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

  // Set the wheelItems whenever currentItems changes
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
  }, [currentItems]); // Trigger when currentItems change

  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const [winner, setWinner] = useState<WheelItem | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [idleRotation, setIdleRotation] = useState(0); // Idle rotation angle
  const [previousIdleRotation, setPreviousIdleRotation] = useState(0);

  // Add effect to watch for changes in currentItems

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

  const handleInputChange = (id: string, value: string) => {
    const newItems = wheelItems.map((item) =>
      item.id === id ? { ...item, text: value } : item
    );

    if (newItems[newItems.length - 1]?.text !== '') {
      newItems.push({
        id: Date.now().toString(),
        text: '',
        percentage: 0,
        color: COLORS[newItems.length % COLORS.length],
      });
    }

    const itemsWithContent = newItems.filter((item) => item.text !== '');
    const defaultPercentage = 100 / itemsWithContent.length;
    newItems.forEach((item) => {
      if (item.text !== '') {
        item.percentage = defaultPercentage;
      }
    });

    setWheelItems(newItems);
    setCurrentItems(newItems);
  };

  const handlePercentageChange = (id: string, value: string) => {
    const newPercentage = parseFloat(value) || 0;
    if (newPercentage < 0 || newPercentage > 100) return;

    const validItems = wheelItems.filter((item) => item.text !== '');
    if (validItems.length <= 1) return;

    const changedItem = validItems.find((item) => item.id === id);
    if (!changedItem) return;

    const oldPercentage = changedItem.percentage;
    const percentageDiff = newPercentage - oldPercentage;

    // If trying to set a percentage that would make others negative, adjust it
    const otherItemsTotal = validItems.reduce(
      (sum, item) => (item.id !== id ? sum + item.percentage : sum),
      0
    );

    if (newPercentage > 100 || otherItemsTotal - Math.abs(percentageDiff) < 0) {
      return;
    }

    // Calculate how much each other item should be adjusted
    const adjustmentRatio = Math.abs(percentageDiff) / otherItemsTotal;

    const newItems = wheelItems.map((item) => {
      if (item.id === id) {
        return { ...item, percentage: newPercentage };
      } else if (item.text !== '') {
        const adjustment = item.percentage * adjustmentRatio;
        return {
          ...item,
          percentage:
            percentageDiff > 0
              ? item.percentage - adjustment
              : item.percentage +
                adjustment * (otherItemsTotal / (100 - newPercentage)),
        };
      }
      return item;
    });

    setWheelItems(normalizePercentages(newItems));
  };

  const removeItem = (id: string) => {
    if (wheelItems.length <= 1) return;

    const newItems = wheelItems.filter((item) => item.id !== id);
    if (newItems.every((item) => item.text !== '')) {
      newItems.push({
        id: Date.now().toString(),
        text: '',
        percentage: 0,
        color: COLORS[newItems.length % COLORS.length],
      });
    }

    const itemsWithContent = newItems.filter((item) => item.text !== '');
    const defaultPercentage = 100 / itemsWithContent.length;
    newItems.forEach((item) => {
      if (item.text !== '') {
        item.percentage = defaultPercentage;
      }
    });

    const normalizedItems = normalizePercentages(newItems);
    setWheelItems(normalizedItems);
    setCurrentItems(normalizedItems);
  };

  const clearItems = () => {
    const newItems = [
      {
        id: Date.now().toString(),
        text: '',
        percentage: 100,
        color: COLORS[0],
      },
    ];
    setWheelItems(newItems);
    setCurrentItems(newItems);
    setWinner(null);
  };

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
  const calculateRotation = (index: number): number => {
    const validItems = wheelItems.filter((item) => item.text !== '');
    let totalPercentage = 0;
    for (let i = 0; i < index; i++) {
      totalPercentage += validItems[i].percentage;
    }
    return (totalPercentage / 100) * 360;
  };

  const resetUsedItems = () => {
    const newItems = wheelItems.map((item) => ({ ...item, used: false }));
    const validItems = newItems.filter((item) => item.text !== '');
    const newPercentage = 100 / validItems.length;

    const normalizedItems = newItems.map((item) =>
      item.text !== '' ? { ...item, percentage: newPercentage } : item
    );

    setWheelItems(normalizedItems);
    setWinner(null);
    setRotation(0);
    setIdleRotation(0);
  };

  return (
    <div className="mx-auto p-2 overflow-hidden">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-8">
          <PlayerList
            onItemChange={handleInputChange}
            onPercentageChange={handlePercentageChange}
            clearItems={clearItems}
            onItemRemove={removeItem}
          />
          <PreviousWinners
            wheelItems={wheelItems}
            resetUsedItems={resetUsedItems}
          />
        </div>

        <Wheel
          isSpinning={isSpinning}
          rotation={rotation}
          idleRotation={idleRotation}
          spinWheel={spinWheel}
          wheelItems={wheelItems}
          calculateRotation={calculateRotation}
        />
      </div>

      <WinnerModal
        winner={winner}
        isSpinning={isSpinning}
        showModal={showModal}
        setShowModal={setShowModal}
        wheelItems={wheelItems}
        setWheelItems={setWheelItems}
        setCurrentItems={setCurrentItems}
        rotation={rotation}
        setIdleRotation={setIdleRotation}
        normalizePercentages={normalizePercentages}
      />
    </div>
  );
}
