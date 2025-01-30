import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { DynamicInputList } from '@/components/ui/dynamic-input-list';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { FaLifeRing } from 'react-icons/fa';
import { useTools } from '@/contexts/Tools/context';
import { InputItem } from '@/components/ui/dynamic-input-list';

interface WheelItem extends InputItem {
  percentage: number;
  color: string;
  used?: boolean;
}

interface PlayerListProps {
  setWheelItems: (items: WheelItem[]) => void;
  setWinner: (winner: WheelItem | null) => void;
  COLORS: string[];
  wheelItems: WheelItem[];
  normalizePercentages: (items: WheelItem[]) => WheelItem[];
}

export function PlayerList({
  setWheelItems,
  setWinner,
  COLORS,
  wheelItems,
  normalizePercentages,
}: PlayerListProps) {
  const { t } = useTranslation();
  const { showAdvanced, setShowAdvanced, setCurrentItems } = useTools();

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

  function removeItem(id: string) {
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
  }

  function clearItems() {
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
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center mb-6 space-x-1">
          <FaLifeRing className="text-2xl text-primary-500" />
          <Label className="text-3xl font-display">
            {t('general:spinWheel')}
          </Label>
        </div>
        <div className="flex items-center space-x-2 my-4">
          <Switch
            id="advanced"
            checked={showAdvanced}
            onCheckedChange={setShowAdvanced}
          />
          <Label className="font-display" htmlFor="advanced">
            {t('general:spinWheel.advancedSettings')}
          </Label>
        </div>
        <DynamicInputList
          items={wheelItems}
          showAdvanced={showAdvanced}
          onItemChange={handleInputChange}
          onPercentageChange={handlePercentageChange}
          onItemRemove={removeItem}
          clearItems={clearItems}
          showColors={true}
          listLabel={t('general:playerNames')}
        />
      </CardContent>
    </Card>
  );
}
