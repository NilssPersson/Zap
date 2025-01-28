import { useTranslation } from 'react-i18next';
import { BulletPointSlide } from '@/models/Quiz';

export function Participant({}: { slide: BulletPointSlide }) {
  const { t } = useTranslation('participants');
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl font-display text-center bg-background p-4 text-foreground rounded-lg">
        {t('lookAtTheScreen')}
      </h1>
    </div>
  );
}
