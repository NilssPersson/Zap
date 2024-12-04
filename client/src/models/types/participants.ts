export interface ParticipantAnswer {
  slideNumber: number;
  answer: string[];
  time: string;
  
}

export interface Participant {
  answers: Array<ParticipantAnswer>;
  tempAnswers: string[];
  isTurn: boolean,
  hasAnswered: boolean;
  avatar: string;
  name: string;
  participantId: string;
  score: number[];
} 