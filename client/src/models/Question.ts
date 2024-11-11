import QuestionType from './QuestionType';

interface BaseQuestion {
    id: string;
    question_type_id: string;
    created_at: string;
    question_type?: QuestionType;
}

interface QuestionMCQSA extends BaseQuestion {
    question_text: string;
    alternatives: any; // JSONB type
    correct_answer: number;
}

interface QuestionFA extends BaseQuestion {
    time_limit: number;
}

export type Question = BaseQuestion;
export type { QuestionMCQSA, QuestionFA }; 