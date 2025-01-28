import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ClosestSlide } from '@/models/Quiz';
import { InfoIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ClosestViewProps {
  slide: ClosestSlide;
  answerQuestion: (answer: string[]) => void;
}

export function Participant({ slide, answerQuestion }: ClosestViewProps) {
  const [value, setValue] = useState('');
  const { t } = useTranslation(['questions']);

  const handleSubmit = () => {
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      answerQuestion([value]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-5 m-4 rounded-md h-full">
      <div className="flex flex-col items-center justify-center p-8 space-y-5 bg-background rounded-lg">
        <h1 className="text-3xl font-display text-center text-foreground">
          {slide.title}
        </h1>
        <Input
          placeholder={t('closest.enterGuess')}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="font-display text-2xl"
        />
        {isNaN(parseFloat(value)) && value !== '' && (
          <div className="flex justify-start items-center w-full text-red-500">
            <InfoIcon className="w-5 h-5 mr-1" />
            <p className="font-display">{t('general:notANumber')}</p>
          </div>
        )}
        <Button
          onClick={handleSubmit}
          disabled={value === '' || isNaN(parseFloat(value))}
        >
          {t('closest.submitGuess')}
        </Button>
      </div>
    </div>
  );
}
