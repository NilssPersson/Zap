export * from './Preview';
export * from './ParticipantAnswer'
export * from './Toolbar';
export * from './Participant';

import { QuestionTypes, SlideTypes, answerTypes } from '@/models/Quiz';
import { TypeIcon } from "lucide-react";
import { SlideInfo } from '../..';
export const Info: SlideInfo = {
    value: "question:FA",
    icon: TypeIcon,
    label: "Free Answer Question",
    slideType: SlideTypes.question,
    questionType: QuestionTypes.FA,
    defaults: {
        correctAnswer: '',
        answerType: answerTypes.freeText,
        answer: [""],
    }
} as const; 