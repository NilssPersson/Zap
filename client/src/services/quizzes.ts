import { quizDefaults } from "@/components/quiz-editor/utils/quiz-defaults";
import { BaseService, FirebaseResponse } from "./base";
import Quiz, { SharedQuizzes, UserQuizzes } from "@/models/Quiz";
import { query, orderByChild, equalTo, get,ref, set, limitToFirst } from "firebase/database";
import { database } from "@/firebase";
import { nanoid } from 'nanoid';

class QuizService extends BaseService<Quiz> {
  constructor() {
    super("quizzes");
  }

  async createQuiz(quiz: Partial<Quiz>): Promise<FirebaseResponse<UserQuizzes>> {
    if(!quiz.user_id || !quiz.quiz_name) return { data: null, error: new Error('User ID is required') };
    const quizId = nanoid();

    const userQuizRef = ref(database, `userQuizzes/${quizId}`);
    const userQuiz = {
      userId: quiz.user_id,
      quizId: quizId,
      quizName: quiz.quiz_name,
      isHosted: false,
      isShared: false,
      createdAt: new Date().toISOString().toLocaleString(),
      updatedAt: new Date().toISOString().toLocaleString(),
    }
    
    const quizRef = ref(database, `quizzes/${quizId}`);
    await set(quizRef, {
      ...quiz,
      id: quizId,
      created_at: new Date().toISOString().toLocaleString(),
      updated_at: new Date().toISOString().toLocaleString(),
      settings: {
        ...quizDefaults
      }
    })
    
    return await set(userQuizRef, userQuiz).then(() => {
      return { data: { ...userQuiz }, error: null };
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
      const quizzes = Object.values(data) as SharedQuizzes[]; 

      // Filter out quizzes belonging to the user
      const filteredQuizzes = quizzes.filter(quiz => quiz.userId !== userId);
  
      return { data: filteredQuizzes, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async listUserQuizzes(userId: string): Promise<FirebaseResponse<UserQuizzes[]>> {
    const userQuizzesRef = query(
      ref(database, 'userQuizzes'),
      orderByChild("userId"),
      equalTo(userId),
    );
    
    try {
      const snapshot = await get(userQuizzesRef); 
      if (!snapshot.exists()) {
        console.log('No data found')
        return { data: null, error: null }; 
      }
      const data = snapshot.val();
      const quizzes = Object.values(data) as UserQuizzes[]; 
  
      return { data: quizzes, error: null };
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