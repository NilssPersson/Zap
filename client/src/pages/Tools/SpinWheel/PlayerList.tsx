import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { DynamicInputList } from '@/components/ui/dynamic-input-list';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { FaLifeRing } from 'react-icons/fa';
import { useTools } from '@/contexts/Tools/context';

interface PlayerListProps {
  onItemChange: (id: string, value: string) => void;
  onPercentageChange: (id: string, value: string) => void;
  onItemRemove: (id: string) => void;
  clearItems: () => void;
}

export function PlayerList({
  onItemChange,
  onPercentageChange,
  onItemRemove,
  clearItems,
}: PlayerListProps) {
  const { t } = useTranslation();
  const { showAdvanced, setShowAdvanced, currentItems } = useTools();

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
          items={currentItems}
          showAdvanced={showAdvanced}
          onItemChange={onItemChange}
          onPercentageChange={onPercentageChange}
          onItemRemove={onItemRemove}
          clearItems={clearItems}
          showColors={true}
          listLabel={t('general:playerNames')}
        />
      </CardContent>
    </Card>
  );
}
