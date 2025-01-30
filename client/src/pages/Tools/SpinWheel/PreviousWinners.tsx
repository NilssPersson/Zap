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
  resetUsedItems: () => void;
}

export default function PreviousWinners({
  wheelItems,
  resetUsedItems,
}: PreviousWinnersProps) {
  const { t } = useTranslation();
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
