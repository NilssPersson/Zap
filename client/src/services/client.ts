import { useState, useEffect } from "react";
import { ref, onValue, off,get,set, update, DataSnapshot } from "firebase/database";
import { database } from "@/firebase";


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

export const addAnswer = async (quizCode:string, participantId:string, answer:string) => {
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
  const [hasAnswered, setHasAnswered] = useState(undefined);
  const [currentSlide, setCurrentSlide] = useState(undefined);
  const [score, setScore] = useState(undefined);

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