import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { FTASlide } from '@/models/Quiz';
import { useTranslation } from 'react-i18next';

interface FastAnswerViewProps {
  slide: FTASlide;
  answerQuestion: (answer: string[]) => void;
}

export function Participant({ slide, answerQuestion }: FastAnswerViewProps) {
  const [value, setValue] = useState('');
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-5 m-4 rounded-md h-full">
      <div className="flex flex-col items-center justify-center p-8 space-y-5 bg-background text-foreground rounded-lg">
        <h1 className="text-3xl font-display text-center">{slide.title}</h1>
        <Input
          placeholder="Enter Answer"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="font-display text-3xl "
        />

        <Button onClick={() => answerQuestion([value])} className="w-full">
          {t('general:answer')}
        </Button>
      </div>
    </div>
  );
}
