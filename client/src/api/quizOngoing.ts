import QuizOngoing from "@/models/QuizOngoing";
import { ApiResponse, BaseAPI } from "./base";

class QuizOngoingApi extends BaseAPI<QuizOngoing> {
  constructor() {
    super("QuizOngoing");
  }

  // Method to check if an ongoing quiz exists by quiz code
  async checkOngoingQuizByCode(quizCode: string): Promise<ApiResponse<boolean>> {
    const { data, error } = await this.client
      .from("QuizOngoing")
      .select("id") // Fetch only the ID for existence check
      .eq("quiz_code", quizCode)
      .limit(1);

    return { data: data && data.length > 0, error };
  }
}

export const quizOngoingApi = new QuizOngoingApi();
