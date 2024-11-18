interface Participant {
  answer: string;
  answerTime: string;
  avatar: string | null;
  hasAnswered: boolean;
  name: string;
  participantId: string;
  score: number;
}

interface QuizParticipants {
    ongoing_quiz_id: string;
    participant_id: string;
}

export default Participant;
export type { QuizParticipants }; 