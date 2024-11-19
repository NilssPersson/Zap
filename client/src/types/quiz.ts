import type { BackgroundStyle } from "@/components/quiz-editor/QuizBackground";
import {ScoreSlideInterface} from "@/components/quiz-editor/slide-master/master-score"

export type SlideType = "info" | "score" | "question" | "rank";
export type QuestionType = "MCQSA" | "MCQMA" | "FA";

export interface BaseSlide {
    id: string;
    title: string;
    content?: string;
    imageUrl?: string;
    imageScale?: number;
    backgroundStyle?: BackgroundStyle;
}

export interface InfoSlide extends BaseSlide {
    type: "info";
}

export interface RankSlide extends BaseSlide {
    ranking: { name: string; score: number }[]; // List of items with name and score// Sort order: true for ascending, false for descending
    type: "rank";
    timeLimit: number;
  }
   
export interface QuestionSlideBase extends BaseSlide {
    type: "question";
    questionType: QuestionType;
    timeLimit: number; // in seconds, 0 means no limit
}

export interface MCQSASlide extends QuestionSlideBase {
    questionType: "MCQSA";
    options: Array<{
        id: string;
        text: string;
        isCorrect: boolean;
    }>;
}

export interface MCQMASlide extends QuestionSlideBase {
    questionType: "MCQMA";
    options: Array<{
        id: string;
        text: string;
        isCorrect: boolean;
    }>;
}

export interface FASlide extends QuestionSlideBase {
    questionType: "FA";
    correctAnswer: string;
}



export type Slide = InfoSlide | ScoreSlideInterface | MCQSASlide | MCQMASlide | FASlide | RankSlide;