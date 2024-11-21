import useGetAuthenticatedUser from "@/hooks/useGetAuthenticatedUser";

import { useOngoingQuizzes } from "@/hooks/useOngoingQuizzes";
import { AppContext } from "./context";
import { useQuizzes } from "@/hooks/useQuizzes";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  
    const { user, updateUser } = useGetAuthenticatedUser();
    
    const {
      resources: ongoingQuizzes,
      isLoading: ongoingQuizzesLoading,
      optimisticCreate: createOngoingQuiz,
      optimisticDelete: deleteOngoingQuiz,
      optimisticUpdate: updateOngoingQuiz
    } = useOngoingQuizzes();
  
    const {
      resources: quizzes,
      isLoading: quizzesLoading,
      optimisticCreate: createQuiz,
      optimisticDelete: deleteQuiz,
      optimisticUpdate: updateQuiz
    } = useQuizzes();
  
    return <AppContext.Provider value={{
      ongoingQuizzes: {
        resources: ongoingQuizzes,
        isLoading: ongoingQuizzesLoading,
        optimisticCreate: createOngoingQuiz,
        optimisticDelete: deleteOngoingQuiz,
        optimisticUpdate: updateOngoingQuiz
      },
      quizzes: {
        resources: quizzes,
        isLoading: quizzesLoading,
        optimisticCreate: createQuiz,
        optimisticDelete: deleteQuiz,
        optimisticUpdate: updateQuiz
      },
      user: {
        user,
        updateUser
      }
    }}>{children}</AppContext.Provider>;
  };