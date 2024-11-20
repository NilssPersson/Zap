import { QuestionType, Slide, SlideType } from "@/models/Quiz";
import * as Info from "./info";
import * as Score from "./score";
import * as MCQSA from "./question/mcqsa";
import * as MCQMA from "./question/mcqma";
import * as FA from "./question/fa";
import * as Rank from "./question/rank";

interface ToolbarProps {
    slide: Slide;
    onSlideUpdate: (slide: Slide) => void;
}

interface OptionProps {
    handleAddSlide: (type: SlideType, questionType?: QuestionType) => void;
}

export type { ToolbarProps, OptionProps };

export { Info, Score, MCQSA, MCQMA, FA, Rank };

// Helper to get the correct component based on slide type
export function getSlideComponents(slide: Slide) {
    switch (slide.type) {
        case "info":
            return Info;
        case "score":
            return Score;
        case "question":
            switch (slide.questionType) {
                case "MCQSA":
                    return MCQSA;
                case "MCQMA":
                    return MCQMA;
                case "FA":
                    return FA;
                case "RANK":
                    return Rank;
                default:
                    throw new Error(`Unknown question type: ${slide.questionType}`);
            }
        default:
            throw new Error(`Unknown slide type: ${slide.type}`);
    }
}