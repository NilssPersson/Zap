import { type Quiz } from '@/models/Quiz';
import { Link } from 'react-router-dom';
import { Zap, WrenchIcon, SaveIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { CustomTooltip } from '../ui/custom-tooltip';
import { cn } from '@/lib/utils';

interface QuizEditorHeaderProps {
  quiz: Quiz;
  onSettingsClick: () => void;
  onSaveClick: () => void;
  hasUnsavedChanges?: boolean;
  isSaving?: boolean;
}

export default function QuizEditorHeader({
  quiz,
  onSettingsClick,
  onSaveClick,
  hasUnsavedChanges,
  isSaving,
}: QuizEditorHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 text-black font-display">
      <div className="flex items-center gap-6">
        <Link
          to="/"
          className="flex items-center text-2xl font-display rounded-full p-1"
        >
          <Zap className="text-yellow-400 " size={26} />
          <span className="fancy-wrap text-white">Zap!</span>
        </Link>
        <h1 className="text-2xl font-display">{quiz.quiz_name}</h1>
        {hasUnsavedChanges && (
          <span className="text-md text-red-500">
            {t('quizEditor:unsavedChanges')}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <CustomTooltip content="Quiz Settings">
          <Button
            variant="outline"
            onClick={onSettingsClick}
            className="text-lg"
          >
            {t('general:settings')}
            <WrenchIcon className="w-7 h-7" />
          </Button>
        </CustomTooltip>
        <Link to="/">
          <Button variant="outline" className="text-lg">
            {t('general:home')}
          </Button>
        </Link>
        <CustomTooltip content="Save Quiz">
          <Button
            size="sm"
            variant="outline"
            className={cn(
              hasUnsavedChanges && 'text-primary hover:text-primary'
            )}
            onClick={onSaveClick}
            disabled={isSaving || !hasUnsavedChanges}
          >
            {t('quizEditor:save')}
            <SaveIcon className="w-6 h-6" />
          </Button>
        </CustomTooltip>
      </div>
    </div>
  );
}
