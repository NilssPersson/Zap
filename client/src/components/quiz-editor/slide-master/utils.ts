import { Slide } from '@/models/Quiz';
import { Info, Score, MCQSA, MCQMA, FA, Rank } from './';

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