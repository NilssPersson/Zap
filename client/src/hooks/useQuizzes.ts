import { quizAPI } from "@/api/quizzes";
import { createOptimisticResourceHook } from "./useOptimisticResource";
import Quiz from "@/models/Quiz";

const useQuizzes = createOptimisticResourceHook<Quiz>({
  api: quizAPI,
  userScoped: true
});

export { useQuizzes };