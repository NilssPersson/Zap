// Skapa och lyssna på pågående quiz answer och uppdatera

import { useState, useEffect } from "react";
import { ref, off, onValue, increment, runTransaction, update, set, get } from "firebase/database";
import { database } from "@/firebase";
import QuizOngoing from "@/models/QuizOngoing";

export const useOngoingQuiz = () => {
  const [quizCode, setQuizCode] = useState("");
  const [participants, setPaticipants] = useState([]);

    useEffect(() => {
    const participantsRef = ref(database, `ongoingQuizzes/${quizCode}/participants`);
    
    const handleQuizChange = (snapshot: any) => {
    if (snapshot.exists()) {
      const newParticipants = snapshot.val();
      setPaticipants(newParticipants);
    } else {
      console.error("Game not found");
    }
    };

    onValue(participantsRef, handleQuizChange);

    return () => {
        off(participantsRef, "value", handleQuizChange);
    };
    }, [quizCode]);


  // Function to update question number in Firebase
  const incrementSlide = async (quizCode: string) => {
    const slideOrderRef = ref(database, `ongoingQuizzes/${quizCode}/currentSlide`);
    try {
      // Increment CurrentSlideOrder by 1
      await runTransaction(slideOrderRef, (currentValue) => {
        return (currentValue) + 1;
      });
      console.log("CurrentSlideOrder incremented");

      // Reference to all participants
      const participantRef = ref(
        database,
        `ongoingQuizzes/${quizCode}/Participants/`
      );

      // Get all participants to update
      const participantsSnapshot = await get(participantRef);
      if (participantsSnapshot.exists()) {
        const updates: { [key: string]: any } = {};
        participantsSnapshot.forEach((participant) => {
          const participantKey = participant.key;
          updates[
            `ongoingQuizzes/${quizCode}/Participants/${participantKey}/hasAnswered`
          ] = false;
          updates[
            `ongoingQuizzes/${quizCode}/Participants/${participantKey}/Answer`
          ] = null;
        });

        // Apply the updates to all participants
        await update(ref(database), updates);
        console.log("All participants' answers reset successfully");
      } else {
        console.log("No participants found");
      }
    } catch (error) {
      console.error(
        "Error updating CurrentSlideOrder or resetting participants:",
        error
      );
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
    
      const quizRef = ref(
      database,
      `ongoingQuizzes/${quizCode}`
    )
      const quiz = await get(quizRef);
      if(await !quiz.exists()){
        isUnique = true
        console.log("Returning quizc", quizCode)
        return quizCode;
      }
    }
    setQuizCode(quizCode);
    return quizCode;
  };

  
  async function createOngoingQuiz(quizHost: string): Promise<any> {
    const db = database;
    const quizCode = await generateQuizCode();
    const quiz = {
      currentSlide: 0,
      quizHost: quizHost,
      participants: {},
      startedAt: new Date().toISOString().toLocaleString(),
    }
    try{
        console.log("Setting quiz:", quiz)
        console.log("With quizcode:", quizCode);
        await set(ref(db, "ongoingQuizzes/" + quizCode), quiz);
        return quizCode;
    }
    catch(error){
        console.error("Failed to create ongoing quiz", error);
    }
  }

  async function getOngoingQuiz(quizCode: string): Promise<any> {
    const quizRef = ref(database, "ongoingQuizzes/" + quizCode);
    try {
      const ongoingQuiz =  await get(quizRef);
      return ongoingQuiz;
    } catch (error) {
      console.error("Failed to get ongoing quiz", error);
    }
  }

  return {
    quizCode,
    participants,
    createOngoingQuiz,
    incrementSlide,
    getOngoingQuiz,
  };
};
