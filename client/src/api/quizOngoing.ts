import QuizOngoing from "@/models/QuizOngoing";
import { ApiResponse, BaseAPI } from "./base";

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

}

export const quizOngoingApi = new QuizOngoingApi();
