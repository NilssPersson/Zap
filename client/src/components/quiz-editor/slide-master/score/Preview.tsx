import { ScoreSlide } from "@/models/Quiz";
import { SlideTitle } from "@/components/quiz-editor/slide-content/SlideTitle";
import ScoreBoard from "@/pages/host/Scoreboard";

export function Preview({ slide }: { slide: ScoreSlide }) {
    return (
        <div className="space-y-12 w-full">
            <SlideTitle title={slide.title} />
            <ScoreBoard scoreboard={slide.mockScores || []} />
        </div>
    );
} 