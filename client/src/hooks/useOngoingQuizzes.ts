import { useState, useCallback } from "react";
import { quizOngoingApi } from "@/api/quizOngoing";
import QuizOngoing from "@/models/QuizOngoing";

export function useOngoingQuiz() {
  const [ongoingQuiz, setOngoingQuiz] = useState<QuizOngoing | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch ongoing quiz by quiz code
  const fetchOngoingQuiz = useCallback(async (quizCode: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await quizOngoingApi.getOngoingQuiz(quizCode);

      if (response.error) {
        setError("Error fetching ongoing quiz");
        setOngoingQuiz(null);
      } else {
        setOngoingQuiz(response.data);
      }
    } catch (err) {
      setError("An unexpected error occurred" + err);
      setOngoingQuiz(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Hook to fetch ongoing quiz when needed
  const getOngoingQuiz = async (quizCode: string) => {
    if (!quizCode) {
      setError("Quiz code is required.");
      setOngoingQuiz(null);
      return;
    }

    fetchOngoingQuiz(quizCode);
  };

  // Return the ongoing quiz data, loading state, and any errors
  return { ongoingQuiz, isLoading, error, getOngoingQuiz };
}
