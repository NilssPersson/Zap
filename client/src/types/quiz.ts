import type { BackgroundStyle } from "@/components/quiz-editor/QuizBackground";

export type SlideType = "info" | "score" | "question" | "rank";
export type QuestionType = "MCQSA" | "MCQMA" | "FA";

interface BaseSlide {
    id: string;
    title: string;
    content?: string;
    imageUrl?: string;
    imageScale?: number;
    backgroundStyle?: BackgroundStyle;
}

interface InfoSlide extends BaseSlide {
    type: "info";
}

interface ScoreSlide extends BaseSlide {
    type: "score";
    mockScores?: { playerName: string; score: number }[];
}

interface RankSlide extends BaseSlide {
    ranking: { name: string; score: number }[]; // List of items with name and score// Sort order: true for ascending, false for descending
    type: "rank";
    timeLimit: number;
  }
  

interface QuestionSlideBase extends BaseSlide {
    type: "question";
    questionType: QuestionType;
    timeLimit: number; // in seconds, 0 means no limit
}

interface MCQSASlide extends QuestionSlideBase {
    questionType: "MCQSA";
    options: Array<{
        id: string;
        text: string;
        isCorrect: boolean;
    }>;
}

interface MCQMASlide extends QuestionSlideBase {
    questionType: "MCQMA";
    options: Array<{
        id: string;
        text: string;
        isCorrect: boolean;
    }>;
}

interface FASlide extends QuestionSlideBase {
    questionType: "FA";
    correctAnswer: string;
}



export type Slide = InfoSlide | ScoreSlide | MCQSASlide | MCQMASlide | FASlide | RankSlide; 