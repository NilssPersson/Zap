import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useTranslation } from 'react-i18next';
import Profile from '@/components/Settings/Profile';
import {
  ChevronDown,
  CircleUserRound,
  Languages,
  LogIn,
  MessageCircleQuestion,
  UserPen,
} from 'lucide-react';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAppContext } from '@/contexts/App/context';
import { Separator } from '@/components/ui/separator';
import LanguageRadio from './LanguageRadio';
import ThemeSelect from './ThemeSelect';

export default function Settings() {
  const { t } = useTranslation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [whichOpen, setWhichOpen] = useState('');
  const { isAuthenticated, logout } = useKindeAuth();
  const {
    user: { user, updateUser },
  } = useAppContext();

  const handleTutorialToggle = (enabled: boolean) => {
    if (user) {
      updateUser({
        ...user,
        tutorialsDisabled: !enabled,
      });
    }
  };

  const handleResetTutorials = () => {
    if (user) {
      updateUser({
        ...user,
        completedTutorials: [],
      });
    }
  };

  return (
    <Popover open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="text-lg flex flex-row items-center">
          {t('general:profile')}
          <ChevronDown
            className="w-4 h-4"
            strokeWidth={3}
            style={{
              transition: 'transform 0.2s ease',
              transform: isSettingsOpen ? `rotate(180deg)` : 'none',
            }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-3 border-border">
        <div className="grid gap-2">
          {isAuthenticated && (
            <>
              <div className="flex items-center space-x-2 w-[200px]">
                <CircleUserRound className="w-6 h-6" />
                <p className="font-display truncate text-sm">{user?.email}</p>
              </div>
              <Separator className=" w-full" />
            </>
          )}
          <Collapsible open={whichOpen === 'language'}>
            <CollapsibleTrigger
              onClick={() =>
                whichOpen === 'language'
                  ? setWhichOpen('')
                  : setWhichOpen('language')
              }
              className="flex flex-row w-full items-center px-2 py-2 font-display hover:bg-primary/90 rounded justify-between"
            >
              <div className="flex items-center">
                <Languages className="w-4 h-4 mr-2" strokeWidth={3} />
                {t('general:language')}
              </div>

              <ChevronDown
                className="w-4 h-4"
                strokeWidth={3}
                style={{
                  transition: 'transform 0.2s ease',
                  transform:
                    whichOpen === 'language' ? 'rotate(180deg)' : 'none',
                }}
              />
            </CollapsibleTrigger>

            <CollapsibleContent className="px-4 py-3 rounded bg-secondary">
              <div className="grid gap-2 font-display ">
                <LanguageRadio setOpen={() => null} />
              </div>
            </CollapsibleContent>
          </Collapsible>
          {isAuthenticated && (
            <>
              <Collapsible open={whichOpen === 'appearance'}>
                <CollapsibleTrigger
                  onClick={() =>
                    whichOpen === 'appearance'
                      ? setWhichOpen('')
                      : setWhichOpen('appearance')
                  }
                  className="flex flex-row w-full items-center px-2 py-2 font-display hover:bg-primary/90 rounded justify-between"
                >
                  <div className="flex items-center">
                    <UserPen className="w-4 h-4 mr-2" strokeWidth={3} />
                    {t('general:appearance')}
                  </div>

                  <ChevronDown
                    className="w-4 h-4"
                    strokeWidth={3}
                    style={{
                      transition: 'transform 0.2s ease',
                      transform:
                        whichOpen === 'appearance' ? 'rotate(180deg)' : 'none',
                    }}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="px-2 py-2 bg-secondary rounded">
                  <div className="grid gap-2">
                    <Profile />
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible open={whichOpen === 'tutorial'}>
                <CollapsibleTrigger
                  onClick={() =>
                    whichOpen === 'tutorial'
                      ? setWhichOpen('')
                      : setWhichOpen('tutorial')
                  }
                  className="flex flex-row w-full items-center px-2 py-2 font-display hover:bg-primary/90 rounded justify-between"
                >
                  <div className="flex items-center">
                    <MessageCircleQuestion
                      className="w-4 h-4 mr-2"
                      strokeWidth={3}
                    />
                    {t('general:tutorial')}
                  </div>

                  <ChevronDown
                    className="w-4 h-4"
                    strokeWidth={3}
                    style={{
                      transition: 'transform 0.2s ease',
                      transform:
                        whichOpen === 'tutorial' ? 'rotate(180deg)' : 'none',
                    }}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 py-3 rounded bg-secondary">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="tutorial-toggle">
                        {t('general:tutorial.enabled')}
                      </Label>
                      <Switch
                        id="tutorial-toggle"
                        checked={!user?.tutorialsDisabled}
                        onCheckedChange={handleTutorialToggle}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleResetTutorials}
                      className="w-full"
                    >
                      {t('general:tutorial.reset')}
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <ThemeSelect />

              <div>
                <Button
                  className="w-full rounded text-red-500"
                  onClick={logout}
                  variant="outline"
                >
                  <LogIn size={16} transform="rotate(180)" />
                  {t('general:logout')}
                </Button>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
