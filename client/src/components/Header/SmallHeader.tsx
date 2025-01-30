import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Zap, ChevronDown, Monitor, Sun, Moon, LogIn } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import LanguageRadio from '../Settings/LanguageRadio';
import { useTheme } from '@/components/ThemeProvider';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { cn } from '@/lib/utils';
import AnimatedHamburgerButton from '@/components/ui/animatedHamburgerButton';

interface SmallHeaderProps {
  locationPath: string;
}

export default function SmallHeader({ locationPath }: SmallHeaderProps) {
  const { t } = useTranslation();
  const { isAuthenticated, logout } = useKindeAuth();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-opacity duration-200 border-b border-b-foreground/20',
        sheetOpen
          ? 'bg-sheet text-white'
          : 'backdrop-blur-lg bg-opacity-10 bg-background/60 text-foreground'
      )}
    >
      <div className="flex h-14 items-center overflow-hidden">
        <div className="mr-0 md:flex w-full">
          <nav className="flex w-full justify-between">
            <Link
              to="/"
              className="flex items-center pl-4 text-2xl font-display"
            >
              <Zap className="text-yellow-400" size={26} />
              <span>Zap</span>
            </Link>
            <div className="flex items-center font-display gap-1">
              {isAuthenticated ? (
                <>
                  <Link to="/">
                    <Button
                      variant={locationPath === '/' ? 'default' : 'ghost'}
                      className="text-lg"
                    >
                      {t('general:home')}
                    </Button>
                  </Link>
                  <Button
                    className="text-lg text-red-500"
                    variant="ghost"
                    onClick={logout}
                  >
                    <LogIn size={16} transform="rotate(180)" />
                    {t('general:logout')}
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/play">
                    <Button
                      className="text-lg text-white bg-green-500"
                      isInteractive
                    >
                      {t('general:play')}
                    </Button>
                  </Link>
                </>
              )}
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger
                  className="mr-1 w-10 h-10 flex items-center justify-center"
                  onClick={() => setSheetOpen(!sheetOpen)}
                >
                  <AnimatedHamburgerButton active={sheetOpen} />
                </SheetTrigger>
                <SheetContent
                  className="w-full border-none font-display text-xl text-white overflow-y-auto mt-14"
                  onOpenAutoFocus={(event) => event.preventDefault()}
                >
                  <SheetDescription className="flex flex-col space-y-2 text-left pt-10">
                    <Link to="/">
                      <Button
                        className="text-2xl"
                        variant="link"
                        onClick={() => setSheetOpen(false)}
                      >
                        {t('general:home')}
                      </Button>
                    </Link>
                    <Link to="/play">
                      <Button
                        className="text-2xl"
                        variant="link"
                        onClick={() => setSheetOpen(false)}
                      >
                        {t('general:play')}
                      </Button>
                    </Link>
                    <Link to="/about">
                      <Button
                        className="text-2xl"
                        variant="link"
                        onClick={() => setSheetOpen(false)}
                      >
                        {t('general:about')}
                      </Button>
                    </Link>
                    <Collapsible
                      open={isToolsOpen}
                      onOpenChange={setIsToolsOpen}
                    >
                      <CollapsibleTrigger className="text-primary text-2xl flex flex-row w-full items-center px-4 pt-1 font-display rounded">
                        <div className="flex items-center pr-1">
                          {t('general:tools')}
                        </div>
                        <ChevronDown
                          className="w-5 h-5"
                          strokeWidth={3}
                          style={{
                            transition: 'transform 0.2s ease',
                            transform: isToolsOpen ? 'rotate(180deg)' : 'none',
                          }}
                        />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-4 pt-2">
                        <div className="grid gap-1">
                          <Link to="/tools/team-generator">
                            <Button
                              className="text-2xl"
                              variant="link"
                              onClick={() => setSheetOpen(false)}
                            >
                              {t('general:teamGenerator')}
                            </Button>
                          </Link>
                          <Link to="/tools/spin-wheel">
                            <Button
                              className="text-2xl"
                              variant="link"
                              onClick={() => setSheetOpen(false)}
                            >
                              {t('general:spinWheel')}
                            </Button>
                          </Link>
                          <Link to="/tools/random-number">
                            <Button
                              className="text-2xl"
                              variant="link"
                              onClick={() => setSheetOpen(false)}
                            >
                              {t('general:randomNumber')}
                            </Button>
                          </Link>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                    <Collapsible
                      open={isLanguageOpen}
                      onOpenChange={setIsLanguageOpen}
                    >
                      <CollapsibleTrigger className="text-primary text-2xl flex flex-row w-full items-center px-4 pt-1 font-display rounded">
                        <div className="flex items-center pr-1">
                          {t('general:language')}
                        </div>
                        <ChevronDown
                          className="w-5 h-5"
                          strokeWidth={3}
                          style={{
                            transition: 'transform 0.2s ease',
                            transform: isLanguageOpen
                              ? 'rotate(180deg)'
                              : 'none',
                          }}
                        />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-6 pt-2">
                        <LanguageRadio setOpen={() => null} />
                      </CollapsibleContent>
                    </Collapsible>
                    <div className="flex justify-between items-center">
                      <h1 className="text-2xl text-primary pl-4 pt-2">
                        {t('general:theme')}
                      </h1>
                      <div className="flex gap-3 border border-primary rounded-full p-2">
                        <Monitor
                          className={cn(
                            'w-4 h-4',
                            theme === 'system' && 'text-primary'
                          )}
                          onClick={() => setTheme('system')}
                        />
                        <Sun
                          className={cn(
                            'w-4 h-4',
                            theme === 'light' && 'text-primary'
                          )}
                          onClick={() => setTheme('light')}
                        />
                        <Moon
                          className={cn(
                            'w-4 h-4',
                            theme === 'dark' && 'text-primary'
                          )}
                          onClick={() => setTheme('dark')}
                        />
                      </div>
                    </div>
                  </SheetDescription>
                </SheetContent>
              </Sheet>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
