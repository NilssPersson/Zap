import { useState, useEffect } from "react";
import { ref, onValue, off } from "firebase/database";
import { database } from "@/firebase";

export const useGameStatus = (quizCode:string) => {
  const [questionNumber, setQuestionNumber] = useState(null);

  useEffect(() => {
    const quizRef = ref(database, `ongoingQuiz/${quizCode}`);

    const handleQuizChange = (snapshot:any) => {
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

  return { questionNumber};
};
