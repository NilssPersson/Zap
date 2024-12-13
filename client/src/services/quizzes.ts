import { quizDefaults } from "@/components/quiz-editor/utils/quiz-defaults";
import { BaseService, FirebaseResponse } from "./base";
import Quiz from "@/models/Quiz";
import { query, orderByChild, equalTo, get, limitToFirst } from "firebase/database";

class QuizService extends BaseService<Quiz> {
  constructor() {
    super("quizzes");
  }

  async create(quiz: Quiz): Promise<FirebaseResponse<Quiz>> {
    return super.create({
      ...quiz,
      isHosted: false,
      isShared: false,
      created_at: new Date().toISOString().toLocaleString(),
      settings: {
        ...quizDefaults
      }
    });
  }

  async update(id: string, quiz: Partial<Quiz>): Promise<FirebaseResponse<Quiz>> {
    return super.update(id, {
      ...quiz,
      updated_at: new Date().toISOString().toLocaleString(),
    });
  }

  async listShared(userId: string): Promise<FirebaseResponse<Quiz[]>> {
    
    const sharedQuizzesRef = query(
      this.getRef(),
      orderByChild("isShared"),
      equalTo(true),
      limitToFirst(3)
    );

    try {
      const { data, error } = await super.list(sharedQuizzesRef);
      if (data === null) {
        return { data: null, error };
      }
      console.log(data);
      return { data: (data as Quiz[]).filter(quiz => quiz.user_id !== userId), error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
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