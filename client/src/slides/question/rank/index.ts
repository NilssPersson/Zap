export * from './Preview';
export * from './Toolbar';
export * from './Participant';

import { QuestionTypes, SlideTypes, answerTypes } from '@/models/Quiz';
import { ListOrdered } from "lucide-react";
import { SlideInfo } from '../..';

export const Info: SlideInfo = {
    value: "question:RANK",
    icon: ListOrdered,
    label: "Rank Answers",
    slideType: SlideTypes.question,
    questionType: QuestionTypes.RANK,
    defaults: {
        ranking: [],
        answerType: answerTypes.rank,
        answer: [],
    }
} as const; 