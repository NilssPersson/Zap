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

export type Slide = InfoSlide | ScoreSlide | MCQSASlide | MCQMASlide | FASlide | RankSlide; 

export type { OngoingQuiz, Participant };