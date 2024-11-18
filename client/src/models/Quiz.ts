import { Slide } from "@/types/quiz";

interface Quiz {
    id: string;
    quiz_name: string;
    user_id: string;
    created_at: string;
    played_at?: string;
    primary_color: string;
    secondary_color: string;
    background_color: string;
    slides: Slide[];
}

interface QuestionCreated {
    quiz_id: string;
    question_id: string;
    question_number: number;
}

export default Quiz;
export type { QuestionCreated };