import { ongoingQuizzesService} from "@/services/ongoingQuizzes";
import { createOptimisticResourceHook } from "./useOptimisticResource";
import { OngoingQuiz } from "@/types/quiz";

const useOngoingQuizzes = createOptimisticResourceHook<OngoingQuiz>({
  api: ongoingQuizzesService,
  userScoped: true
});

export { useOngoingQuizzes };