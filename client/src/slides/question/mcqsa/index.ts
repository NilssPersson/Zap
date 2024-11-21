export * from './Preview';
export * from './Toolbar';

import { QuestionTypes, SlideTypes, answerTypes } from '@/models/Quiz';
import { CircleDotIcon } from "lucide-react";
import { SlideInfo } from '../..';

export const Info: SlideInfo = {
    value: "question:MCQSA",
    icon: CircleDotIcon,
    label: "Single Answer MCQ",
    slideType: SlideTypes.question,
    questionType: QuestionTypes.MCQSA,
    defaults: {
        options: Array.from({ length: 4 }, (_, i) => ({
            id: crypto.randomUUID(),
            text: `Option ${i + 1}`,
            isCorrect: i === 0,
        })),
        answerType: answerTypes.singleString,
        answer: [""],
    }
} as const; 