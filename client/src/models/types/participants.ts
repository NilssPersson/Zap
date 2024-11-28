export interface ParticipantAnswer {
  slideNumber: number;
  answer: string[];
  time: string;
}

export interface Participant {
  answers: Array<ParticipantAnswer>;
  hasAnswered: boolean;
  avatar: string;
  name: string;
  participantId: string;
  score: number[];
} 