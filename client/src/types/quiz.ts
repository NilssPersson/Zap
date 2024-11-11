export type SlideType = "info" | "score" | "question";
export type QuestionType = "MCQSA" | "MCQMA" | "FA";

interface BaseSlide {
    id: string;
    title: string;
    content?: string;
    imageUrl?: string;
    type: SlideType;
}

interface InfoSlide extends BaseSlide {
    type: "info";
}

interface ScoreSlide extends BaseSlide {
    type: "score";
    mockScores?: { playerName: string; score: number }[];
}

interface QuestionSlideBase extends BaseSlide {
    type: "question";
    questionType: QuestionType;
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

export type Slide = InfoSlide | ScoreSlide | MCQSASlide | MCQMASlide | FASlide; 