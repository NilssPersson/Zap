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
  backgroundStyleDefault: BackgroundStyle;
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
  lobby = "lobby",
}

export type SlideType = SlideTypes;

export enum QuestionTypes {
  MCQSA = "MCQSA",
  MCQMA = "MCQMA",
  FTA = "FTA", // Free text answer
  RANK = "RANK",
  FA = "FA", // Fastest answer
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
  embedVideoUrl?: string;
}

export interface LobbySlide extends BaseSlide {
  type: SlideTypes.lobby;
  quizCode: string;
}

export interface ScoreSlide extends BaseSlide {
  type: SlideTypes.score;
}

export enum AnswerTypes {
  singleString = "singleString",
  multipleStrings = "multipleStrings",
  freeText = "freeText",
  rank = "rank",
  speed = "speed",
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
  showCorrectAnswer: ShowCorrectAnswerTypes;
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

export interface FTASLide extends QuestionSlideBase {
  questionType: QuestionTypes.FTA;
  answerType: AnswerTypes.freeText;
  correctAnswer: string;
}

export interface FASlide extends QuestionSlideBase {
  questionType: QuestionTypes.FA;
  answerType: AnswerTypes.speed;
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

export type Slide = InfoSlide | ScoreSlide | QuestionSlide | LobbySlide;

export type QuestionSlide = MCQSASlide | MCQMASlide | FTASLide | RankSlide | FASlide;
