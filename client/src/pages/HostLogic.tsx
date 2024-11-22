import React, { useEffect, useState } from "react";
import { useNavigate, useParams /* useNavigate */ } from "react-router-dom";
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

export interface LatestScore {
  id: string;
  score: number[];
}

const HostLogic: React.FC = () => {
  const { id } = useParams();
  const [showAnswer, setShowAnswer] = useState(false);
  const navigate = useNavigate();

  const {
    ongoingQuizzes: {
      resources: ongoingQuizzes,
      endQuiz,
      optimisticUpdate,
      isLoading,
    },
  } = useAppContext();

  const ongoingQuiz = ongoingQuizzes.find((quiz) => quiz.id === id);

  useEffect(() => {
    if (!isLoading && !ongoingQuiz) {
      navigate("/");
    }
  }, [isLoading, ongoingQuiz]);

  useEffect(() => {
    const checkAnsweres = async () => {
      const participantsObj = ongoingQuiz?.participants;
      if (participantsObj) {
        const participants = Object.values(participantsObj);

        const totalAnswers = participants.filter(
          (participant) => participant.hasAnswered
        ).length;
        // Fetch question slide
        const questionSlide = ongoingQuiz?.quiz.slides[
          (ongoingQuiz?.currentSlide ? ongoingQuiz?.currentSlide : 1) - 1
        ] as QuestionSlide;
        // If all participants have answered and question slide should show correct answer
        if (
          totalAnswers == participants?.length &&
          !(questionSlide.showCorrectAnswer == ShowCorrectAnswerTypes.never)
        )
          setShowAnswer(true);
      }
    };
    checkAnsweres();
  }, [ongoingQuiz]);

  const calculateScore = (
    question: QuestionSlide,
    participant: Participant
  ) => {
    if (!participant.answers) {
      return undefined;
    }
    const [answerLength, scoreLength] = [
      participant.answers.length,
      participant.score.length,
    ];
    const participantAnswer = participant.answers[answerLength - 1].answer;
    const currentScore = participant.score[scoreLength - 1];

    switch (question.answerType) {
      case AnswerTypes.singleString: {
        const correctAnswer = question.options
          .filter((option) => option.isCorrect)
          .map((option) => option.text);

        if (participantAnswer[0] === correctAnswer[0]) {
          const newScore = currentScore + 1000;
          return newScore;
        } else {
          return currentScore;
        }
      }
      // Todo, handle spelling mistakes etc.
      case AnswerTypes.freeText: {
        const correctAnswer = question.correctAnswer;
        if (participantAnswer[0] === correctAnswer[0]) {
          const newScore = currentScore + 1000;
          return newScore;
        }
        return currentScore;
      }
      // The answers should be the same without considering order
      case AnswerTypes.multipleStrings: {
        const correctAnswer = question.options
          .filter((option) => option.isCorrect)
          .map((option) => option.text);
        if (participantAnswer.length !== correctAnswer.length) {
          return undefined;
        }
        // Sort both arrays and compare
        const sortedParticipantAnswers = [...participantAnswer].sort();
        const sortedQuestionAnswers = [...correctAnswer].sort();

        const isAnswerCorrect = sortedParticipantAnswers.every(
          (value, index) => value === sortedQuestionAnswers[index]
        );

        if (isAnswerCorrect) {
          const newScore = currentScore + 1000;
          return newScore;
        } else {
          return currentScore;
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
            return currentScore;
          }
        }
        const newScore = currentScore + 1000;
        return newScore;
      }
      default: {
        return currentScore;
      }
    }
  };

  const updateScores = async (currentQuestion: QuestionSlide) => {
    const participantsObj = ongoingQuiz?.participants;
    if (participantsObj) {
      const participants = Object.values(participantsObj);

      const updates: { [key: string]: Participant } = {};

      participants.forEach((participant: Participant) => {
        const score = calculateScore(currentQuestion, participant);

        if (score) {
          updates[participant.participantId] = {
            ...participant,
            score: [...(participant.score || []), score],
          };
        }
      });
      try {
        optimisticUpdate(
          ongoingQuiz?.participants ? ongoingQuiz?.id : "",
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

  const nextSlideAfterQuestion = async (question: QuestionSlide) => {
    await updateScores(question);
    await nextSlide();
  };

  const nextSlide = async () => {
    if (!ongoingQuiz) {
      return <h1>No ongoing quiz</h1>;
    }
    var updatedQuiz = ongoingQuiz;
    updatedQuiz.currentSlide = updatedQuiz?.currentSlide + 1;
    await optimisticUpdate(ongoingQuiz?.id ? ongoingQuiz?.id : "", updatedQuiz);
    setShowAnswer(false);
  };

  const Completionist: React.FC = () => {
    setShowAnswer(true);
    return null; // Or return some UI if needed
  };

  const renderQuestionButtons = (questionSlide: QuestionSlide) => {
    console.log("Render question buttons for slide:", questionSlide);
    return (
      <div className="flex flex-col">
        {!showAnswer && questionSlide.timeLimit > 0 && (
          <div>
            <Countdown date={Date.now() + questionSlide.timeLimit * 1000}>
              <Completionist />
            </Countdown>
            {questionSlide.showCorrectAnswer ===
              ShowCorrectAnswerTypes.manual && (
              <Button onClick={() => setShowAnswer(true)} className="m-5">
                Show Answer
              </Button>
            )}
          </div>
        )}
        <Button
          onClick={() => nextSlideAfterQuestion(questionSlide)}
          className="m-5"
        >
          Next Slide
        </Button>
      </div>
    );
  };

  // Render QuizLobby when currentSlide is 0
  if (ongoingQuiz?.currentSlide === 0) {
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
            {showAnswer && <h1>Showing answer</h1>}
            {renderQuestionButtons(questionSlide)}
          </div>
        );
      } else {
        const slide = ongoingQuiz?.quiz.slides[currentSlide];
        const SlideComponent = getSlideComponents(slide);
        return (
          <div className="flex flex-col">
            <SlideComponent.Preview slide={slide as never} />
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
