import { useState, useEffect } from "react";
import { ref, onValue, off,get,set, update, DataSnapshot } from "firebase/database";
import { database } from "@/firebase";

export const checkIfGameExists = async (quizCode:string) => {
  const quizRef = ref(database, `ongoingQuizzes/${quizCode}`);
  const quizSnap = await get(quizRef);
  return quizSnap.exists();
}

export const participantExists = async (quizCode:string, participantId:string) => {
  const participantRef = ref(database, `ongoingQuizzes/${quizCode}/participants/${participantId}`);
  const participantSnap = await get(participantRef);
  return participantSnap.exists();
}

export const addParticipant = async (quizCode:string, name:string, avatar:string) => {
  const participantId = crypto.randomUUID();
  const quizExists = await checkIfGameExists(quizCode);
 
  if (!quizExists) {
    console.error("Game does not exist");
    return;
  }
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

export const addAnswer = async (quizCode:string, participantId:string, answer:string) => {
  const participantInQuiz = await participantExists(quizCode, participantId);

  if (!participantInQuiz) {
    console.error("Participant does not exist in quiz");
    return;
  }

  const participantRef = ref(database, `ongoingQuizzes/${quizCode}/participants/${participantId}`);

  try {
    await update(participantRef, {
      answer: answer,
      hasAnswered: true,
      answerTime: new Date().toISOString(),
    });
  } catch (error) {
    console.error(error);
  }
};

export const useGameStatus = (quizCode:string, participantId:string) => {
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  
  useEffect(() => {
    const slideRef = ref(database, `ongoingQuizzes/${quizCode}/currentSlide`);
    const participantRef = ref(database, `ongoingQuizzes/${quizCode}/participants/${participantId}`);

    const handleSlideChange = (snapshot:DataSnapshot) => {
      if (snapshot.exists()) {
        const slideData = snapshot.val();
        setCurrentSlide(slideData);
      } else {
        console.error("Team not found");
      }
    };

    const handleParticipantChange = (snapshot:DataSnapshot) => {
      if (snapshot.exists()) {
        const participantData = snapshot.val();
        setHasAnswered(participantData.hasAnswered);
        setScore(participantData.score);
      } else {
        console.error("Game not found");
      }
    };

    onValue(slideRef, handleSlideChange);
    onValue(participantRef, handleParticipantChange);

    return () => {
      off(slideRef, "value", handleSlideChange);
      off(participantRef, "value", handleParticipantChange);
    };
  }, [participantId, quizCode]);

  return { hasAnswered, currentSlide,score };
};

export const removeParticipant = async (quizCode:string, participantId:string) => {
  const participantRef = ref(database, `ongoingQuizzes/${quizCode}/participants/${participantId}`);
  try {
    await set(participantRef, null);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export const getParticipant = async (quizCode:string, participantId:string) => {
  const participantRef = ref(database, `ongoingQuizzes/${quizCode}/participants/${participantId}`);
  const participantSnap = await get(participantRef);
  return participantSnap.val();
}

export const getQuizSlides = async (quizCode:string) => {
  const questionsRef = ref(database, `ongoingQuizzes/${quizCode}/quiz/slides`);
  const questionsSnap = await get(questionsRef);
  return questionsSnap.val();
}