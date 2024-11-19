import { BackgroundStyle } from "@/components/quiz-editor/QuizBackground";

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

export enum SlideTypes {
  info = "info",
  score = "score",
  question = "question",
}
export type SlideType = SlideTypes;

export enum QuestionTypes {
  MCQSA = "MCQSA",
  MCQMA = "MCQMA",
  FA = "FA",
  RANK = "rank",
}
export type QuestionType = QuestionTypes;

export interface BaseSlide {
  id: string;
  title: string;
  content?: string;
  imageUrl?: string;
  imageScale?: number;
  backgroundStyle?: BackgroundStyle;
}

interface InfoSlide extends BaseSlide {
  type: SlideTypes.info;
}

export interface ScoreSlideInterface extends BaseSlide {
  type: SlideTypes.score;
  mockScores?: { name: string; points: number; newPoints: number }[];
}

export interface ScoreSlide extends BaseSlide {
  type: SlideTypes.score;
  mockScores?: { name: string; points: number; newPoints: number }[];
}

interface QuestionSlideBase extends BaseSlide {
  type: SlideTypes.question;
  questionType: QuestionType;
  timeLimit: number; // in seconds, 0 means no limit
}

interface RankSlide extends QuestionSlideBase {
  ranking: { name: string; score: number }[];
  questionType: QuestionTypes.RANK;
  timeLimit: number;
}

interface MCQSASlide extends QuestionSlideBase {
  questionType: QuestionTypes.MCQSA;
  options: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>;
}

interface MCQMASlide extends QuestionSlideBase {
  questionType: QuestionTypes.MCQMA;
  options: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>;
}

interface FASlide extends QuestionSlideBase {
  questionType: QuestionTypes.FA;
  correctAnswer: string;
}

interface OngoingQuiz {
  id: string;
  startedAt: string;
  currentSlide: number;
  quiz: Quiz;
  quizId: string;
  quizHost: string;
  participants: { [id: string]: Participant };
}

interface Participant {
  answer: string;
  answerTime: string;
  hasAnswered: boolean;
  avatar: string;
  name: string;
  participantId: string;
  score: number;
}

export type Slide = InfoSlide | ScoreSlide | Question;

export type Question = MCQSASlide | MCQMASlide | FASlide | RankSlide;

export type { OngoingQuiz, Participant };
