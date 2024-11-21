export * from './Preview';
export * from './Toolbar';
export * from './Participant';

import { QuestionTypes, SlideTypes } from '@/models/Quiz';
import { CheckSquareIcon } from "lucide-react";
import { SlideInfo } from '../..';

export const Info: SlideInfo = {
    value: "question:MCQMA",
    icon: CheckSquareIcon,
    label: "Multiple Answer MCQ",
    slideType: SlideTypes.question,
    questionType: QuestionTypes.MCQMA,
} as const; 