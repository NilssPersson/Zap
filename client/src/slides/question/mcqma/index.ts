export * from './Preview';
export * from './Toolbar';
export * from './Participant';
export * from './ParticipantAnswer'

import { QuestionTypes, SlideTypes, answerTypes } from '@/models/Quiz';
import { CheckSquareIcon } from "lucide-react";
import { SlideInfo } from '../..';

export const Info: SlideInfo = {
    value: "question:MCQMA",
    icon: CheckSquareIcon,
    label: "Multiple Answer MCQ",
    slideType: SlideTypes.question,
    questionType: QuestionTypes.MCQMA,
    defaults: {
        options: Array.from({ length: 4 }, (_, i) => ({
            id: crypto.randomUUID(),
            text: `Option ${i + 1}`,
            isCorrect: i <= 1,
        })),
        answerType: answerTypes.multipleStrings,
        answer: [],
    }
} as const; 