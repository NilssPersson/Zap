import { BackgroundStyle } from "@/components/quiz-editor/QuizBackground";

export interface Quiz {
  id: string;
  quiz_name: string;
  user_id: string;
  created_at: string;
  updated_at?: string;
  played_at?: string;
  primary_color: string;
  secondary_color: string;
  background_color: string;
  settings: QuizSettings;
  isHosted: boolean;
  isShared: boolean;
  slides: Slide[];
}

export interface QuizSettings {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  showCorrectAnswerDefault: ShowCorrectAnswerTypes;
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
  RANK = "RANK",
}
export type QuestionType = QuestionTypes;

export interface BaseSlide {
  id: string;
  title: string;
  content?: string;
  imageUrl?: string;
  imageScale?: number;
  backgroundStyle?: BackgroundStyle;
  type: SlideType;
}

export interface InfoSlide extends BaseSlide {
  type: SlideTypes.info;
}

export interface ScoreSlide extends BaseSlide {
  type: SlideTypes.score;
  
}

export enum AnswerTypes {
  singleString = "singleString",
  multipleStrings = "multipleStrings",
  freeText = "freeText",
  rank = "rank",
}

export type answerType = AnswerTypes;

export enum ShowCorrectAnswerTypes {
  auto = "auto",
  manual = "manual",
  never = "never",
}

interface QuestionSlideBase extends BaseSlide {
  type: SlideTypes.question;
  questionType: QuestionType;
  timeLimit: number; // in seconds, 0 means no limit
  answerType: answerType;
  showCorrectAnswer: ShowCorrectAnswerTypes; // Lägg till knapp för show answer
}

export interface RankSlide extends QuestionSlideBase {
  ranking: string[];
  questionType: QuestionTypes.RANK;
  answerType: AnswerTypes.rank;
}

export interface MCQSASlide extends QuestionSlideBase {
  questionType: QuestionTypes.MCQSA;
  options: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>;
  answerType: AnswerTypes.singleString;
}

export interface MCQMASlide extends QuestionSlideBase {
  questionType: QuestionTypes.MCQMA;
  options: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>;
  answerType: AnswerTypes.multipleStrings;
}

export interface FASlide extends QuestionSlideBase {
  questionType: QuestionTypes.FA;
  answerType: AnswerTypes.freeText;
  correctAnswer: string;
}

export interface OngoingQuiz {
  id: string;
  startedAt: string;
  isShowingCorrectAnswer: boolean;
  currentSlide: number;
  quiz: Quiz;
  quizId: string;
  quizHost: string;
  participants: { [id: string]: Participant };
}
export interface Participant {
  answers: Array<{
    slideNumber: number;
    answer: string[];
    time: string;
  }>;
  hasAnswered: boolean;
  avatar: string;
  name: string;
  participantId: string;
  score: number[];
}

export type Slide = InfoSlide | ScoreSlide | QuestionSlide;

export type QuestionSlide = MCQSASlide | MCQMASlide | FASlide | RankSlide;
