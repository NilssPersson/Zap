interface QuizOngoing {
  id: string;
  quiz_code: string;
  host_user_id: string;
  created_quiz_id: string;
  started_at: string | null;
  current_slide_order: number;
}

interface QuestionOngoing {
    ongoing_quiz_id: string;
    question_id: string;
}

export default QuizOngoing;
export type { QuestionOngoing }; 
