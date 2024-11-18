import { OngoingQuiz } from "@/types/quiz";
import { BaseService, FirebaseResponse } from "./base";
import { query, orderByChild, equalTo, get } from "firebase/database";

class OngoingQuizzesService extends BaseService<OngoingQuiz> {
  constructor() {
    super("ongoingQuizzes");
  }

  async getByUserId(userId: string): Promise<FirebaseResponse<OngoingQuiz[]>> {
    const quizzesRef = query(this.getRef(), orderByChild("quizHost"), equalTo(userId));
    const snapshot = await get(quizzesRef);
    return { data: this.transformFirebaseResponse(snapshot.val()), error: null };
  }
}

export const ongoingQuizzesService = new OngoingQuizzesService();