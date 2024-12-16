import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function Participant({
  answerTempQuestion,
}: {
  answerTempQuestion: (answer: string) => void;
}) {
  const { t } = useTranslation(['questions']);
  const [time, setTime] = useState(10);

  useEffect(() => {
    if (time <= 0) return;
    const timer = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 900);

    return () => clearInterval(timer);
  }, [time]);

  if (time > 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <h1>read the question carefully</h1>
      </div>
    );
  } else {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <Button
          className="w-80 h-80 rounded-full text-4xl bg-red-600 text-white"
          onClick={() => {
            answerTempQuestion('');
            console.log('click');
          }}
        >
          {t('answer')}
        </Button>
      </div>
    );
  }
}
