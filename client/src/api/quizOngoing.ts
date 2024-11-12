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

  async generateQuizCode(): Promise<string> {
    let quizCode = "";
    let isUnique = false;

    while (!isUnique) {
      // Generate a random 4-letter code
      quizCode = Array.from({ length: 4 }, () =>
        String.fromCharCode(65 + Math.floor(Math.random() * 26))
      ).join("");

      // Check if the code already exists in the QuizOngoing table
      const { error } = await this.client
        .from("QuizOngoing")
        .select("quiz_code")
        .eq("quiz_code", quizCode)
        .single();

      if (error && error.code === "PGRST116") {
        // Code not found, it's unique
        isUnique = true;
      } else if (error) {
        console.error("Error checking quiz code:", error);
        throw error;
      }
    }
    return quizCode;
  }

  async createOngoingQuiz(
    //TODO: Check that a user can only host one game at a time
    quizHost: string,
    quizId: string
  ): Promise<ApiResponse<QuizOngoing>> {
    const quizCode = await this.generateQuizCode();
    const { data, error } = await this.client
      .from("QuizOngoing")
      .insert([
        {
          quiz_code: quizCode,
          host_user_id: quizHost,
          created_quiz_id: quizId,
          started_at: new Date().toISOString,
          current_slide_order: 0,
        },
      ])
      .select()
      .single();
    console.log("createongoing: ", data);
    return { data: data, error };
  }

  async getParticipants(
    ongoingQuizId: string
  ): Promise<ApiResponse<QuizParticipants[]>> {
    const { data, error } = await this.client
      .from("QuizParticipants")
      .select("*")
      .eq("ongoing_quiz_id", ongoingQuizId);

    return { data: data, error };
  }
}

export const quizOngoingApi = new QuizOngoingApi();
