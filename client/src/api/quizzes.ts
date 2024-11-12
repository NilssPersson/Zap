import { ApiResponse, BaseAPI } from "./base";
import Quiz from "@/models/Quiz";
import { BackgroundStyle } from "@/components/quiz-editor/QuizBackground";
import { Slide, QuestionType } from "@/types/quiz";

// Database response types
interface DBSlide {
  id: string;
  type: "info" | "score" | "question";
  title: string;
  content?: string;
  image_url?: string;
  image_scale?: number;
  background_style?: BackgroundStyle;
  InfoSlides?: {
    slide_id: string;
  };
  ScoreSlides?: {
    slide_id: string;
    ScoreSlideMockScores?: Array<{
      id: string;
      player_name: string;
      score: number;
    }>;
  };
  QuestionSlides?: {
    slide_id: string;
    question_type: QuestionType;
    time_limit: number;
    MCQQuestionSlides?: {
      slide_id: string;
      MCQOptions: Array<{
        id: string;
        text: string;
        is_correct: boolean;
      }>;
    };
    FAQuestionSlides?: {
      slide_id: string;
      correct_answer: string;
    };
  };
}

interface QuizSlideResponse {
  slide_order: number;
  Slides: DBSlide;
}

class QuizAPI extends BaseAPI<Quiz> {
  constructor() {
    super("Quiz");
  }

  async getByUserId(userId: string): Promise<ApiResponse<Quiz[]>> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select("*")
      .eq("user_id", userId);

    return { data: data as Quiz[], error };
  }

  async getSlides(quizId: string): Promise<ApiResponse<Slide[]>> {
    const { data, error } = await this.client
      .from('QuizSlides')
      .select(`
        slide_order,
        Slides:slide_id (
          id,
          type,
          title,
          content,
          image_url,
          image_scale,
          background_style,
          InfoSlides:InfoSlides (
            slide_id
          ),
          ScoreSlides:ScoreSlides (
            slide_id,
            ScoreSlideMockScores:ScoreSlideMockScores (
              id,
              player_name,
              score
            )
          ),
          QuestionSlides:QuestionSlides (
            slide_id,
            question_type,
            time_limit,
            MCQQuestionSlides:MCQQuestionSlides (
              slide_id,
              MCQOptions:MCQOptions (
                id,
                text,
                is_correct
              )
            ),
            FAQuestionSlides:FAQuestionSlides (
              slide_id,
              correct_answer
            )
          )
        )
      `)
      .eq('quiz_id', quizId)
      .order('slide_order', { ascending: true });

    if (error) {
      return { data: null, error };
    }

    // Transform the data into Slide[] format
    const slides = (data as unknown as QuizSlideResponse[]).map((quizSlide) => {
      const slide = quizSlide.Slides;
      const baseSlide = {
        id: slide.id,
        title: slide.title,
        content: slide.content,
        imageUrl: slide.image_url,
        imageScale: slide.image_scale,
        backgroundStyle: slide.background_style,
      };

      switch (slide.type) {
        case 'info':
          return {
            ...baseSlide,
            type: 'info' as const,
          };

        case 'score':
          return {
            ...baseSlide,
            type: 'score' as const,
            mockScores: slide.ScoreSlides?.ScoreSlideMockScores?.map((mockScore) => ({
              playerName: mockScore.player_name,
              score: mockScore.score,
            })) ?? [],
          };

        case 'question': {
          const questionSlide = slide.QuestionSlides;
          if (!questionSlide) throw new Error('Question slide data missing');

          const questionBase = {
            ...baseSlide,
            type: 'question' as const,
            questionType: questionSlide.question_type,
            timeLimit: questionSlide.time_limit,
          };

          if (questionSlide.question_type === 'MCQSA' || questionSlide.question_type === 'MCQMA') {
            if (!questionSlide.MCQQuestionSlides?.MCQOptions) {
              throw new Error('MCQ options missing');
            }
            return {
              ...questionBase,
              options: questionSlide.MCQQuestionSlides.MCQOptions.map((option) => ({
                id: option.id,
                text: option.text,
                isCorrect: option.is_correct,
              })),
            };
          } else if (questionSlide.question_type === 'FA') {
            if (!questionSlide.FAQuestionSlides) {
              throw new Error('FA answer missing');
            }
            return {
              ...questionBase,
              correctAnswer: questionSlide.FAQuestionSlides.correct_answer,
            };
          }

          throw new Error(`Invalid question type: ${questionSlide.question_type}`);
        }

        default:
          throw new Error(`Unknown slide type: ${slide.type}`);
      }
    });

    return { data: slides as Slide[], error: null };
  }

  async saveSlides(quizId: string, slides: Slide[]): Promise<ApiResponse<void>> {
    const { error: transactionError } = await this.client.rpc('save_quiz_slides', {
      p_quiz_id: quizId,
      p_slides: slides.map((slide, index) => {
        const baseSlide = {
          type: slide.type,
          title: slide.title,
          content: slide.content,
          image_url: slide.imageUrl,
          image_scale: slide.imageScale,
          background_style: slide.backgroundStyle
        };

        let slideSpecificData = {};

        switch (slide.type) {
          case 'question': {
            const questionData = {
              question_type: slide.questionType,
              time_limit: slide.timeLimit
            };

            if (slide.questionType === 'FA') {
              slideSpecificData = {
                ...questionData,
                fa_data: {
                  correct_answer: slide.correctAnswer
                }
              };
            } else {
              slideSpecificData = {
                ...questionData,
                mcq_data: {
                  options: slide.options.map(opt => ({
                    text: opt.text,
                    is_correct: opt.isCorrect
                  }))
                }
              };
            }
            break;
          }
          case 'score': {
            slideSpecificData = {
              mock_scores: slide.mockScores?.map(score => ({
                player_name: score.playerName,
                score: score.score
              })) ?? []
            };
            break;
          }
          // info slides don't need additional data
        }

        return {
          slide_order: index,
          slide_data: {
            ...baseSlide,
            ...slideSpecificData
          }
        };
      })
    });

    if (transactionError) {
      return { data: null, error: transactionError };
    }

    return { data: undefined, error: null };
  }
}

export const quizAPI = new QuizAPI();