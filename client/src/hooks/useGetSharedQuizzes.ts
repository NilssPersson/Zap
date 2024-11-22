import { quizService } from "@/services/quizzes";
import { createResourceHook } from "./useResource";

const useGetSharedQuizzes = (userId: string) => createResourceHook({
    firebasePromise: quizService.listShared(userId)
})();

export { useGetSharedQuizzes };