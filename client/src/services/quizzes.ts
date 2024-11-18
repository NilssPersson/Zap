import { BaseService, FirebaseResponse } from "./base";
import Quiz from "@/models/Quiz";
import { query, orderByChild, equalTo, get } from "firebase/database";

class QuizService extends BaseService<Quiz> {
  constructor() {
    super("quizzes");
  }

  async getByUserId(userId: string): Promise<FirebaseResponse<Quiz[]>> {
    try {
      const userQuizzesRef = query(
        this.getRef(),
        orderByChild("user_id"),
        equalTo(userId)
      );
      
      try {
        const snapshot = await get(userQuizzesRef);
        return { 
          data: this.transformFirebaseResponse(snapshot.val()),
          error: null 
        };
      } catch (getError) {
        console.error('Error getting snapshot:', getError);
        throw getError;
      }
    } catch (error) {
      console.error('Overall error:', error);
      return { data: null, error: error as Error };
    }
  }
}

export const quizService = new QuizService();