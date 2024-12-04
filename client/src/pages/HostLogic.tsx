import { useCallback, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
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

import Countdown from "react-countdown";
import { useAppContext } from "@/contexts/App/context";
import { usePathOnValue } from "@/hooks/usePathOnValue";
import EndScreen from "@/slides/_specials/endscreen/EndScreen";

export interface LatestScore {
  id: string;
  score: number[];
}

function HostLogic() {
  const { id } = useParams();

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

  useEffect(() => {
    const checkAnswers = async () => {
      const currentSlide = ongoingQuiz?.currentSlide
        ? ongoingQuiz.currentSlide
        : 0;
      if (currentSlide == 0) return;
      // Fetch question slide
      const questionSlide = ongoingQuiz?.quiz.slides[
        currentSlide - 1
      ] as QuestionSlide;
      // If all participants have answered and question slide should show correct answer
      if (
        !ongoingQuiz?.isShowingCorrectAnswer &&
        allAnswered &&
        !(questionSlide.showCorrectAnswer == ShowCorrectAnswerTypes.never)
      ) {
        optimisticUpdate(ongoingQuiz?.id ? ongoingQuiz.id : "", {
          isShowingCorrectAnswer: true,
        });
        updateScores(questionSlide);
      }
    };
    checkAnswers();
  }, [ongoingQuiz, allAnswered]);

  if (!ongoingQuiz) return <div>Loading Quiz...</div>;

  const updateScores = async (slide: Slide) => {
    // Do not update scores unless it is a question slide
    if (slide.type !== SlideTypes.question) return;
    const questionSlide = slide as QuestionSlide;
    if (questionSlide.questionType == QuestionTypes.FTA) return;
    const slidecomponent = getSlideComponents(slide);

    if ("CalculateScore" in slidecomponent) {
      const participants = Object.values(ongoingQuiz.participants);
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

    return;
  };

  const nextSlide = async () => {
    if (!ongoingQuiz) {
      return;
    }
    // If we are not already showing the answeres
    if (!ongoingQuiz.isShowingCorrectAnswer) {
      await updateScores(slide);
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

  const renderButtons = (slide: Slide) => {
    return (
      <div className="flex flex-col">
        {slide.type == SlideTypes.question &&
          !ongoingQuiz.isShowingCorrectAnswer &&
          slide.timeLimit > 0 && (
            <div>
              <Countdown
                date={Date.now() + slide.timeLimit * 1000}
                onComplete={() => {
                  optimisticUpdate(ongoingQuiz.id ? ongoingQuiz.id : "", {
                    isShowingCorrectAnswer: true,
                  });
                  updateScores(slide);
                }}
              ></Countdown>
            </div>
          )}
        {slide.type == SlideTypes.question &&
          !ongoingQuiz.isShowingCorrectAnswer &&
          slide.showCorrectAnswer == ShowCorrectAnswerTypes.manual && (
            <Button
              onClick={() => {
                optimisticUpdate(ongoingQuiz.id ? ongoingQuiz.id : "", {
                  isShowingCorrectAnswer: true,
                });
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
    changeSlide?: boolean
  ) {
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
  }

  return (
    <>
      {!ongoingQuiz.isShowingCorrectAnswer ? (
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
