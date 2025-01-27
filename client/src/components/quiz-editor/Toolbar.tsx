import InfoBox from '@/slides/_toolbar/inputs/InfoBox';
import { getToolbarConfig, getSlideComponents } from '../../slides/utils';
import type { Slide } from '@/models/Quiz';

interface ToolbarProps {
  slide: Slide;
  onSlideUpdate: (slide: Slide) => void;
}

export function Toolbar({ slide, onSlideUpdate }: ToolbarProps) {
  const SlideComponent = getSlideComponents(slide);
  const config = getToolbarConfig(slide);

  return (
    <div className="h-full  p-4 flex flex-col gap-4 overflow-y-auto text-foreground">
      <div className="flex items-center gap-2 text-muted-foreground justify-between">
        <div className="flex text-left gap-2 items-center">
          <SlideComponent.Info.icon
            color={SlideComponent.Info.iconColor}
            strokeWidth={3}
            className="h-5 w-5"
          />
          <span className="text-xl font-display">
            {SlideComponent.Info.label}
          </span>
        </div>
        <div className="text-right items-center flex">
          <InfoBox slide={slide} onSlideUpdate={onSlideUpdate} />
        </div>
      </div>

      <div className="space-y-4" key={slide.id}>
        {config.map(({ component: Component, field }) => (
          <Component
            key={String(field) + slide.id}
            slide={slide as never}
            onSlideUpdate={onSlideUpdate}
          />
        ))}
      </div>
    </div>
  );
}
