import { useState, useCallback } from "react";
import { quizOngoingApi } from "@/api/quizOngoing";
import QuizOngoing from "@/models/QuizOngoing";
import { QuizParticipants } from "@/models/Participant";

export function useOngoingQuiz() {
  const [ongoingQuiz, setOngoingQuiz] = useState<QuizOngoing | null>(null);
  const [quizParticipants, setQuizParticipants] = useState<QuizParticipants[] | null>(
    null
  );
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

  // Hook to create ongoing quiz
  const createOngoingQuiz = useCallback(async (quizHost: string, quizId: string) => {
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
        const response = await quizOngoingApi.createOngoingQuiz(quizHost, quizId);

        if (response.error) {
          setError("Error creating ongoing quiz");
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
    },
    []);

  const getParticipants = useCallback(async (ongoingQuizId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await quizOngoingApi.getParticipants(ongoingQuizId);

      if (response.error) {
        setError("Error fetching participant: " + response.error);
        setQuizParticipants(null);
      } else {
        setQuizParticipants(response.data);
      }
    } catch (err) {
      setError("An unexpected error occurred: " + err);
      setQuizParticipants(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Return the ongoing quiz data, loading state, and any errors
  return {
    ongoingQuiz,
    quizParticipants,
    isLoading,
    error,
    getOngoingQuiz,
    getParticipants,
    createOngoingQuiz,
  };
}
