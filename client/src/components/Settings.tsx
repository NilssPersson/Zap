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
import Profile from '@/pages/User/Profile';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const toggleLanguage = (e: any) => {
    e.stopPropagation();
    setIsLanguageOpen(!isLanguageOpen);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Settings</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          {/* Language Selection Section */}
          <div>
            <button
              onClick={toggleLanguage}
              className="w-full text-left px-4 py-2 font-medium hover:bg-gray-100 rounded"
            >
              {t('general:language')}
            </button>
            {isLanguageOpen && (
              <div className="pl-4">
                <button
                  onClick={() => handleLanguageChange('en')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded"
                >
                  {t('general:english')}
                </button>
                <button
                  onClick={() => handleLanguageChange('sv')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded"
                >
                  {t('general:swedish')}
                </button>
              </div>
            )}
          </div>

          <Collapsible>
            <CollapsibleTrigger className="w-full text-left px-4 py-2 font-medium hover:bg-gray-100 rounded">
              Appearance
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 py-2 bg-gray-50 rounded">
              <div className="grid gap-2">
                <Profile />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Additional Settings (e.g., Log out) */}
          <div>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded">
              Log out
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
