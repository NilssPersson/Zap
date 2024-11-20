import { InfoSlide } from "@/models/Quiz";
import { SlideTitle } from "../../slide-content/SlideTitle";
import { SlideContent } from "../../slide-content/SlideContent";

export function Render({ slide }: { slide: InfoSlide }) {
    return <div className="space-y-8">
        <SlideTitle title={slide.title} />
        {slide.imageUrl && (
            <div className="flex justify-center">
                <div className="relative flex items-center justify-center">
                    <img
                        src={slide.imageUrl}
                        alt={slide.title}
                        className="w-auto object-contain"
                        style={{
                            height: `${(slide.imageScale || 1) * 400}px`,
                            transition: "height 0.2s ease-out",
                        }}
                    />
                </div>
            </div>
        )}
        <SlideContent
            content={slide.content}
        />
    </div>
} 