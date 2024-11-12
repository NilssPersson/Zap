import QuizOngoing from "@/models/QuizOngoing";
import { ApiResponse, BaseAPI } from "./base";
import { QuizParticipants } from "@/models/Participant";

class QuizOngoingApi extends BaseAPI<QuizOngoing> {
  constructor() {
    super("QuizOngoing");
  }

  // Method to check if an ongoing quiz exists by quiz code
  async getOngoingQuiz(quizCode: string): Promise<ApiResponse<QuizOngoing>> {
    const { data, error } = await this.client
      .from("QuizOngoing")
      .select("*")
      .eq("quiz_code", quizCode)
      .limit(1);

    return { data: data ? data[0] : null, error };
  }

  async createOngoingQuiz(
    quizHost: string,
    quizId: string
  ): Promise<ApiResponse<QuizOngoing>> {
    const quizCode = "ABCDEF";
    const { data, error } = await this.client
      .from("QuizOngoing")
      .insert([
        {
          quiz_code: quizCode,
          host_user_id: quizHost,
          created_quiz_id: quizId,
          started_at: new Date().toISOString,
          question_number: 0,
        },
      ])
      .select()
      .single();
    return { data: data, error };
  }

  async getParticipants(ongoingQuizId: string): Promise<ApiResponse<QuizParticipants[]>> {
    const { data, error } = await this.client
      .from("QuizParticipants")
      .select("*")
      .eq("ongoing_quiz_id", ongoingQuizId);
      
    return {data: data, error};
  }
}

export const quizOngoingApi = new QuizOngoingApi();
