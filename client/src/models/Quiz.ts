interface Quiz {
    id: string;
    user_id: string;
    quiz_name: string;
    created_at: string;
    played_at: string | null;
}

interface QuestionCreated {
    quiz_id: string;
    question_id: string;
    question_number: number;
}

export default Quiz;
export type { QuestionCreated };