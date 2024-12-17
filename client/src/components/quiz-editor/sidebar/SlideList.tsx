import type { Slide, SlideTypes, QuestionTypes } from '@/models/Quiz';
import { SlideListItem } from './SlideListItem';
import { SlideInsertArea } from './SlideInsertArea';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface SlideListProps {
  slides: Slide[];
  activeSlideId: string | null;
  onSlideSelect: (slideId: string) => void;
  onSlideDelete: (slideId: string) => void;
  onSlideDuplicate: (slideId: string) => void;
  onSlideMove: (slideId: string, direction: 'up' | 'down') => void;
  onAddSlide: (type: SlideTypes, questionType?: QuestionTypes, index?: number) => void;
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
  onSlideSwap: (activeId: string, overId: string) => void;
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
  onSlideSwap,
}: SlideListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!active || !over) return;

    console.log('Drag end:', {
      activeId: active.id,
      overId: over.id,
      active,
      over
    });
    
    if (active.id !== over.id) {
      onSlideSwap(String(active.id), String(over.id));
    }
  };

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

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={slides.map(slide => slide.id)}
            strategy={verticalListSortingStrategy}
          >
            {slides.map((slide, index) => (
              <>
                <SlideListItem
                  key={slide.id}
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
                    key={`insert-${slide.id}`}
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
              </>
            ))}
          </SortableContext>
        </DndContext>

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