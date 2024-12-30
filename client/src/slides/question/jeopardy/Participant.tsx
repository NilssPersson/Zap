import { cn } from '@/lib/utils';
import type { Participant } from '@/models/Quiz';
import { useTranslation } from 'react-i18next';

interface Props {
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

export function Participant({ participantData, isTurn, answerTempQuestion }: Props) {
  const { t } = useTranslation('jeopardy');

  if (!isTurn) return null;

  const isMyTurn = isTurn === participantData.participantId;

  const isBuzzerOn = isTurn === "PRE_BUZZER" || isTurn === "BUZZER" || isTurn?.startsWith("BUZZER_");

  const isPreBuzzer = isTurn === "PRE_BUZZER";

  const playerAnswering = isTurn?.startsWith("BUZZER_");

  const isMyBuzzerTurn = isBuzzerOn && isTurn?.endsWith(participantData.participantId);

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
      {isBuzzerOn && (
        <BuzzerButton disabled={isPreBuzzer || (playerAnswering && !isMyBuzzerTurn)} onClick={() => answerTempQuestion('')} />
      )}
    </div>
  );
} 