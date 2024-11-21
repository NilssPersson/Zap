export * from './Preview';
export * from './Toolbar';
export * from './Participant';
export * from './ParticipantAnswer';

import { QuestionTypes, SlideTypes } from '@/models/Quiz';
import { ListOrdered } from "lucide-react";
import { SlideInfo } from '../..';

export const Info: SlideInfo = {
    value: "question:RANK",
    icon: ListOrdered,
    label: "Rank Answers",
    slideType: SlideTypes.question,
    questionType: QuestionTypes.RANK,
} as const; 