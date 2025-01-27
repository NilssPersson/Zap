import { SlideTypes, type Slide } from '@/models/Quiz';
import { SlidePreview } from './SlidePreview';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface EditorProps {
  slide: Slide | null;
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  onSlideUpdate: (slide: Slide) => void;
}

export function Editor({
  slide,
  backgroundColor,
  primaryColor,
  secondaryColor,
  onSlideUpdate,
}: EditorProps) {
  const [whichPreview, setWhichPreview] = useState('Preview');
  const { t } = useTranslation();

  if (!slide) {
    return (
      <div className="bg-secondary h-full text-4xl font-display text-foreground flex items-center justify-center">
        {t('quizEditor:selectSlide')}
      </div>
    );
  }

  return (
    <div className="p-4 h-full flex flex-col bg-background text-foreground">
      <div className="flex items-center justify-center space-x-4 font-display">
        <Tabs
          value={whichPreview}
          onValueChange={setWhichPreview}
          className="pb-4"
        >
          <TabsList>
            <TabsTrigger value="Preview">{t('general:preview')}</TabsTrigger>
            <TabsTrigger value="Host">{t('general:host')}</TabsTrigger>
            {slide.type !== SlideTypes.info &&
              slide.type !== SlideTypes.bulletPoint && (
                <>
                  <TabsTrigger value="Participant">
                    {t('general:participant')}
                  </TabsTrigger>
                  <TabsTrigger value="HostAnswer">
                    {t('general:hostAnswer')}
                  </TabsTrigger>
                </>
              )}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 flex items-center justify-center rounded-lg p-4">
        <div
          className={cn(
            'w-full boarder-2 rounded-lg',
            whichPreview === 'Participant' ? 'w-fit' : 'max-w-6xl'
          )}
        >
          <SlidePreview
            slide={slide}
            backgroundColor={backgroundColor}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            whichPreview={whichPreview}
            onSlideUpdate={onSlideUpdate}
          />
        </div>
      </div>
    </div>
  );
}
