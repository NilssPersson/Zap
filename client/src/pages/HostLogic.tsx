import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SlideTypes, ShowCorrectAnswerTypes } from '@/models/Quiz';
import { getSlideComponents } from '@/slides/utils';
import Countdown from 'react-countdown';
import EndScreen from '@/slides/_specials/endscreen/EndScreen';
import { useHostLogic } from '@/hooks/useHostLogic';
import { ParticipantAnswers } from '@/slides/_components/ParticipantAnswers';
import Spinner from '@/components/Spinner';
import EndQuizButton from '@/components/EndQuizButton';
import {
  getLocalStorageValue,
  setLocalStorageValue,
  removeLocalStorageValue,
} from '@/utils/localstorage';
import { useState, useEffect } from 'react';

function HostLogic() {
  const { id } = useParams();
  const {
    ongoingQuiz,
    getCurrentSlide,
    nextSlide,
    changeTurn,
    updateSlideUsedAnswers,
    endQuiz,
    handleAddPoints,
    removeParticipant,
  } = useHostLogic(id);

  const [countdownEndDate, setCountdownEndDate] = useState<number | null>(null);
  const [currentSlideId, setCurrentSlideId] = useState<string | null>(null);

  useEffect(() => {
    if (!ongoingQuiz || !ongoingQuiz.quiz.slides) return;

    const slide = getCurrentSlide();

    if (!slide || slide.type !== SlideTypes.question || slide.timeLimit <= 0) {
      setCountdownEndDate(null);
      return;
    }

    if (currentSlideId !== slide.id) {
      removeLocalStorageValue('quiz_timer');
      setCurrentSlideId(slide.id);
    }

    const storedEndDate = Number(getLocalStorageValue('quiz_timer'));
    const currentTime = Date.now();

    if (storedEndDate && !isNaN(storedEndDate)) {
      const delta = storedEndDate - currentTime;
      if (delta > 0) {
        setCountdownEndDate(storedEndDate);
        return;
      }
    }
    // If no valid stored end date, set a new one
    const newEndDate = currentTime + slide.timeLimit * 1000;
    setCountdownEndDate(newEndDate);
    setLocalStorageValue('quiz_timer', newEndDate);
  }, [ongoingQuiz, getCurrentSlide]);

  const handleComplete = () => {
    const complete = removeLocalStorageValue('quiz_timer');
    if (complete) nextSlide();
  };

  if (!ongoingQuiz) return <Spinner />;

  const slide = getCurrentSlide();

  if (!ongoingQuiz.quiz.slides || !slide) {
    return (
      <EndScreen
        quiz={ongoingQuiz.quiz}
        endQuiz={() => endQuiz(ongoingQuiz.id)}
        participants={Object.values(ongoingQuiz.participants || {})}
      />
    );
  }

  const SlideComponent = getSlideComponents(slide);

  const RenderButtons = () => {
    if (slide.type !== SlideTypes.question) return null;

    return (
      <div className="flex flex-col">
        {!ongoingQuiz.isShowingCorrectAnswer &&
          slide.timeLimit > 0 &&
          countdownEndDate && (
            <div>
              <Countdown
                date={countdownEndDate}
                onComplete={handleComplete}
                renderer={({ minutes, seconds, completed }) => {
                  if (completed) {
                    return <span>Time's up!</span>;
                  } else {
                    return (
                      <span>
                        {minutes.toString().padStart(2, '0')}:
                        {seconds.toString().padStart(2, '0')}
                      </span>
                    );
                  }
                }}
              />
            </div>
          )}
        {!ongoingQuiz.isShowingCorrectAnswer &&
          slide.showCorrectAnswer === ShowCorrectAnswerTypes.manual && (
            <Button onClick={nextSlide} className="m-5">
              Show Answer
            </Button>
          )}
      </div>
    );
  };

  const inLobby = ongoingQuiz.currentSlide <= 1;

  return (
    <>
      {!ongoingQuiz.isShowingCorrectAnswer ? (
        <>
          <SlideComponent.Host
            slides={ongoingQuiz.quiz.slides}
            currentSlide={ongoingQuiz.currentSlide}
            participants={Object.values(ongoingQuiz.participants || {})}
            removeParticipant={removeParticipant}
            slide={slide as never}
            onNextSlide={nextSlide}
            quizCode={ongoingQuiz.id}
            slideNumber={ongoingQuiz.currentSlide}
            changeTurn={changeTurn}
            updateSlideUsedAnswers={updateSlideUsedAnswers}
          />
          {!inLobby && (
            <ParticipantAnswers
              participants={Object.values(ongoingQuiz.participants || {})}
              removeParticipant={removeParticipant}
            />
          )}
        </>
      ) : (
        <SlideComponent.HostAnswer
          participants={Object.values(ongoingQuiz.participants)}
          slide={slide as never}
          onNextSlide={nextSlide}
          quizCode={ongoingQuiz.id}
          handleAddPoints={handleAddPoints}
        />
      )}
      {!inLobby && <EndQuizButton onClick={() => endQuiz(ongoingQuiz.id)} />}
      <RenderButtons />
    </>
  );
}

export default HostLogic;
