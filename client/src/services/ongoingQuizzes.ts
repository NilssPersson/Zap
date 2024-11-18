import { OngoingQuiz } from "@/types/quiz";
import { BaseService, FirebaseResponse } from "./base";
import { query, orderByChild, equalTo, get, endAt, startAt } from "firebase/database";

class OngoingQuizzesService extends BaseService<OngoingQuiz> {
    constructor() {
        super("ongoingQuizzes");
    }

    async getByUserId(userId: string): Promise<FirebaseResponse<OngoingQuiz[]>> {
        const quizzesRef = query(this.getRef(), orderByChild("quizHost"), equalTo(userId));
        const snapshot = await get(quizzesRef);
        return { data: this.transformFirebaseResponse(snapshot.val()), error: null };
    }

    async clean(userId: string) {
        const quizzesRef = query(
            this.getRef(), 
            orderByChild("quizHost"),
            startAt(userId),
            endAt(userId),
            orderByChild("startedAt"),
            startAt(new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString().toLocaleString())
        );

        console.log(quizzesRef);

        const snapshot = await get(quizzesRef);
        console.log(snapshot.val());
        return this.transformFirebaseResponse(snapshot.val());
    }
}

export const ongoingQuizzesService = new OngoingQuizzesService();