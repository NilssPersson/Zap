import { BulletPointSlide } from "@/models/Quiz";
import { Preview } from "./Preview";
import NextSlide from "../_components/NextSlide";

export function HostAnswer({
    slide,
    onNextSlide,
    onPrevSlide
}: {
    slide: BulletPointSlide;
    onNextSlide: () => void;
    onPrevSlide: () => void
}) {
    return (
        <div className="flex-1 flex flex-col">
            <Preview slide={slide} />
            <NextSlide onPrev={onPrevSlide} onNext={onNextSlide} />
        </div>
    );
} 