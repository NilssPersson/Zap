interface Participant {
    id: string;
    name: string;
    avatar: string | null;
    hasAnswered: boolean;
    quiz_id: string;
    answer: string | null;
    points: number;
}

interface QuizParticipants {
    ongoing_quiz_id: string;
    participant_id: string;
}

export default Participant;
export type { QuizParticipants }; 