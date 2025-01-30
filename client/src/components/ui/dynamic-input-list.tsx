import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTranslation } from 'react-i18next';

export interface InputItem {
  id: string;
  text: string;
  color?: string;
  percentage?: number;
}

interface DynamicInputListProps {
  items: InputItem[];
  showAdvanced?: boolean;
  showColors?: boolean;
  onItemChange: (id: string, value: string) => void;
  onItemRemove: (id: string) => void;
  onPercentageChange?: (id: string, value: string) => void;
  inputPlaceholder?: string;
  listLabel: string;
  clearItems: () => void;
}

export function DynamicInputList({
  items,
  showAdvanced = false,
  showColors = false,
  onItemChange,
  onItemRemove,
  onPercentageChange,
  inputPlaceholder = 'Enter value...',
  listLabel,
  clearItems,
}: DynamicInputListProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [activePercentage, setActivePercentage] = useState<{
    [key: string]: string;
  }>({});
  const { t } = useTranslation();

  useEffect(() => {
    if (items.length === 0) {
      onItemChange(Date.now().toString(), '');
    }
  }, [items, onItemChange]);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (index < items.length - 1 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
      if (index === items.length - 1 && items[index].text !== '') {
        setTimeout(() => {
          inputRefs.current[index + 1]?.focus();
        }, 0);
      }
    }
  };

  const handleFocus = (item: InputItem) => {
    setActivePercentage((prev) => ({
      ...prev,
      [item.id]: item.percentage?.toString() || '',
    }));
  };

  const handleBlur = (item: InputItem) => {
    if (onPercentageChange && activePercentage[item.id]) {
      onPercentageChange(item.id, activePercentage[item.id]);
    }
    setActivePercentage((prev) => {
      const newState = { ...prev };
      delete newState[item.id];
      return newState;
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="font-display text-lg">{listLabel}</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearItems}
                className="text-red-500"
              >
                {t('general:clear')}
                <Trash2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('general:tools.clearTooltip')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {items.map((item, index) => (
        <div key={item.id} className="flex items-center space-x-2">
          {showColors && item.color && (
            <div
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
          )}
          <Input
            value={item.text || ''}
            onChange={(e) => onItemChange(item.id, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => (inputRefs.current[index] = el)}
            placeholder={inputPlaceholder}
            className="font-display"
          />
          {showAdvanced && item.text !== '' && onPercentageChange && (
            <div className="flex items-center space-x-1">
              <Input
                type="number"
                min="0"
                max="100"
                value={
                  activePercentage[item.id] ??
                  Math.round((item.percentage || 0) * 10) / 10
                }
                onFocus={() => handleFocus(item)}
                onBlur={() => handleBlur(item)}
                onChange={(e) =>
                  setActivePercentage((prev) => ({
                    ...prev,
                    [item.id]: e.target.value,
                  }))
                }
                className="max-w-16 w-fit"
              />
              <span>%</span>
            </div>
          )}
          {items.length > 1 && index !== items.length - 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onItemRemove(item.id)}
              className="focus:ring-0"
            >
              <X className=" h-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
