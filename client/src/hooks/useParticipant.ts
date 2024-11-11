import { useState, useCallback } from "react";
import { participantApi } from "@/api/participants";
import Participant from "@/models/QuizOngoing";

export function useParticipant() {
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addParticipant = useCallback(async (quizCode: string, name: string, avatar: string | null): Promise<Participant | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await participantApi.addQuizParticipant(quizCode, name, avatar);

      if (response.error) {
        setError("Error adding participant to the quiz: " + response.error);
        setParticipant(null);
        return null; // Return null if there was an error
      } else {
        setParticipant(response.data);
        return response.data; // Return the created participant
      }
    } catch (err) {
      setError("An unexpected error occurred: " + err);
      setParticipant(null);
      return null; // Return null if an exception occurred
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getParticipant = useCallback(async (participantId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await participantApi.getParticipant(participantId);

      if (response.error) {
        setError("Error fetching participant: " + response.error);
        setParticipant(null);
      } else {
        setParticipant(response.data);
      }
    } catch (err) {
      setError("An unexpected error occurred: " + err);
      setParticipant(null);
    } finally {
      setIsLoading(false);
    }
  }
    , []);

  return { participant, isLoading, error, addParticipant, getParticipant };
}
