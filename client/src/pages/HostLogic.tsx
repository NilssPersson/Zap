import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import QuizLobby from "./QuizLobby";
import { Button } from "@/components/ui/button";
import {
  QuestionSlide,
  SlideTypes,
  ShowCorrectAnswerTypes,
  Participant,
  AnswerTypes,
} from "@/models/Quiz";
import { getSlideComponents } from "@/slides/utils";

import Countdown from "react-countdown";
import { useAppContext } from "@/contexts/App/context";
import { usePathOnValue } from "@/hooks/usePathOnValue";

export interface LatestScore {
  id: string;
  score: number[];
}

const HostLogic: React.FC = () => {
  const { id } = useParams();
  const [showAnswer, setShowAnswer] = useState(false);

  const {
    ongoingQuizzes: { resources: ongoingQuizzes, endQuiz, optimisticUpdate },
  } = useAppContext();

  const ongoingQuiz = useMemo(
    () => ongoingQuizzes.find((quiz) => quiz.id === id),
    [ongoingQuizzes, id]
  );

  const updateParticipants = useCallback(
    (id: string, participants: { [key: string]: Participant }) => {
      optimisticUpdate(
        id,
        {
          participants,
        },
        true
      );
    },
    [optimisticUpdate]
  );

  usePathOnValue<Participant>(
    `ongoingQuizzes/${id}/participants`,
    (participants) => {
      if (!id) return;
      updateParticipants(id, participants);
    }
  );

  useEffect(() => {
    var updatedQuiz = ongoingQuiz;
    if (updatedQuiz) {
      updatedQuiz.isShowingCorrectAnswer = showAnswer;
      optimisticUpdate(ongoingQuiz?.id ? ongoingQuiz?.id : "", updatedQuiz);
    }
  }, [showAnswer]);

  useEffect(() => {
    console.log("In use effect");
    const checkAnsweres = async () => {
      const currentSlide = ongoingQuiz?.currentSlide
        ? ongoingQuiz?.currentSlide
        : 0;
      if (currentSlide == 0) return;
      const participantsObj = ongoingQuiz?.participants;
      if (participantsObj) {
        const participants = Object.values(participantsObj);
        const totalAnswers = participants.filter(
          (participant) => participant.hasAnswered
        ).length;
        // Fetch question slide
        const questionSlide = ongoingQuiz?.quiz.slides[
          currentSlide - 1
        ] as QuestionSlide;
        // If all participants have answered and question slide should show correct answer
        if (
          !showAnswer &&
          totalAnswers == participants?.length &&
          !(questionSlide.showCorrectAnswer == ShowCorrectAnswerTypes.never)
        ) {
          console.log("Button show answerr set true");
          setShowAnswer(true);
          updateScores(questionSlide);
        }
      }
    };
    checkAnsweres();
  }, [ongoingQuiz]);

  const calculateScore = (
    question: QuestionSlide,
    participant: Participant
  ) => {
    if (!participant.answers) {
      return 0;
    }
    const [answerLength] = [
      participant.answers.length,
    ];
    const participantAnswer = participant.answers[answerLength - 1].answer;
    switch (question.answerType) {
      case AnswerTypes.singleString: {
        const correctAnswer = question.options
          .filter((option) => option.isCorrect)
          .map((option) => option.text);

        if (participantAnswer[0] === correctAnswer[0]) {
          const newScore = 1000;
          return newScore;
        } else {
          return 0;
        }
      }
      // Todo, handle spelling mistakes etc.
      case AnswerTypes.freeText: {
        const correctAnswer = question.correctAnswer;
        if (participantAnswer[0] === correctAnswer[0]) {
          const newScore = 1000;
          return newScore;
        }
        return 0;
      }
      // The answers should be the same without considering order
      case AnswerTypes.multipleStrings: {
        const correctAnswer = question.options
          .filter((option) => option.isCorrect)
          .map((option) => option.text);
        if (participantAnswer.length !== correctAnswer.length) {
          return 0;
        }
        // Sort both arrays and compare
        const sortedParticipantAnswers = [...participantAnswer].sort();
        const sortedQuestionAnswers = [...correctAnswer].sort();

        const isAnswerCorrect = sortedParticipantAnswers.every(
          (value, index) => value === sortedQuestionAnswers[index]
        );

        if (isAnswerCorrect) {
          const newScore = 1000;
          return newScore;
        } else {
          return 0;
        }
      }
      // The answers should be the same, with regard to order
      case AnswerTypes.rank: {
        const correctAnswer = question.ranking;
        if (participantAnswer.length !== correctAnswer.length) {
          return undefined;
        }
        for (let i = 0; i < participantAnswer.length; i++) {
          if (participantAnswer[i] !== correctAnswer[i]) {
            return 0;
          }
        }
        const newScore = 1000;
        return newScore;
      }
      default: {
        return 0;
      }
    }
  };

  const updateScores = async (currentQuestion: QuestionSlide) => {
    const participantsObj = ongoingQuiz?.participants;
    if (participantsObj) {
      const participants = Object.values(participantsObj);
      console.log("Fetched participants in update Scores", participants);
      var updates: { [key: string]: Participant } = {};

      participants.forEach((participant: Participant) => {
        const score = calculateScore(currentQuestion, participant);
        console.log("got score", score);
        if (score !== undefined && score !== null) {
          updates[participant.participantId] = {
            ...participant,
            score: [...(participant.score || []), score],
            hasAnswered: false,
          };
          console.log("updated participants", updates);
        }
      });
      try {
        var updatedQuiz = ongoingQuiz;
        updatedQuiz.participants = updates;
        console.log("New quiz after updates scores:", updatedQuiz);
        optimisticUpdate(
          ongoingQuiz?.participants ? ongoingQuiz?.id : "",
          updatedQuiz
        );
        console.log("Scores updated and answers reset successfully.");
      } catch (error) {
        console.error("Error updating participants score", error);
      }
    } else {
      console.log("No participants found");
    }
  };

  const nextSlide = async () => {
    if (!ongoingQuiz) {
      return <h1>No ongoing quiz</h1>;
    }
    var updatedQuiz = ongoingQuiz;
    updatedQuiz.currentSlide = updatedQuiz?.currentSlide + 1;

    await optimisticUpdate(ongoingQuiz?.id ? ongoingQuiz?.id : "", updatedQuiz);
    console.log("Next slide: ", ongoingQuiz);
    setShowAnswer(false);
  };

  const renderQuestionButtons = (questionSlide: QuestionSlide) => {
    console.log(
      "Render question buttons for slide:",
      questionSlide,
      ShowCorrectAnswerTypes.manual
    );
    console.log("in render question buttons");
    return (
      <div className="flex flex-col">
        {!showAnswer && questionSlide.timeLimit > 0 && (
          <div>
            <Countdown
              date={Date.now() + questionSlide.timeLimit * 1000}
              onComplete={() => {
                console.log("Countdown set true");
                setShowAnswer(true);
                updateScores(questionSlide);
              }}
            ></Countdown>
          </div>
        )}
        {!showAnswer &&
          questionSlide.showCorrectAnswer == ShowCorrectAnswerTypes.manual && (
            <Button
              onClick={() => {
                console.log("Button'show answer' set true");
                setShowAnswer(true);
                updateScores(questionSlide);
              }}
              className="m-5"
            >
              Show Answer
            </Button>
          )}

        <Button
          onClick={() => {
            updateScores(questionSlide);
            nextSlide();
          }}
          className="m-5"
        >
          Next Slide
        </Button>
      </div>
    );
  };

  // Render QuizLobby when currentSlide is 0
  if (ongoingQuiz?.currentSlide == 0) {
    console.log("ongoing quiz object", ongoingQuiz);
    return (
      <div>
        <div className="flex flex-col">
          <QuizLobby
            quizCode={ongoingQuiz?.id ? ongoingQuiz?.id : ""}
            participants={
              ongoingQuiz?.participants
                ? Object.values(ongoingQuiz?.participants)
                : []
            }
          />
          <Button onClick={nextSlide} className="m-5">
            Start Game
          </Button>
        </div>
      </div>
    );
  } else {
    if (ongoingQuiz?.quiz.slides) {
      const currentSlide = ongoingQuiz?.currentSlide - 1;
      if (ongoingQuiz?.quiz.slides[currentSlide].type == SlideTypes.question) {
        const questionSlide = ongoingQuiz?.quiz.slides[
          currentSlide
        ] as QuestionSlide;
        const SlideComponent = getSlideComponents(questionSlide);
        return (
          <div>
            {!showAnswer && (
              <SlideComponent.Preview slide={questionSlide as never} />
            )}
            {showAnswer && <h1>Showing answer </h1>}
            {renderQuestionButtons(questionSlide)}
          </div>
        );
      } else {
        const slide = ongoingQuiz?.quiz.slides[currentSlide];
        const SlideComponent = getSlideComponents(slide);
        return (
          <div className="flex flex-col">
            <SlideComponent.Host
              participants={Object.values(ongoingQuiz.participants)}
              slide={slide as never}
            />
            <Button onClick={nextSlide} className="m-5">
              Next slide
            </Button>
          </div>
        );
      }
    } else {
      return (
        <h1 className="text-5xl font-display">
          Your Quiz is missing slides :(
          <Button onClick={() => endQuiz(id || "")}>End Quiz</Button>
        </h1>
      );
    }
  }
};

export default HostLogic;
