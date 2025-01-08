import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';

interface LanguageRadioGroupProps {
  setOpen: (open: boolean) => void;
}

export default function LanguageRadioGroup({
  setOpen,
}: LanguageRadioGroupProps) {
  const { t, i18n } = useTranslation(['general']);

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
    setOpen(false);
  };

  return (
    <RadioGroup defaultValue={i18n.language}>
      <div className="flex items-center space-x-2">
        <RadioGroupItem
          value="sv"
          id="sv"
          onClick={() => handleLanguageChange('sv')}
        />
        <Label className="cursor-pointer" htmlFor="sv">
          {t('general:swedish')}
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem
          value="en"
          id="en"
          onClick={() => handleLanguageChange('en')}
        />
        <Label className="cursor-pointer" htmlFor="en">
          {t('general:english')}
        </Label>
      </div>
    </RadioGroup>
  );
}
