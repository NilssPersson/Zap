import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  QuestionSlide,
  SlideTypes,
  ShowCorrectAnswerTypes,
  Participant,
  AnswerTypes,
  Slide,
  ParticipantAnswer,
  LobbySlide,
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
    const updatedQuiz = ongoingQuiz;
    if (updatedQuiz) {
      updatedQuiz.isShowingCorrectAnswer = showAnswer;
      optimisticUpdate(ongoingQuiz.id ? ongoingQuiz.id : "", updatedQuiz);
    }
  }, [showAnswer]);

  useEffect(() => {
    const checkAnsweres = async () => {
      const currentSlide = ongoingQuiz?.currentSlide
        ? ongoingQuiz.currentSlide
        : 0;
      if (currentSlide == 0) return;
      const participantsObj = ongoingQuiz?.participants;
      if (participantsObj) {
        const participants = Object.values(participantsObj);
        const totalAnswers = participants.filter(
          (participant) => participant.hasAnswered
        ).length;
        // Fetch question slide
        const questionSlide = ongoingQuiz.quiz.slides[
          currentSlide - 1
        ] as QuestionSlide;
        // If all participants have answered and question slide should show correct answer
        if (
          !showAnswer &&
          totalAnswers == participants?.length &&
          !(questionSlide.showCorrectAnswer == ShowCorrectAnswerTypes.never)
        ) {
          setShowAnswer(true);
          updateScores(questionSlide);
        }
      }
    };
    checkAnsweres();
  }, [ongoingQuiz]);

  const calculateScore = (
    question: QuestionSlide,
    participant: Participant,
    participantAnswer: ParticipantAnswer
  ) => {
    if (!participant.answers) {
      return 0;
    }
    switch (question.answerType) {
      case AnswerTypes.singleString: {
        const correctAnswer = question.options
          .filter((option) => option.isCorrect)
          .map((option) => option.text);

        if (participantAnswer.answer[0] === correctAnswer[0]) {
          const newScore = 1000;
          return newScore;
        } else {
          return 0;
        }
      }
      // Todo, handle spelling mistakes etc.
      case AnswerTypes.freeText: {
        const correctAnswer = question.correctAnswer;
        if (participantAnswer.answer[0] === correctAnswer[0]) {
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
        if (participantAnswer.answer.length !== correctAnswer.length) {
          return 0;
        }
        // Sort both arrays and compare
        const sortedParticipantAnswers = [...participantAnswer.answer].sort();
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
        if (participantAnswer.answer.length !== correctAnswer.length) {
          return 0;
        }
        for (let i = 0; i < participantAnswer.answer.length; i++) {
          if (participantAnswer.answer[i] !== correctAnswer[i]) {
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

  const getAnswer = (participant: Participant) => {
    if (
      !participant.answers ||
      participant.answers[participant.answers.length - 1].slideNumber !=
        (ongoingQuiz?.currentSlide || 0) - 1
    ) {
      const newAnswer: ParticipantAnswer = {
        slideNumber: ongoingQuiz?.currentSlide || 0,
        answer: [""],
        time: new Date().toISOString(),
      };
      return newAnswer;
    } else {
      return participant.answers[participant.answers.length - 1];
    }
  };

  const updateScores = async (slide: Slide) => {
    // Do not update scores unless it is a question slide
    if (!(slide.type == SlideTypes.question)) return;
    const participantsObj = ongoingQuiz?.participants;
    if (participantsObj) {
      const participants = Object.values(participantsObj);
      const updates: { [key: string]: Participant } = {};

      participants.forEach(async (participant: Participant) => {
        const answer = getAnswer(participant);
        const score = calculateScore(slide, participant, answer);
        updates[participant.participantId] = {
          ...participant,
          score: [...(participant.score || []), score],
          hasAnswered: false,
          answers: [...(participant.answers || []), answer],
        };
      });
      try {
        const updatedQuiz = ongoingQuiz;
        updatedQuiz.participants = updates;
        console.log("New quiz after updates scores:", updatedQuiz);
        optimisticUpdate(
          ongoingQuiz.participants ? ongoingQuiz.id : "",
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
      return;
    }
    // If we are not already showing the answeres
    if (!showAnswer) {
      updateScores(slide);
    }

    const updatedQuiz = ongoingQuiz;
    updatedQuiz.currentSlide = updatedQuiz?.currentSlide + 1;

    await optimisticUpdate(ongoingQuiz.id ? ongoingQuiz.id : "", updatedQuiz);
    console.log("Next slide: ", ongoingQuiz);
    setShowAnswer(false);
  };

  const renderButtons = (slide: Slide) => {
    return (
      <div className="flex flex-col">
        {slide.type == SlideTypes.question &&
          !showAnswer &&
          slide.timeLimit > 0 && (
            <div>
              <Countdown
                date={Date.now() + slide.timeLimit * 1000}
                onComplete={() => {
                  setShowAnswer(true);
                  updateScores(slide);
                }}
              ></Countdown>
            </div>
          )}
        {slide.type == SlideTypes.question &&
          !showAnswer &&
          slide.showCorrectAnswer == ShowCorrectAnswerTypes.manual && (
            <Button
              onClick={() => {
                setShowAnswer(true);
                updateScores(slide);
              }}
              className="m-5"
            >
              Show Answer
            </Button>
          )}
      </div>
    );
  };

  if (!ongoingQuiz) return <div>Loading Quiz...</div>;

  if (!ongoingQuiz.quiz.slides) {
    return (
      <h1 className="text-5xl font-display">
        Your Quiz is missing slides :(
        <Button onClick={() => endQuiz(id || "")}>End Quiz</Button>
      </h1>
    );
  }

  const currentSlide = ongoingQuiz.currentSlide - 1;
  let slide = ongoingQuiz.quiz.slides[currentSlide];
  if (ongoingQuiz.currentSlide === 0) {
    slide = {
      id: "",
      type: SlideTypes.lobby,
      title: "Lobby Slide",
      quizCode: ongoingQuiz.id,
    } as LobbySlide;
  }

  if (!slide) {
    return (
      <h1 className="text-5xl font-display">
        Your Quiz is missing slides :(
        <Button onClick={() => endQuiz(id || "")}>End Quiz</Button>
      </h1>
    );
  }

  const SlideComponent = getSlideComponents(slide);

  return (
    <div>
      {!showAnswer && (
        <SlideComponent.Host
          participants={Object.values(ongoingQuiz.participants)}
          slide={slide as never}
          onNextSlide={nextSlide}
          quizCode={ongoingQuiz.id}
        />
      )}
      {showAnswer && (
        <SlideComponent.HostAnswer
          participants={Object.values(ongoingQuiz.participants)}
          slide={slide as never}
          onNextSlide={nextSlide}
          quizCode={ongoingQuiz.id}
        />
      )}
      {renderButtons(slide)}
    </div>
  );
};

export default HostLogic;
