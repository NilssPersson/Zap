import Participant from "@/models/QuizOngoing";
import { ApiResponse, BaseAPI } from "./base";

class ParticipantApi extends BaseAPI<ParticipantApi> {
  constructor() {
    super("Participant");
  }

  // Method to add a participant to an ongoing quiz and link it in the QuizParticipants table
  async addQuizParticipant(
    quizCode: string,
    participantName: string,
    avatar: string | null
  ): Promise<ApiResponse<Participant>> {
    // First, fetch the ongoing quiz ID by quiz code
    const { data: ongoingQuizData, error: quizError } = await this.client
      .from("QuizOngoing")
      .select("id")
      .eq("quiz_code", quizCode)
      .single();

    if (quizError || !ongoingQuizData) {
      return { data: null, error: quizError || "Quiz not found" };
    }

    const ongoingQuizId = ongoingQuizData.id;

    // Next, add the participant to the Participant table
    const { data: participantData, error: participantError } = await this.client
      .from("Participant")
      .insert({
        name: participantName,
        avatar,
        quiz_id: ongoingQuizId,
      })
      .select("*")
      .single();

    if (participantError || !participantData) {
      return { data: null, error: participantError };
    }

    // Link the participant in the QuizParticipants table
    const { error: linkError } = await this.client.from("QuizParticipants").insert({
      ongoing_quiz_id: ongoingQuizId,
      participant_id: participantData.id,
    });

    if (linkError) {
      return { data: null, error: linkError };
    }

    // Return the added participant
    return { data: participantData, error: null };
  }
}

export const participantApi = new ParticipantApi();
