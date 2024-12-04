import { getToolbarConfig, getSlideComponents } from "../../slides/utils";
import type { Slide } from "@/models/Quiz";

interface ToolbarProps {
  slide: Slide;
  onSlideUpdate: (slide: Slide) => void;
}

export function Toolbar({ slide, onSlideUpdate }: ToolbarProps) {
  const SlideComponent = getSlideComponents(slide);
  const config = getToolbarConfig(slide);

  return (
    <div className="h-full bg-card/90 p-4 flex flex-col gap-4 overflow-y-auto text-black">
      <div className="flex items-center gap-2 text-muted-foreground">
        <SlideComponent.Info.icon className="h-4 w-4" />
        <span className="text-sm">{SlideComponent.Info.label}</span>
      </div>

      <div className="space-y-4">
        {config.map(({ component: Component, field }) => (
          <Component
            key={String(field)}
            slide={slide as never}
            onSlideUpdate={onSlideUpdate}
          />
        ))}
      </div>
    </div>
  );
}
