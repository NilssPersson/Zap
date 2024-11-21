import { useState, useEffect } from "react";
import { ref, onValue, off, get, set, update, DataSnapshot } from "firebase/database";
import { database } from "@/firebase";
import { Participant, Slide } from "@/models/Quiz";

export const ParticipantService = {
  async checkIfGameExists(quizCode: string): Promise<boolean> {
    const quizRef = ref(database, `ongoingQuizzes/${quizCode}`);
    const quizSnap = await get(quizRef);
    return quizSnap.exists();
  },

  async participantExists(quizCode: string, participantId: string): Promise<boolean> {
    const participantRef = ref(database, `ongoingQuizzes/${quizCode}/participants/${participantId}`);
    const participantSnap = await get(participantRef);
    return participantSnap.exists();
  },

  async addParticipant(quizCode: string, name: string, avatar: string): Promise<string | null> {
    const participantId = crypto.randomUUID();
    const quizExists = await this.checkIfGameExists(quizCode);

    if (!quizExists) {
      console.error("Game does not exist");
      return null;
    }

    const participantRef = ref(database, `ongoingQuizzes/${quizCode}/participants/${participantId}`);
    const payload = {
      score: 0,
      hasAnswered: false,
      answers: [],
      name,
      avatar,
      participantId,
    };

    try {
      await set(participantRef, payload);
      return participantId;
    } catch (error) {
      console.error("Error adding participant:", error);
      return null;
    }
  },

  async addAnswer(
    quizCode: string,
    participantId: string,
    answer: string[],
    slideNumber: number
  ): Promise<boolean> {
    const participantExists = await this.participantExists(quizCode, participantId);

    if (!participantExists) {
      console.error("Participant does not exist in quiz");
      return false;
    }

    const participantRef = ref(database, `ongoingQuizzes/${quizCode}/participants/${participantId}`);
    const participantSnap = await get(participantRef);

    if (!participantSnap.exists()) {
      console.error("Participant data not found");
      return false;
    }

    const participantData = participantSnap.val();
    const updatedAnswers = [
      ...(participantData.answers || []),
      { slideNumber, answer, time: new Date().toISOString() },
    ];

    try {
      await update(participantRef, {
        answers: updatedAnswers,
        hasAnswered: true,
      });
      return true;
    } catch (error) {
      console.error("Error updating the answer:", error);
      return false;
    }
  },

  async removeParticipant(quizCode: string, participantId: string): Promise<boolean> {
    const participantRef = ref(database, `ongoingQuizzes/${quizCode}/participants/${participantId}`);
    try {
      await set(participantRef, null);
      return true;
    } catch (error) {
      console.error("Error removing participant:", error);
      return false;
    }
  },

  async getParticipant(quizCode: string, participantId: string): Promise<Participant | null> {
    const participantRef = ref(database, `ongoingQuizzes/${quizCode}/participants/${participantId}`);
    const participantSnap = await get(participantRef);
    return participantSnap.exists() ? participantSnap.val() : null;
  },

  async getQuizSlides(quizCode: string): Promise<Slide[]> {
    const slidesRef = ref(database, `ongoingQuizzes/${quizCode}/quiz/slides`);
    const slidesSnap = await get(slidesRef);
    return slidesSnap.exists() ? slidesSnap.val() : [];
  },
};

// Custom Hook: useGameStatus
export const useGameStatus = (quizCode: string, participantId: string) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [participantData, setParticipantData] = useState<Participant | null>(null);

  useEffect(() => {
    const slideRef = ref(database, `ongoingQuizzes/${quizCode}/currentSlide`);
    const participantRef = ref(database, `ongoingQuizzes/${quizCode}/participants/${participantId}`);

    const handleSlideChange = (snapshot: DataSnapshot) => {
      setCurrentSlide(snapshot.exists() ? snapshot.val() : 0);
    };

    const handleParticipantChange = (snapshot: DataSnapshot) => {
      setParticipantData(snapshot.exists() ? snapshot.val() : null);
    };

    onValue(slideRef, handleSlideChange);
    onValue(participantRef, handleParticipantChange);

    return () => {
      off(slideRef, "value", handleSlideChange);
      off(participantRef, "value", handleParticipantChange);
    };
  }, [quizCode, participantId]);

  return { currentSlide, participantData };
};
