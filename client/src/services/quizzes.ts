import { quizDefaults } from "@/components/quiz-editor/utils/quiz-defaults";
import { BaseService, FirebaseResponse } from "./base";
import Quiz, { SharedQuizzes } from "@/models/Quiz";
import { query, orderByChild, equalTo, get,ref, set, limitToFirst } from "firebase/database";
import { database } from "@/firebase";
import { nanoid } from 'nanoid';

class QuizService extends BaseService<Quiz> {
  constructor() {
    super("quizzes");
  }

  async create(quiz: Quiz): Promise<FirebaseResponse<Quiz>> {

    const quizId = nanoid();

    const userQuizRef = ref(database, `userQuizzes/${quizId}`);
    
    await set(userQuizRef, {
      userId: quiz.user_id,
      quizId: quizId,
      quizName: quiz.quiz_name,
      isHosted: false,
      isShared: false,
      createdAt: new Date().toISOString().toLocaleString(),
      updatedAt: new Date().toISOString().toLocaleString(),
    });
    
    const quizRef = ref(database, `quizzes/${quizId}`);
    return await set(quizRef, {
      ...quiz,
      id: quizId,
      created_at: new Date().toISOString().toLocaleString(),
      updated_at: new Date().toISOString().toLocaleString(),
      isHosted: false,
      isShared: false,
      settings: {
        ...quizDefaults
      }
    }).then(() => {
      return { data: { ...quiz, id: quizId }, error: null };
    }).catch((error) => {
      return { data: null, error: error as Error };
    });

  }

  async update(id: string, quiz: Partial<Quiz>): Promise<FirebaseResponse<Quiz>> {
    return super.update(id, {
      ...quiz,
      updated_at: new Date().toISOString().toLocaleString(),
    });
  }

  async listShared(userId: string): Promise<FirebaseResponse<SharedQuizzes[]>> {
    const sharedQuizzesRef = query(
      ref(database, 'sharedQuizzes'),
      orderByChild("userId"),
      limitToFirst(10), // TODO: Fetch more dynamically
    );
    
    try {
      const snapshot = await get(sharedQuizzesRef); 
      if (!snapshot.exists()) {
        console.log('No data found')
        return { data: null, error: null }; 
      }
      const data = snapshot.val();
      const quizzes = Object.values(data) as SharedQuizzes[]; // Convert snapshot data into an array of quizzes

      // Filter out quizzes belonging to the user
      const filteredQuizzes = quizzes.filter(quiz => quiz.userId === userId);
  
      return { data: filteredQuizzes, error: null };
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