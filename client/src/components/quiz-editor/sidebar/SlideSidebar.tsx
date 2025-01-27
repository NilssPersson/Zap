import type { Slide, SlideTypes, QuestionTypes } from '@/models/Quiz';
import { SlideList } from './SlideList';
import { SlideSidebarProvider } from './SlideSidebarContext';

interface SlideSidebarProps {
  quizName: string;
  slides: Slide[];
  onAddSlide: (
    type: SlideTypes,
    questionType?: QuestionTypes,
    index?: number
  ) => void;
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
  onSlideSwap: (activeId: string, overId: string) => void;
}

export function SlideSidebar(props: SlideSidebarProps) {
  return (
    <SlideSidebarProvider {...props}>
      <aside className=" bg-background h-full  shadow-md flex flex-col overflow-hidden">
        <SlideList />
      </aside>
    </SlideSidebarProvider>
  );
}
