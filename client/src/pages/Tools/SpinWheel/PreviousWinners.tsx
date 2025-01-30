import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { InputItem } from '@/components/ui/dynamic-input-list';

interface WheelItem extends InputItem {
  percentage: number;
  color: string;
  used?: boolean;
}

interface PreviousWinnersProps {
  wheelItems: WheelItem[];
  setWheelItems: (items: WheelItem[]) => void;
  setWinner: (winner: WheelItem | null) => void;
  setRotation: (value: number) => void;
  setIdleRotation: (value: number) => void;
}

export default function PreviousWinners({
  wheelItems,
  setWheelItems,
  setWinner,
  setRotation,
  setIdleRotation,
}: PreviousWinnersProps) {
  const { t } = useTranslation();

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
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <Label className="text-lg font-display">
            {t('general:spinWheel.usedItems')}
          </Label>
          <Button
            variant="outline"
            size="sm"
            onClick={resetUsedItems}
            disabled={!wheelItems.some((item) => item.used)}
            className="font-display shadow-lg border-2 border-gray-400"
          >
            {t('general:spinWheel.resetUsed')}
          </Button>
        </div>
        <div className="space-y-2">
          {wheelItems
            .filter((item) => item.used)
            .map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 p-2 rounded-md bg-muted"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-display">{item.text}</span>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
