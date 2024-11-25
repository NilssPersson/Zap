export * from './Preview';
export * from './Toolbar';
export * from './Participant';
export * from './ParticipantAnswer';
export * from './Host';

import { QuestionTypes, SlideTypes, AnswerTypes } from '@/models/Quiz';
import { CheckSquareIcon } from "lucide-react";
import { SlideInfo } from '../..';
import { nanoid } from 'nanoid'

export const Info: SlideInfo = {
    value: "question:MCQMA",
    icon: CheckSquareIcon,
    label: "Multiple Answer MCQ",
    slideType: SlideTypes.question,
    questionType: QuestionTypes.MCQMA,
    defaults: {
        options: Array.from({ length: 4 }, (_, i) => ({
            id: nanoid(),
            text: `Option ${i + 1}`,
            isCorrect: i <= 1,
        })),
        answerType: AnswerTypes.multipleStrings,
    }
} as const; 