import React, { useEffect, useState } from "react";
import { useParams /* useNavigate */ } from "react-router-dom";
import { useOngoingQuiz } from "@/services/host";
import QuizLobby from "./QuizLobby";
import { Button } from "@/components/ui/button";
import {
  OngoingQuiz,
  QuestionSlide,
  SlideTypes,
  ShowCorrectAnswerTypes,
} from "@/models/Quiz";
import { getSlideComponents } from "@/slides/utils";

export interface LatestScore {
  id: string;
  score: number;
}

const HostLogic: React.FC = () => {
  const { id } = useParams();
  const [ongoingQuiz, setOngoingQuiz] = useState<OngoingQuiz>();

  const {
    quizCode,
    participants,
    incrementSlide,
    getOngoingQuiz,
    updateScore,
    setIsShowingAnswer,
  } = useOngoingQuiz();

  useEffect(() => {
    const setupLobby = async () => {
      try {
        const currentQuiz = await getOngoingQuiz(id || "");
        if (currentQuiz) {
          setOngoingQuiz(currentQuiz);
        }
      } catch (error) {
        console.error("Error setting up lobby:", error);
      }
    };

    setupLobby();
  }, [id]);

  const nextSlide = async () => {
    console.log("Before nextSlide ", ongoingQuiz);
    const currentOngoingQuiz = await incrementSlide(quizCode);
    setOngoingQuiz(currentOngoingQuiz);
    console.log("nextSlide, fetched ongoing quiz: ", currentOngoingQuiz);
  };

  const nextSlideAfterQuestion = async (question: QuestionSlide) => {
    await updateScore(quizCode, question);
    setIsShowingAnswer(id ? id : "", false);
    const startedQuiz = await incrementSlide(quizCode);
    setOngoingQuiz(startedQuiz);
  };

  const showAnswer = async (questionSlide: QuestionSlide) => {
    setIsShowingAnswer(id ? id : "", true);
    return (
      <div>
        <h1>Visar svaren</h1>
        <Button
          onClick={() => nextSlideAfterQuestion(questionSlide)}
          className="m-5"
        >
          Next Slide
        </Button>
      </div>
    );
  };

  const renderQuestionButtons = (questionSlide: QuestionSlide) => {
    return (
      <div className="flex flex-col">
        <Button
          onClick={() => nextSlideAfterQuestion(questionSlide)}
          className="m-5"
        >
          Next Slide
        </Button>
        {questionSlide.showCorrectAnswer === ShowCorrectAnswerTypes.manual && (
          <Button onClick={() => showAnswer(questionSlide)} className="m-5">
            Show Correct Answer
          </Button>
        )}
      </div>
    );
  };
  
  // Render QuizLobby when currentSlide is 0
  if (ongoingQuiz?.currentSlide === 0) {
    return (
      <div className="flex flex-col">
        <QuizLobby
          quizCode={quizCode}
          participants={participants ? participants : []}
        />
        <Button onClick={nextSlide} className="m-5">
          Start Game
        </Button>
      </div>
    );
  } else {
    if (ongoingQuiz?.quiz.slides) {
      const currentSlide = ongoingQuiz?.currentSlide;
      if (ongoingQuiz?.quiz.slides[currentSlide].type == SlideTypes.question) {
        const questionSlide = ongoingQuiz?.quiz.slides[
          currentSlide
        ] as QuestionSlide;
        console.log("Render question slide: ", questionSlide);
        const SlideComponent = getSlideComponents(questionSlide);
        return (
          <div>
            <SlideComponent.Preview slide={questionSlide as never} />
            {renderQuestionButtons(questionSlide)}
          </div>
        );
      } else {
        const slide = ongoingQuiz?.quiz.slides[currentSlide];
        console.log("Render slide: ", slide);
        const SlideComponent = getSlideComponents(slide);
        console.log("Showing slide component: ", SlideComponent);
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
        </h1>
      );
    }
  }
};

export default HostLogic;
