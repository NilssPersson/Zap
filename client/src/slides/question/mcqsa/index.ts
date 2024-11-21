export * from './Preview';
export * from './Toolbar';

import { QuestionTypes, SlideTypes } from '@/models/Quiz';
import { CircleDotIcon } from "lucide-react";
import { SlideInfo } from '../..';

export const Info: SlideInfo = {
    value: "question:MCQSA",
    icon: CircleDotIcon,
    label: "Single Answer MCQ",
    slideType: SlideTypes.question,
    questionType: QuestionTypes.MCQSA,
} as const; 