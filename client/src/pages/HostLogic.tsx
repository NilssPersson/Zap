import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  QuestionSlide,
  SlideTypes,
  ShowCorrectAnswerTypes,
  Participant,
  Slide,
  ParticipantAnswer,
  LobbySlide,
  QuestionTypes,
  AnswerTypes,
} from "@/models/Quiz";
import { getSlideComponents } from "@/slides/utils";

import Countdown from "react-countdown";
import { useAppContext } from "@/contexts/App/context";
import { usePathOnValue } from "@/hooks/usePathOnValue";
import EndScreen from "@/slides/_specials/endscreen/EndScreen";

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
    [ongoingQuizzes, id],
  );

  const updateParticipants = useCallback(
    (id: string, participants: { [key: string]: Participant }) => {
      optimisticUpdate(
        id,
        {
          participants,
        },
        true,
      );
    },
    [optimisticUpdate],
  );

  usePathOnValue<Participant>(
    `ongoingQuizzes/${id}/participants`,
    (participants) => {
      if (!id) return;
      updateParticipants(id, participants);
    },
  );

  useEffect(() => {
    const updatedQuiz = ongoingQuiz;
    if (updatedQuiz) {
      updatedQuiz.isShowingCorrectAnswer = showAnswer;
      optimisticUpdate(ongoingQuiz.id ? ongoingQuiz.id : "", updatedQuiz);
    }
  }, [showAnswer]);

  useEffect(() => {
    if (ongoingQuiz && ongoingQuiz.isShowingCorrectAnswer !== undefined) {
      setShowAnswer(ongoingQuiz.isShowingCorrectAnswer);
    }
    const checkAnsweres = async () => {
      const currentSlide = ongoingQuiz?.currentSlide
        ? ongoingQuiz.currentSlide
        : 0;
      if (currentSlide == 0) return;
      const participantsObj = ongoingQuiz?.participants;
      if (participantsObj) {
        const participants = Object.values(participantsObj);
        const totalAnswers = participants.filter(
          (participant) => participant.hasAnswered,
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

  if (!ongoingQuiz) return <div>Loading Quiz...</div>;

  const calculateScore = (
    question: QuestionSlide,
    participant: Participant,
  ) => {
    if (!participant.answers) {
      return 0;
    }
    const participantAnswers = participant.answers.at(-1);
    if (!participantAnswers) {
      return 0;
    }
    // If participant is missing answer for the latest slide
    if (participantAnswers.slideNumber != ongoingQuiz.currentSlide - 1) {
      participantAnswers.answer = [""];
    }

    switch (question.answerType) {
      case AnswerTypes.singleString: {
        const correctAnswer = question.options
          .filter((option) => option.isCorrect)
          .map((option) => option.text);

        if (participantAnswers.answer[0] === correctAnswer[0]) {
          const newScore = 1000;
          return newScore;
        } else {
          return 0;
        }
      }
      // Todo, handle spelling mistakes etc.
      case AnswerTypes.freeText: {
        const correctAnswer = question.correctAnswer;
        if (participantAnswers.answer[0] === correctAnswer[0]) {
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
        if (participantAnswers.answer.length !== correctAnswer.length) {
          return 0;
        }
        // Sort both arrays and compare
        const sortedParticipantAnswers = [...participantAnswers.answer].sort();
        const sortedQuestionAnswers = [...correctAnswer].sort();

        const isAnswerCorrect = sortedParticipantAnswers.every(
          (value, index) => value === sortedQuestionAnswers[index],
        );

        if (isAnswerCorrect) {
          const newScore = 1000;
          return newScore;
        } else {
          return 0;
        }
      }
      case AnswerTypes.time: {
        const correctAnswer = "correct";
        if (participantAnswers.answer[0] == correctAnswer) {
          const newScore = 1000;
          return newScore;
        } else {
          return 0;
        }
      }
      // The answers should be the same, with regard to order
      case AnswerTypes.rank: {
        const correctAnswer = question.ranking;
        if (participantAnswers.answer.length !== correctAnswer.length) {
          return 0;
        }
        for (let i = 0; i < participantAnswers.answer.length; i++) {
          if (participantAnswers.answer[i] !== correctAnswer[i]) {
            return 0;
          }
        }
        const newScore = 1000;
        return newScore;
      }
      case AnswerTypes.matching: {
        const correctAnswer = question.labels.every((label) => {
          return label.correctOptions.every((option) =>
            (participantAnswers?.answer as unknown as Record<string, string[]>)[
              label.id
            ].includes(option),
          );
        });
        if (correctAnswer) {
          const newScore = 1000;
          return newScore;
        }
        return 0;
      }
      default: {
        return 0;
      }
    }
  };

  const createAnswer = (participant: Participant) => {
    if (
      !participant.answers ||
      participant.answers[participant.answers.length - 1].slideNumber !=
        ongoingQuiz.currentSlide - 1
    ) {
      const newAnswer: ParticipantAnswer = {
        slideNumber: ongoingQuiz.currentSlide - 1,
        answer: [""],
        time: new Date().toISOString(),
      };
      return newAnswer;
    } else {
      return null;
    }
  };

  const updateScores = async (slide: Slide) => {
    // Do not update scores unless it is a question slide
    if (!(slide.type == SlideTypes.question)) return;
    const questionSlide = slide as QuestionSlide;
    if (questionSlide.questionType == QuestionTypes.FTA) return;
    if (questionSlide.questionType == QuestionTypes.LOCATEIT) {
      const slidecomponent = getSlideComponents(slide);
      await slidecomponent.CalculateScore({
        slide,
        participants: Object.values(ongoingQuiz.participants),
        handleAddPoints,
      });

      return;
    }

    const participantsObj = ongoingQuiz?.participants;
    if (participantsObj) {
      const participants = Object.values(participantsObj);
      const updates: { [key: string]: Participant } = {};

      participants.forEach(async (participant: Participant) => {
        const newAnswer = createAnswer(participant);
        const score = calculateScore(slide, participant);
        updates[participant.participantId] = {
          ...participant,
          score: [...(participant.score || []), score],
          hasAnswered: false,
          answers: newAnswer
            ? [...(participant.answers || []), newAnswer]
            : [...participant.answers],
        };
      });
      try {
        const updatedQuiz = ongoingQuiz;
        updatedQuiz.participants = updates;

        optimisticUpdate(
          ongoingQuiz.participants ? ongoingQuiz.id : "",
          updatedQuiz,
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
      await updateScores(slide);
    }

    const updatedQuiz = ongoingQuiz;
    updatedQuiz.currentSlide = updatedQuiz.currentSlide + 1;

    await optimisticUpdate(ongoingQuiz.id ? ongoingQuiz.id : "", updatedQuiz);
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

  if (!ongoingQuiz.quiz.slides) {
    return (
      <EndScreen
        quiz={ongoingQuiz.quiz}
        endQuiz={() => endQuiz(ongoingQuiz.id)}
        participants={Object.values(ongoingQuiz.participants || {})}
      />
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

  if (currentSlide === ongoingQuiz.quiz.slides.length || !slide) {
    return (
      <EndScreen
        quiz={ongoingQuiz.quiz}
        endQuiz={() => endQuiz(ongoingQuiz.id)}
        participants={Object.values(ongoingQuiz.participants || {})}
      />
    );
  }

  const SlideComponent = getSlideComponents(slide);

  // Function to award points to participants and then move to the next slide
  async function handleAddPoints(
    pointsData: { participantId: string; awardPoints: number }[],
    slide: QuestionSlide,
    changeSlide?: boolean,
  ) {
    const participantsObj = ongoingQuiz?.participants;
    console.log(slide);
    if (!participantsObj) {
      console.log("No participants");
      return;
    }

    const updates: Record<string, Participant> = {};

    Object.values(participantsObj).forEach((participant) => {
      const { participantId } = participant;

      // Find the participant's points to award
      const { awardPoints } = pointsData.find(
        (data) => data.participantId === participantId,
      ) || { awardPoints: 0 };

      // Update the participant's scores and reset `hasAnswered`
      updates[participantId] = {
        ...participant,
        score: [...(participant.score || []), awardPoints],
        hasAnswered: false,
      };
    });

    try {
      const updatedQuiz = {
        ...ongoingQuiz,
        participants: updates,
        currentSlide: changeSlide
          ? ongoingQuiz.currentSlide + 1
          : ongoingQuiz.currentSlide,
      };
      await optimisticUpdate(ongoingQuiz?.id || "", updatedQuiz);
      if (changeSlide) setShowAnswer(false);
      else setShowAnswer(true);
      console.log("Participants' scores updated successfully:", updatedQuiz);
    } catch (error) {
      console.error("Error updating participants' scores:", error);
    }
  }

  return (
    <>
      {!showAnswer ? (
        <SlideComponent.Host
          slides={ongoingQuiz.quiz.slides}
          currentSlide={ongoingQuiz.currentSlide}
          participants={Object.values(ongoingQuiz.participants || {})}
          slide={slide as never}
          onNextSlide={nextSlide}
          quizCode={ongoingQuiz.id}
        />
      ) : (
        <SlideComponent.HostAnswer
          participants={Object.values(ongoingQuiz.participants)}
          slide={slide as never}
          onNextSlide={nextSlide}
          quizCode={ongoingQuiz.id}
          handleAddPoints={handleAddPoints}
        />
      )}
      {renderButtons(slide)}
    </>
  );
};

export default HostLogic;
