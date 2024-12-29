import React from 'react';
import { JeopardySlide } from '@/models/Quiz';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  slide: JeopardySlide;
  onSlideUpdate: (slide: JeopardySlide) => void;
}

export const JeopardyTimeLimits: React.FC<Props> = ({ slide, onSlideUpdate }) => {
  const updateTimeLimit = (field: 'mainTimeLimit' | 'answerTimeLimit', value: string) => {
    const numValue = parseInt(value) || 0;
    onSlideUpdate({
      ...slide,
      [field]: numValue,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Buzzer Time Limit (seconds)</Label>
        <Input
          type="number"
          value={slide.mainTimeLimit}
          onChange={(e) => updateTimeLimit('mainTimeLimit', e.target.value)}
          min={1}
          step={1}
        />
      </div>
      <div className="space-y-2">
        <Label>Answer Time Limit (seconds)</Label>
        <Input
          type="number"
          value={slide.answerTimeLimit}
          onChange={(e) => updateTimeLimit('answerTimeLimit', e.target.value)}
          min={1}
          step={1}
        />
      </div>
    </div>
  );
};

export default JeopardyTimeLimits; 