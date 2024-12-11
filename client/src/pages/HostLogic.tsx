import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SlideTypes, ShowCorrectAnswerTypes } from '@/models/Quiz';
import { getSlideComponents } from '@/slides/utils';
import EndScreen from '@/slides/_specials/endscreen/EndScreen';
import { useHostLogic } from '@/hooks/useHostLogic';
import { useEffect, useState } from 'react';

function HostLogic() {
  const { id } = useParams();
  const {
    ongoingQuiz,
    getCurrentSlide,
    nextSlide,
    changeTurn,
    endQuiz,
    handleAddPoints,
  } = useHostLogic(id);

  if (!ongoingQuiz) return <div>Loading Quiz...</div>;

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

  const [timer, setTimer] = useState(
    slide.type == SlideTypes.question && slide.timeLimit > 0
      ? slide.timeLimit * 1
      : -2
  );

  // Reinitialize the timer whenever the slide changes
  useEffect(() => {
    if (slide.type === SlideTypes.question && slide.timeLimit > 0) {
      setTimer(slide.timeLimit);
    } else {
      setTimer(-1); // No timer for non-question slides
    }
  }, [slide]);

  useEffect(() => {
    if (timer < 0) return;

    if (timer == 0) nextSlide();

    const countDown = setInterval(() => {
      setTimer((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(countDown);
  }, [timer, nextSlide]);

  const SlideComponent = getSlideComponents(slide);

  const RenderButtons = () => {
    if (slide.type !== SlideTypes.question) return null;

    return (
      <div className="flex flex-col">
        {!ongoingQuiz.isShowingCorrectAnswer && slide.timeLimit > 0 && (
          <div>
            <h1 className="text-4xl">{timer}</h1>
          </div>
        )}
        {!ongoingQuiz.isShowingCorrectAnswer &&
          slide.showCorrectAnswer == ShowCorrectAnswerTypes.manual && (
            <Button onClick={nextSlide} className="m-5">
              Show Answer
            </Button>
          )}
      </div>
    );
  };

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
          slideNumber={ongoingQuiz.currentSlide}
          changeTurn={changeTurn}
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
      <RenderButtons />
    </>
  );
}

export default HostLogic;
