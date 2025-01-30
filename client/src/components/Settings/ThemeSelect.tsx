import { useTranslation } from 'react-i18next';
import ThemeToggle from './ThemeToggle';

export default function ThemeSelect() {
  const { t } = useTranslation();
  return (
    <div className="flex justify-between items-center font-display">
      <h1 className="text-md pl-2 pt-2 text-center">{t('general:theme')}</h1>
      <ThemeToggle />
    </div>
  );
}
