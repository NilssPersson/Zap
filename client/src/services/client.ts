import { useState, useEffect } from "react";
import { ref, onValue, off, DataSnapshot,get,set } from "firebase/database";
import { database } from "@/firebase";

export const useGameStatus = (quizCode:string) => {
  const [questionNumber, setQuestionNumber] = useState(null);

  useEffect(() => {
    const quizRef = ref(database, `ongoingQuizzes/${quizCode}`);

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
  const quizRef = ref(database, `ongoingQuizzes/${quizCode}`);
  const quizSnap = await get(quizRef);
  return quizSnap.exists();
}

export const addParticipant = async (quizCode:string, name:string, avatar:string) => {
  const participantId = crypto.randomUUID();
  try {
    const teamRef = ref(database, `ongoingQuizzes/${quizCode}/participants/${participantId}`);
    await set(teamRef, {
      score: 0,
      hasAnswered: false,
      answer: "",
      name: name,
      answerTime: "",
      avatar: avatar,
      participantId: participantId,
    });
    return participantId
  } catch (error) {
    console.error(error);
  }
};
