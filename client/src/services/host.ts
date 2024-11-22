// Skapa och lyssna på pågående quiz answer och uppdatera

import { useState, useEffect } from "react";
import {
  ref,
  off,
  onValue,
  runTransaction,
  update,
  set,
  get,
  DataSnapshot,
} from "firebase/database";
import { database } from "@/firebase";
import Quiz, { QuestionSlide, answerTypes, Participant, OngoingQuiz } from "@/models/Quiz";
import { LatestScore } from "@/pages/HostLogic";
import { useAppContext } from "@/contexts/App/context";

export const useOngoingQuiz = () => {
  const [quizCode, setQuizCode] = useState("");
  const [participants, setPaticipants] = useState<Participant[]>();
  const [totalAnswers, setTotalAnswers] = useState(0);
  const { ongoingQuizzes: { resources: ongoingQuizzes } } = useAppContext();

  useEffect(() => {
    if (!quizCode) return;
    const participantsRef = ref(
      database,
      `ongoingQuizzes/${quizCode}/participants`
    );

    const handleQuizChange = (snapshot: DataSnapshot) => {
      if (snapshot.exists()) {
        const participantsObj = snapshot.val() as Record<string, Participant>;
        const newParticipants = Object.values(participantsObj);
        setPaticipants(newParticipants);
        // Count number of answeres
        const total = newParticipants.filter(
          (participant) => participant.hasAnswered
        ).length;
        setTotalAnswers(total);
        console.log("Set total answers to: ", total);
      } else {
        console.error("No participants found");
        setPaticipants([]);
      }
    };

    onValue(participantsRef, handleQuizChange);

    return () => {
      off(participantsRef, "value", handleQuizChange);
    };
  }, [quizCode]);

  const resetHasAnswered = async (quizCode: string) => {
    // Reference to all participants
    const participantRef = ref(
      database,
      `ongoingQuizzes/${quizCode}/participants/`
    );

    // Get all participants to update
    if (participants) {
      const updates: { [key: string]: any } = {};
      participants.forEach((participant: any) => {
        updates[
          `ongoingQuizzes/${quizCode}/participants/${participant.participantId}/hasAnswered`
        ] = false;
        console.log("Reset answer for participant:", participant.participantId);
      });
      
      // Apply the updates to all participants
      await update(ref(database), updates);
      const snapshot = await get(participantRef);
      const participantsObj = snapshot.val() as Record<string, Participant>;
      const newParticipants = Object.values(participantsObj);
      setPaticipants(newParticipants);
    } else {
      console.log("No participants found");
    }
  };

  // Function to update question number in Firebase
  const incrementSlide = async (quizCode: string) => {
    const slideOrderRef = ref(
      database,
      `ongoingQuizzes/${quizCode}/currentSlide`
    );
    try {
      // Increment CurrentSlideOrder by 1
      await runTransaction(slideOrderRef, (currentValue) => {
        return currentValue + 1;
      });
      console.log("CurrentSlideOrder incremented");

      await resetHasAnswered(quizCode);
      console.log("All participants' answers reset successfully");
    } catch (error) {
      console.error(
        "Error updating CurrentSlideOrder or resetting participants:",
        error
      );
    }
    const ongoingQuiz = await get(ref(database, `ongoingQuizzes/${quizCode}`));
    return ongoingQuiz.val();
  };

  const calculateScore = (
    question: QuestionSlide,
    participant: Participant,
    updates: any
  ) => {
    if(!participant.answers){
        return updates;
    }
    const participantAnswer =
      participant.answers[participant.answers.length - 1].answer;
      const currentScore = participant.score[participant.score.length]
        ? participant.score[participant.score.length]
        : 0;
    switch (question.answerType) {
      case answerTypes.singleString: {
        const correctAnswer = question.options
          .filter((option) => option.isCorrect) 
          .map((option) => option.text);

        if (participantAnswer[0] === correctAnswer[0]) {
          const newScore = currentScore + 1000;
          updates[`${participant.participantId}/score`] = newScore;
          console.log("Correct answer");
        }else{console.log("wrong answer")}
        return updates;
      }
      // Todo, handle spelling mistakes etc.
      case answerTypes.freeText: {
        const correctAnswer = question.correctAnswer;
        if (participantAnswer[0] === correctAnswer[0]) {
          const newScore = currentScore + 1000;
          updates[`${participant.participantId}/score`] = newScore;
        }
        return updates;
      }
      // The answers should be the same without considering order
      case answerTypes.multipleStrings: {
         const correctAnswer = question.options
           .filter((option) => option.isCorrect)
           .map((option) => option.text);
        if (participantAnswer.length !== correctAnswer.length) {
          return updates;
        }
        // Sort both arrays and compare
        const sortedParticipantAnswers = [...participantAnswer].sort(
          (a: any, b: any) => a - b
        );
        const sortedQuestionAnswers = [...correctAnswer].sort(
          (a: any, b: any) => a - b
        );

        const isAnswerCorrect = sortedParticipantAnswers.every(
          (value, index) => value === sortedQuestionAnswers[index]
        );
        if (isAnswerCorrect) {
          const newScore = currentScore + 1000;
          return (updates[`${participant.participantId}/score`] = newScore);
        } else {
          return updates;
        }
      }
      // The answers should be the same, with regard to order
      case answerTypes.rank: {
        const correctAnswer = question.ranking;
        if (participantAnswer.length !== correctAnswer.length) {
          return updates;
        }
        for (let i = 0; i < participantAnswer.length; i++) {
          if (participantAnswer[i] !== correctAnswer[i]) {
            return updates;
          }
        }
        const newScore = currentScore + 1000;
        return (updates[`${participant.participantId}/score`] = newScore);
      }
      default: {
        return updates;
      }
    }
  };

  const updateScore = async (
    quizCode: string,
    currentQuestion: QuestionSlide
  ) => {
    const participantRef = ref(
      database,
      `ongoingQuizzes/${quizCode}/participants/`
    );
    const participantsSnapshot = await get(participantRef);
    if (participantsSnapshot.exists()) {
      var updates: { [key: string]: any } = {};

      participantsSnapshot.forEach((participantSnap: any) => {
        const participant = participantSnap.val() as Participant;

        updates = calculateScore(currentQuestion, participant, updates);
      });
      try {
        console.log("Updating scores with", updates)
        await update(
          ref(database, `ongoingQuizzes/${quizCode}/participants/`),
          updates
        );

        console.log("Scores updated and answers reset successfully.");
      } catch (error) {
        console.error("Error updating participants score", error);
      }
    } else {
      console.log("No participants found");
    }
  };

  const getScore = async (quizCode: string): Promise<LatestScore[]> => {
    const participantRef = ref(
      database,
      `ongoingQuizzes/${quizCode}/participants/`
    );

    try {
      const participantsSnapshot = await get(participantRef);

      if (participantsSnapshot.exists()) {
        const latestScores: LatestScore[] = [];

        participantsSnapshot.forEach((participantSnap: any) => {
          const participant = participantSnap.val(); // Get participant data

          latestScores.push({
            id: participant.participantId,
            score: participant.score || 0, // Default score to 0 if not set
          });
        });

        return latestScores;
      } else {
        console.log("No participants found");
        return [];
      }
    } catch (error) {
      console.error("Error retrieving participants' scores", error);
      return [];
    }
  };

  const generateQuizCode = async (): Promise<string> => {
    let quizCode = "";
    let isUnique = false;

    while (!isUnique) {
      // Generate a random 4-letter code
      quizCode = Array.from({ length: 4 }, () =>
        String.fromCharCode(65 + Math.floor(Math.random() * 26))
      ).join("");

      const quizRef = ref(database, `ongoingQuizzes/${quizCode}`);
      const quiz = await get(quizRef);
      if (await !quiz.exists()) {
        isUnique = true;
        return quizCode;
      }
    }
    setQuizCode(quizCode);
    return quizCode;
  };

  async function createOngoingQuiz(_quiz: Quiz): Promise<any> {
    const db = database;
    const quizCode = await generateQuizCode();

    console.log(_quiz);

    const quiz = {
      currentSlide: 0,
      quiz: _quiz,
      quizId: _quiz.id,
      quizHost: _quiz.user_id,
      participants: {},
      startedAt: new Date().toISOString().toLocaleString(),
    };
    try {
      await set(ref(db, "ongoingQuizzes/" + quizCode), quiz);
      return quizCode;
    } catch (error) {
      console.error("Failed to create ongoing quiz", error);
    }
  }

  function getOngoingQuiz(quizCode: string): OngoingQuiz | undefined {
    return ongoingQuizzes.find(q => q.id === quizCode);
  }

  async function setIsShowingAnswer(
    quizCode: string,
    entry: boolean
  ): Promise<any> {
    const quizRef = ref(
      database,
      `ongoingQuizzes/${quizCode}/isShowingAnswer/`
    );
    await set(quizRef, entry);
  }

  return {
    quizCode,
    participants,
    totalAnswers,
    createOngoingQuiz,
    generateQuizCode,
    incrementSlide,
    getOngoingQuiz,
    updateScore,
    getScore,
    setIsShowingAnswer,
  };
};
