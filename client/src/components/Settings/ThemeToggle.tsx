import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { cn } from '@/lib/utils';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex gap-3 border border-primary rounded-full p-2">
      <Monitor
        className={cn('w-4 h-4', theme === 'system' && 'text-primary')}
        onClick={() => setTheme('system')}
      />
      <Sun
        className={cn('w-4 h-4', theme === 'light' && 'text-primary')}
        onClick={() => setTheme('light')}
      />
      <Moon
        className={cn('w-4 h-4', theme === 'dark' && 'text-primary')}
        onClick={() => setTheme('dark')}
      />
    </div>
  );
}
