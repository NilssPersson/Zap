export type SlideType = "question" | "info" | "score";
export type QuestionType = "MCQSA" | "MCQMA" | "FA";

export interface Slide {
    id: string;
    title: string;
    content: string;
    type: SlideType;
    questionType?: QuestionType;
} 