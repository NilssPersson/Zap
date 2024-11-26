import useGetAuthenticatedUser from "@/hooks/useGetAuthenticatedUser";

import { useOngoingQuizzes } from "@/hooks/useOngoingQuizzes";
import { AppContext } from "./context";
import { useQuizzes } from "@/hooks/useQuizzes";
import { useCallback } from "react";
import { useUsers } from "@/hooks/useUsers";

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

  const { resources: users, isLoading: usersLoading } = useUsers();

  const endQuiz = useCallback(async (quizCode: string) => {
    const onGoingQuiz = ongoingQuizzes.find(quiz => quiz.id === quizCode);
    if (!onGoingQuiz) return false;

    const [{ error: deleteError }, { error: updateError }] = await Promise.all([
      deleteOngoingQuiz(quizCode),
      updateQuiz(onGoingQuiz.quiz.id, { isHosted: false })
    ]);

    if (deleteError || updateError) {
      console.error(deleteError, updateError);
      return false;
    }

    return true;
  }, [deleteOngoingQuiz, ongoingQuizzes, updateQuiz]);

  return <AppContext.Provider value={{
    ongoingQuizzes: {
      resources: ongoingQuizzes,
      isLoading: ongoingQuizzesLoading,
      optimisticCreate: createOngoingQuiz,
      optimisticDelete: deleteOngoingQuiz,
      optimisticUpdate: updateOngoingQuiz,
      endQuiz
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
    },
    users: {
      resources: users,
      isLoading: usersLoading
    }
  }}>{children}</AppContext.Provider>;
};