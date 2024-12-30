import { cn } from '@/lib/utils';
import type { JeopardySlide, Participant } from '@/models/Quiz';
import { useTranslation } from 'react-i18next';
import { SquareTimer } from '@/components/ui/square-timer';
import { useTimer } from '@/hooks';
import { useEffect } from 'react';

interface Props {
  slide: JeopardySlide;
  participantData: Participant;
  isTurn: string;
  answerTempQuestion: (answer: string) => boolean;
}

function BuzzerButton({ disabled, onClick }: { disabled: boolean, onClick: () => void }) {
  const { t } = useTranslation('jeopardy');
  return (
    <button
      className={cn('text-white p-2 rounded-full w-[50vw] aspect-square bg-green-500', disabled && 'bg-gray-500')}
      disabled={disabled} onClick={onClick}>
      {disabled ? t('participant.waitForHost') : t('participant.answer')}
    </button>
  )
}

export function Participant({ slide, participantData, isTurn, answerTempQuestion }: Props) {
  const { t } = useTranslation('jeopardy');

  const { answerTimeLimit } = slide;

  const { start, stop, timeLeft, isRunning } = useTimer({
    duration: answerTimeLimit
  });

  if (!isTurn) return null;

  const isMyTurn = isTurn === participantData.participantId;

  const isBuzzerOn = isTurn === "PRE_BUZZER" || isTurn === "BUZZER" || isTurn?.startsWith("BUZZER_");

  const isPreBuzzer = isTurn === "PRE_BUZZER";

  const playerAnswering = isTurn?.startsWith("BUZZER_");

  const isMyBuzzerTurn = isBuzzerOn && isTurn?.endsWith(participantData.participantId);

  const isAnswering = isMyBuzzerTurn && playerAnswering

  useEffect(() => {
    if (isAnswering && !isRunning) {
      start();
    } else if (!isAnswering && isRunning) {
      stop();
    }
  }, [isAnswering, start, stop]);

  return (
    <div className="flex-1 h-full flex flex-col items-center justify-center gap-4 p-4">
      {/* If it is time to select a category */}
      {!isBuzzerOn && (
        isMyTurn ?
          <div className="text-xl font-bold text-green-500 mb-4">
            {t('participant.yourTurn')}
          </div>
          :
          <div className="text-xl font-bold text-green-500 mb-4">
            {t('participant.waitingForSelection')}
          </div>
      )}

      {/* If it is time to answer a question */}
      {isBuzzerOn && !isAnswering && (
        <BuzzerButton disabled={isPreBuzzer || (playerAnswering && !isMyBuzzerTurn)} onClick={() => answerTempQuestion('')} />
      )}

      {/* If this player is currently answering */}
      {isAnswering && (
        <div className="flex flex-col items-center gap-8">
          <div className="text-4xl font-bold">
            {t('participant.yourAnswer')}
          </div>
          <SquareTimer 
            progress={(timeLeft / answerTimeLimit) * 100} 
            className="scale-150"
          />
        </div>
      )}
    </div>
  );
} 