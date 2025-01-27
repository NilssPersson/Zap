import type { Slide } from '@/models/Quiz';
import { SlidePreview } from '../SlidePreview';
import { SlideActions } from './SlideActions';
import { getSlideComponents } from '@/slides/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSlideSidebarContext } from './SlideSidebarContext';

interface SlideListItemProps {
  slide: Slide;
  index: number;
  totalSlides: number;
}

export function SlideListItem({
  slide,
  index,
  totalSlides,
}: SlideListItemProps) {
  const slideComponent = getSlideComponents(slide);
  const {
    activeSlideId,
    onSlideSelect,
    backgroundColor,
    primaryColor,
    secondaryColor,
  } = useSlideSidebarContext();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slide.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      id={index === 0 ? 'first-slide' : undefined}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative group cursor-grab active:cursor-grabbing mb-2"
      onClick={() => onSlideSelect(slide.id)}
      tabIndex={0}
      role="button"
      aria-selected={activeSlideId === slide.id}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSlideSelect(slide.id);
        }
      }}
    >
      <div>
        <div className="flex flex-row space-x-2 text-md items-center w-4/5">
          <slideComponent.Info.icon
            className="text-foreground"
            size={16}
            strokeWidth={3}
            color={slideComponent.Info.iconColor}
          />
          <h1 className="font-display text-foreground truncate ">
            {slide.title}
          </h1>
        </div>
        <div
          className={`cursor-pointer rounded overflow-hidden ${
            activeSlideId === slide.id ? ' bg-primary/60 ' : ''
          }`}
        >
          <div className="flex flex-row items-center p-2 ">
            <h1 className="text-foreground rounded-full font-display text-sm  mr-2">
              {index + 1}
            </h1>
            <SlidePreview
              slide={slide}
              backgroundColor={backgroundColor}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
            />
          </div>
        </div>

        <SlideActions
          index={index}
          totalSlides={totalSlides}
          slideId={slide.id}
        />
      </div>
    </div>
  );
}
