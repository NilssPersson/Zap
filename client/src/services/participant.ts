import { useState, useEffect } from "react";
import { ref, onValue, off,get,set, update, DataSnapshot } from "firebase/database";
import { database } from "@/firebase";
import { Participant } from "@/models/Quiz";

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
      answers: [],
      name: name,
      avatar: avatar,
      participantId: participantId,
    });
    return participantId
  } catch (error) {
    console.error(error);
  }
};

export const addAnswer = async (
  quizCode: string,
  participantId: string,
  answer: string[],
  slideNumber: number
) => {
  
  const participantInQuiz = await participantExists(quizCode, participantId);

  if (!participantInQuiz) {
    console.error("Participant does not exist in quiz");
    return;
  }

  const participantRef = ref(
    database,
    `ongoingQuizzes/${quizCode}/participants/${participantId}`
  );
  const participantSnap = await get(participantRef);

  if (!participantSnap.exists()) {
    console.error("Participant data not found");
    return;
  }

  const participantData = participantSnap.val();
  const participantAnswers = participantData.answers || [];

  const newAnswer = {
    slideNumber,
    answer,
    time: new Date().toISOString(),
  };

  const updatedAnswers = [...participantAnswers, newAnswer];

  try {
    await update(participantRef, {
      answers: updatedAnswers,
      hasAnswered: true,
    });
    console.log("Answer successfully added and updated.");
  } catch (error) {
    console.error("Error updating the answer:", error);
  }
};


export const useGameStatus = (quizCode:string, participantId:string) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [participantData, setParticipantData] = useState<Participant>();
  
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
        setParticipantData(participantData);
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

  return { currentSlide,participantData };
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