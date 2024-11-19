import { ongoingQuizzesService} from "@/services/ongoingQuizzes";
import { createOptimisticResourceHook } from "./useOptimisticResource";
import { OngoingQuiz } from "@/models/Quiz";

const useOngoingQuizzes = createOptimisticResourceHook<OngoingQuiz>({
  api: ongoingQuizzesService,
  userScoped: true
});

export { useOngoingQuizzes };