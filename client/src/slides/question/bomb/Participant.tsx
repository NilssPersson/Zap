import { useState, useEffect } from 'react';
import { BombSlide } from '@/models/Quiz';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Participant } from '@/models/Quiz';
import { useTranslation } from 'react-i18next';

interface BombParticipantProps {
  slide: BombSlide;
  answerQuestion: (answer: string[]) => void;
  answerTempQuestion: (answer: string) => boolean;
  participantData?: Participant; // Ensure optional
  turn: string;
}

export function Participant({
  slide,
  answerTempQuestion,
  participantData,
  turn,
}: BombParticipantProps) {
  const [userAnswer, setUserAnswer] = useState('');
  const [counter, setCounter] = useState(slide.initialTime || 0);
  const [shake, setShake] = useState(false);
  const [disableInput, setDisableInput] = useState(false);
  const { t } = useTranslation();

  // Handle the input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserAnswer(e.target.value);
  };

  const handleCheckAnswer = () => {
    if (participantData) {
      const isValid = answerTempQuestion(userAnswer);

      if (isValid) {
        setUserAnswer('');
        // Keep the timer running, and rely on `turn` change to reset or stop input
      } else {
        console.log('Wrong answer');
      }
    }
  };

  useEffect(() => {
    if (!participantData) return;

    let interval: NodeJS.Timeout | undefined;

    // Reset the counter and shake when the turn changes
    if (turn !== participantData.participantId) {
      setCounter(slide.initialTime || 0); // Reset counter
      setShake(false); // Remove shake effect
      setDisableInput(true); // Disable input
    } else {
      setDisableInput(false); // Enable input for the current participant
      interval = setInterval(() => {
        setCounter((prevCounter) => {
          if (prevCounter <= 1) {
            clearInterval(interval); // Stop the countdown at zero
            setShake(true); // Trigger the shake animation
            return 0;
          }
          return prevCounter - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [turn, participantData?.participantId, slide.initialTime]);

  return (
    <div
      className={`flex flex-col h-full w-full p-10 ${shake ? 'animate-shake' : ''}`}
    >
      <h1 className="text-3xl font-display font-bold text-center mb-12 bg-background text-foreground p-4 rounded-lg">
        {slide.title}
      </h1>
      {turn === participantData?.participantId && counter > 0 && (
        <div className="mt-4 mb-12 text-center">
          <p
            className={`text-6xl font-bold ${counter <= 5 ? 'text-red-600' : 'text-white'}`}
          >
            {counter}
          </p>
        </div>
      )}
      <div className="flex flex-col items-center justify-center w-full ">
        <div
          className={`p-6 rounded-md shadow-lg text-foreground font-display text-3xl mb-8 w-4/5 max-w-xl ${turn === participantData?.participantId ? 'bg-background' : 'bg-gray-300'}`}
        >
          <Input
            value={userAnswer}
            onChange={handleInputChange}
            placeholder={t('participants:enterAnswer')}
            className="mb-4 w-full p-4 text-xl border rounded-md"
            autoCorrect="off"
            disabled={disableInput}
          />
          <Button
            onClick={handleCheckAnswer}
            className="w-full p-4 text-xl text-white bg-blue-500 rounded-md hover:bg-blue-600"
            disabled={disableInput}
            isInteractive
            inGrid
          >
            {t('participants:send')}
          </Button>
          {disableInput && (
            <p className="mt-4 text-center text-xl font-medium text-gray-600">
              {t('participants:waitYourTurn')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
