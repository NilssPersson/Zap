import type { Slide } from '@/models/Quiz';
import { SlideListItem } from './SlideListItem';
import { SlideInsertArea } from './SlideInsertArea';
import { useTranslation } from 'react-i18next';

interface SlideListProps {
  slides: Slide[];
  activeSlideId: string | null;
  onSlideSelect: (slideId: string) => void;
  onSlideDelete: (slideId: string) => void;
  onSlideDuplicate: (slideId: string) => void;
  onSlideMove: (slideId: string, direction: 'up' | 'down') => void;
  onAddSlide: (type: string, questionType?: string, index?: number) => void;
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  insertIndex: number | null;
  handleMouseEnter: (index: number | null) => void;
  handleMouseLeave: () => void;
  handleMenuMouseEnter: () => void;
  handleMenuMouseLeave: () => void;
}

export function SlideList({
  slides,
  activeSlideId,
  onSlideSelect,
  onSlideDelete,
  onSlideDuplicate,
  onSlideMove,
  onAddSlide,
  backgroundColor,
  primaryColor,
  secondaryColor,
  isOpen,
  setIsOpen,
  insertIndex,
  handleMouseEnter,
  handleMouseLeave,
  handleMenuMouseEnter,
  handleMenuMouseLeave,
}: SlideListProps) {
  const { t } = useTranslation(['questions']);

  return (
    <div className="flex-1 overflow-y-auto px-3 pt-1 slides-container">
      <div className="flex flex-col pb-3">
        {/* Insert area before first slide */}
        <SlideInsertArea
          isOpen={isOpen && insertIndex === 0}
          setIsOpen={setIsOpen}
          index={0}
          onMouseEnter={() => handleMouseEnter(0)}
          onMouseLeave={handleMouseLeave}
          onMenuMouseEnter={handleMenuMouseEnter}
          onMenuMouseLeave={handleMenuMouseLeave}
          onAddSlide={onAddSlide}
        />

        {slides.map((slide, index) => (
          <div key={slide.id}>
            <SlideListItem
              slide={slide}
              index={index}
              totalSlides={slides.length}
              activeSlideId={activeSlideId}
              onSlideSelect={onSlideSelect}
              onSlideDelete={onSlideDelete}
              onSlideDuplicate={onSlideDuplicate}
              onSlideMove={onSlideMove}
              backgroundColor={backgroundColor}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
            />

            {/* Insert area after each slide */}
            {index < slides.length - 1 && (
              <SlideInsertArea
                isOpen={isOpen && insertIndex === index + 1}
                setIsOpen={setIsOpen}
                index={index + 1}
                onMouseEnter={() => handleMouseEnter(index + 1)}
                onMouseLeave={handleMouseLeave}
                onMenuMouseEnter={handleMenuMouseEnter}
                onMenuMouseLeave={handleMenuMouseLeave}
                onAddSlide={onAddSlide}
              />
            )}
          </div>
        ))}

        {/* New Slide Button at the end */}
        <SlideInsertArea
          isOpen={isOpen && insertIndex === null}
          setIsOpen={setIsOpen}
          index={null}
          onMouseEnter={() => handleMouseEnter(null)}
          onMouseLeave={handleMouseLeave}
          onMenuMouseEnter={handleMenuMouseEnter}
          onMenuMouseLeave={handleMenuMouseLeave}
          onAddSlide={onAddSlide}
          isEndButton
        />
      </div>
    </div>
  );
} 