import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export default function ThemeSelect() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex justify-between items-center font-display">
      <h1 className="text-md pl-2 pt-2 text-center">{t('general:theme')}</h1>
      <div className="flex gap-3 border border-primary rounded-full p-2">
        <Monitor
          className={cn('w-3 h-3', theme === 'system' && 'text-primary')}
          onClick={() => setTheme('system')}
        />
        <Sun
          className={cn(
            'w-3 h-3',
            theme === 'light' && 'text-primary border-primary'
          )}
          onClick={() => setTheme('light')}
        />
        <Moon
          className={cn(
            'w-3 h-3',
            theme === 'dark' && 'text-primary border-primary'
          )}
          onClick={() => setTheme('dark')}
        />
      </div>
    </div>
  );
}
