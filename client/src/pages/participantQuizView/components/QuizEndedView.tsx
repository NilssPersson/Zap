import { useTranslation } from 'react-i18next';

export default function QuizEndedView() {
  const { t } = useTranslation(['participants']);
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <h1 className="text-3xl font-display text-center bg-background p-4 text-foreground rounded-lg">
        {t('endedView.title')}
      </h1>
    </div>
  );
}
