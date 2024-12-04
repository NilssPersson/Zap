import { useCallback, useEffect, useMemo } from "react";
import { useAppContext } from "@/contexts/App/context";
import { usePathOnValue } from "@/hooks/usePathOnValue";
import {
  QuestionSlide,
  SlideTypes,
  ShowCorrectAnswerTypes,
  Participant,
  Slide,
  LobbySlide,
  QuestionTypes,
} from "@/models/Quiz";
import { getSlideComponents } from "@/slides/utils";

export interface LatestScore {
  id: string;
  score: number[];
}

export const useHostLogic = (id: string | undefined) => {
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

  const { participants } = ongoingQuiz || {};

  const allAnswered = Object.values(participants || {}).every(
    (participant) => participant.hasAnswered
  );

  const updateScores = async (slide: Slide) => {
    if (slide.type !== SlideTypes.question) return;
    const questionSlide = slide as QuestionSlide;
    if (questionSlide.questionType == QuestionTypes.FTA) return;
    const slidecomponent = getSlideComponents(slide);

    if ("CalculateScore" in slidecomponent) {
      const participants = Object.values(ongoingQuiz?.participants || {});
      const points = slidecomponent.CalculateScore({
        slide: slide as never,
        participants,
      });

      handleAddPoints(
        points.map((point, index) => ({
          participantId: participants[index].participantId,
          awardPoints: point,
        })),
        false
      );
    }
  };

  const handleAddPoints = async (
    pointsData: { participantId: string; awardPoints: number }[],
    changeSlide?: boolean
  ) => {
    if (!ongoingQuiz) return;

    const participants = { ...ongoingQuiz.participants };

    pointsData.forEach((point) => {
      participants[point.participantId] = {
        ...participants[point.participantId],
        score: [
          ...(participants[point.participantId].score || []),
          point.awardPoints,
        ],
        hasAnswered: false,
      };
    });

    optimisticUpdate(ongoingQuiz.id ? ongoingQuiz.id : "", {
      ...ongoingQuiz,
      participants,
      currentSlide: changeSlide
        ? ongoingQuiz.currentSlide + 1
        : ongoingQuiz.currentSlide,
      isShowingCorrectAnswer: changeSlide ? false : true,
    });
  };

  const nextSlide = async () => {
    if (!ongoingQuiz) return;

    if (!ongoingQuiz.isShowingCorrectAnswer) {
      const currentSlide = getCurrentSlide();
      if (currentSlide) {
        await updateScores(currentSlide);
      }
    }

    const updatedParticipants = { ...ongoingQuiz.participants };
    Object.values(updatedParticipants).forEach((participant) => {
      participant.hasAnswered = false;
    });

    await optimisticUpdate(ongoingQuiz.id ? ongoingQuiz.id : "", {
      ...ongoingQuiz,
      isShowingCorrectAnswer: false,
      currentSlide: ongoingQuiz.currentSlide + 1,
      participants: updatedParticipants,
    });
  };

  const getCurrentSlide = (): Slide | null => {
    if (!ongoingQuiz?.quiz.slides) return null;

    const currentSlideIndex = ongoingQuiz.currentSlide - 1;
    
    if (ongoingQuiz.currentSlide === 0) {
      return {
        id: "",
        type: SlideTypes.lobby,
        title: "Lobby Slide",
        quizCode: ongoingQuiz.id,
      } as LobbySlide;
    }

    return ongoingQuiz.quiz.slides[currentSlideIndex];
  };

  const showAnswer = () => {
    if (!ongoingQuiz?.id) return;
    
    optimisticUpdate(ongoingQuiz.id, {
      isShowingCorrectAnswer: true,
    });
    
    const currentSlide = getCurrentSlide();
    if (currentSlide) {
      updateScores(currentSlide);
    }
  };

  useEffect(() => {
    const checkAnswers = async () => {
      const currentSlide = ongoingQuiz?.currentSlide
        ? ongoingQuiz.currentSlide
        : 0;
      if (currentSlide == 0) return;
      
      const questionSlide = ongoingQuiz?.quiz.slides[
        currentSlide - 1
      ] as QuestionSlide;
      
      if (
        !ongoingQuiz?.isShowingCorrectAnswer &&
        allAnswered &&
        !(questionSlide.showCorrectAnswer == ShowCorrectAnswerTypes.never)
      ) {
        showAnswer();
      }
    };
    checkAnswers();
  }, [ongoingQuiz, allAnswered]);

  return {
    ongoingQuiz,
    getCurrentSlide,
    nextSlide,
    showAnswer,
    handleAddPoints,
    endQuiz,
  };
}; 