import { ApiResponse, BaseAPI } from "./base";
import Quiz from "@/models/Quiz";

class QuizAPI extends BaseAPI<Quiz> {
  constructor() {
    super("Quiz");
  }

  // Add Quiz-specific methods here
  async getByUserId(userId: string): Promise<ApiResponse<Quiz[]>> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select("*")
      .eq("user_id", userId);

    return { data: data as Quiz[], error };
  }
}

export const quizAPI = new QuizAPI(); 