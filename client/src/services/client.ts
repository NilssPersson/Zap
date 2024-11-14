import { useState, useEffect } from "react";
import { ref, onValue, off, DataSnapshot,get,set } from "firebase/database";
import { database } from "@/firebase";
import { randomUUID } from "crypto";

export const useGameStatus = (quizCode:string) => {
  const [questionNumber, setQuestionNumber] = useState(null);

  useEffect(() => {
    const quizRef = ref(database, `ongoingQuiz/${quizCode}`);

    const handleQuizChange = (snapshot:DataSnapshot) => {
      if (snapshot.exists()) {
        const gameData = snapshot.val();
        setQuestionNumber(gameData.questionNumber);
      } else {
        console.error("Game not found");
      }
    };

    onValue(quizRef, handleQuizChange);

    return () => {
      off(quizRef, "value", handleQuizChange);
    };
  }, [quizCode]);

  return { questionNumber };
};

// Function for checking if a game exists
export const checkIfGameExists = async (quizCode:string) => {
  const quizRef = ref(database, `ongoingQuiz/${quizCode}`);
  const quizSnap = await get(quizRef);
  return quizSnap.exists();
}

export const addParticipant = async (quizCode:string, name:string, avatar:string) => {
  const participantId = randomUUID();
  try {
    const teamRef = ref(database, `ongoingQuiz/${quizCode}/participants/${participantId}`);
    await set(teamRef, {
      score: 0,
      hasAnswered: false,
      answer: null,
      name: name,
      answerTime: null,
      avatar: avatar,
      participant_id: participantId,
    });
    return participantId
  } catch (error) {
    console.error(error);
  }
};