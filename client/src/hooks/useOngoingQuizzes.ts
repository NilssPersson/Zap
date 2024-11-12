import { useState, useCallback } from "react";
import { quizOngoingApi } from "@/api/quizOngoing";
import QuizOngoing from "@/models/QuizOngoing";

export function useOngoingQuiz() {
  const [ongoingQuiz, setOngoingQuiz] = useState<QuizOngoing | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hook to fetch ongoing quiz
  const getOngoingQuiz = async (quizCode: string) =>{
      setIsLoading(true);
      setError(null);

      try {
        const response = await quizOngoingApi.getOngoingQuiz(quizCode);

        if (response.error) {
          setError("Error fetching ongoing quiz");
          setOngoingQuiz(null);
        } else {
          setOngoingQuiz(response.data);
          setIsLoading(false);
          return response.data;
        }
      } catch (err) {
        setError("An unexpected error occurred" + err);
        setOngoingQuiz(null);
      } 
       finally {
        setIsLoading(false);
      }
  };

  // Hook to create ongoing quiz
  const createOngoingQuiz = useCallback(
    async (quizHost: string, quizId: string) => {
      if (!quizHost) {
        setError("Quiz host is required.");
        setOngoingQuiz(null);
        return;
      }
      if (!quizId) {
        setError("Quiz id is required.");
        setOngoingQuiz(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await quizOngoingApi.createOngoingQuiz(
          quizHost,
          quizId
        );

        if (response.error) {
          setError("Error creating ongoing quiz");
          setOngoingQuiz(null);
        } else {
          setOngoingQuiz(response.data);
          setIsLoading(false);
          return response.data;
        }
      } catch (err) {
        setError("An unexpected error occurred" + err);
        setOngoingQuiz(null);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getParticipants = useCallback(async (ongoingQuizId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await quizOngoingApi.getParticipants(ongoingQuizId);

      if (response.error) {
        setError("Error fetching participant: " + response.error);
      } else {
        setIsLoading(false);
        return response.data;
      }
    } catch (err) {
      setError("An unexpected error occurred: " + err);
    } finally {
      setIsLoading(false);
    }
    return null;
  }, []);

  // Return the ongoing quiz data, loading state, and any errors
  return {
    ongoingQuiz,
    isLoading,
    error,
    getOngoingQuiz,
    getParticipants,
    createOngoingQuiz,
  };
}
