import type { Slide } from '@/models/Quiz';
import { SidebarHeader } from './SidebarHeader';
import { SlideList } from './SlideList';
import { useSlideSidebar } from './useSlideSidebar';

interface SlideSidebarProps {
  quizName: string;
  slides: Slide[];
  onAddSlide: (type: string, questionType?: string, index?: number) => void;
  activeSlideId: string | null;
  onSlideSelect: (slideId: string) => void;
  onSlideDelete: (slideId: string) => void;
  onSlideDuplicate: (slideId: string) => void;
  onSlideMove: (slideId: string, direction: 'up' | 'down') => void;
  onSettingsClick: () => void;
  onSaveClick: () => void;
  hasUnsavedChanges?: boolean;
  isSaving?: boolean;
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
}

export function SlideSidebar({
  quizName,
  slides,
  onAddSlide,
  activeSlideId,
  onSlideSelect,
  onSlideDelete,
  onSlideDuplicate,
  onSlideMove,
  onSettingsClick,
  onSaveClick,
  hasUnsavedChanges,
  isSaving,
  backgroundColor,
  primaryColor,
  secondaryColor,
}: SlideSidebarProps) {
  const {
    isOpen,
    setIsOpen,
    insertIndex,
    handleMouseEnter,
    handleMouseLeave,
    handleMenuMouseEnter,
    handleMenuMouseLeave,
  } = useSlideSidebar({
    slides,
    activeSlideId,
    onSlideSelect,
  });

  return (
    <aside className="min-w-[200px] bg-card/90 h-full border-r shadow-md flex flex-col overflow-hidden">
      <SidebarHeader
        quizName={quizName}
        onSettingsClick={onSettingsClick}
        onSaveClick={onSaveClick}
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={isSaving}
      />

      <SlideList
        slides={slides}
        activeSlideId={activeSlideId}
        onSlideSelect={onSlideSelect}
        onSlideDelete={onSlideDelete}
        onSlideDuplicate={onSlideDuplicate}
        onSlideMove={onSlideMove}
        onAddSlide={onAddSlide}
        backgroundColor={backgroundColor}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        insertIndex={insertIndex}
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
        handleMenuMouseEnter={handleMenuMouseEnter}
        handleMenuMouseLeave={handleMenuMouseLeave}
      />
    </aside>
  );
} 