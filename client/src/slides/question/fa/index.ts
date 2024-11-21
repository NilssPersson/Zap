export * from './Preview';
export * from './Toolbar';

import { QuestionTypes, SlideTypes } from '@/models/Quiz';
import { TypeIcon } from "lucide-react";
import { SlideInfo } from '../..';

export const Info: SlideInfo = {
    value: "question:FA",
    icon: TypeIcon,
    label: "Free Answer Question",
    slideType: SlideTypes.question,
    questionType: QuestionTypes.FA, 
} as const; 