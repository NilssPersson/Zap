import { BuzzerButton } from '@/components/ui/buzzer-button';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function Participant({
  answerTempQuestion,
  inPreview = false,
}: {
  answerTempQuestion: (answer: string) => void;
  inPreview: boolean;
}) {
  const { t } = useTranslation(['participants']);

  const [time, setTime] = useState(10);

  useEffect(() => {
    if (time <= 0) return;
    const timer = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 970);

    return () => clearInterval(timer);
  }, [time]);

  if (time > 0 && !inPreview) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center justify-center font-display bg-background p-4 rounded-lg text-lg text-center w-4/5">
          <h1>{t('dontPress')}</h1>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-1 flex-col items-center justify-center font-display">
        <BuzzerButton
          className="w-80 h-80 rounded-full text-4xl bg-red-600 text-white"
          onClick={() => {
            answerTempQuestion('');
          }}
        >
          {t('answer')}
        </BuzzerButton>
      </div>
    );
  }
}
