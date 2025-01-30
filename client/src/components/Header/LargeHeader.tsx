import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { cn } from '@/lib/utils';
import Settings from '@/components/Settings/Settings';
import Tools from '@/components/Tools';
import LanguageToggle from '@/components/Settings/LanguageToggle';
import { ThemeSelector } from '../ThemeSelector';

interface LargeHeaderProps {
  locationPath: string;
}

export default function LargeHeader({ locationPath }: LargeHeaderProps) {
  const { t } = useTranslation();
  const { isAuthenticated, login, register } = useKindeAuth();

  return (
    <header
      className={cn(
        'transition-opacity duration-200 border-b border-b-foreground/10 bg-background text-foreground'
      )}
    >
      <div className="flex w-full h-16 items-center px-1 overflow-hidden justify-center">
        <div className="mr-0 ml-2 md:flex w-full max-w-7xl">
          <nav className="flex items-center space-x-6 font-medium w-full justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 text-2xl font-display"
            >
              <Zap className="text-yellow-400" size={32} />
              <span>Zap</span>
            </Link>

            <div className="flex items-center font-display gap-1">
              <Link to="/play">
                <Button
                  variant={locationPath === '/play' ? 'default' : 'ghost'}
                  className="text-lg"
                >
                  {t('general:play')}
                </Button>
              </Link>

              <Link to="/">
                <Button
                  variant={locationPath === '/' ? 'default' : 'ghost'}
                  className="text-lg"
                >
                  {t('general:home')}
                </Button>
              </Link>

              <Link to="/about">
                <Button
                  variant={locationPath === '/about' ? 'default' : 'ghost'}
                  className="text-lg"
                >
                  {t('general:about')}
                </Button>
              </Link>
              <Tools />
              {isAuthenticated ? (
                <Settings />
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="text-lg"
                    onClick={() => login()}
                  >
                    {t('general:login')}
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-lg bg-green-600"
                    onClick={() => register()}
                  >
                    {t('general:register')}
                  </Button>
                  <ThemeSelector />
                  <LanguageToggle fixed={false} />
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
