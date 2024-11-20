import React, { useEffect, useState } from "react";
import { useParams /* useNavigate */ } from "react-router-dom";
import { useOngoingQuiz } from "@/services/host";
import QuizLobby from "./QuizLobby";
import { Button } from "@/components/ui/button";
import {
  OngoingQuiz,
  QuestionSlide,
  QuestionTypes,
  SlideTypes,
  showCorrectAnswerTypes,
} from "@/models/Quiz";

export interface LatestScore {
  id: string;
  score: number;
}

const HostLogic: React.FC = () => {
  const { id } = useParams();
  const [ongoingQuiz, setOngoingQuiz] = useState<OngoingQuiz>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState(-1); // -1 indicates no time limit
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const [latestScore, setLatestScore] = useState<LatestScore[]>([]);
  const {
    quizCode,
    participants,
    totalAnswers,
    incrementSlide,
    getOngoingQuiz,
    updateScore,
    getScore,
    setIsShowingAnswer,
  } = useOngoingQuiz();

  useEffect(() => {
    if(timeLeft == -1) return;
    // We only use timer on question slides
    if ((timeLeft <= 0 || !isTimerRunning)) {
      showAnswer(ongoingQuiz?.quiz.slides[currentSlide] as QuestionSlide)
    };

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    // Clear the interval once the timer is finished or paused
    return () => clearInterval(timer);
  }, [timeLeft, totalAnswers, isTimerRunning]);

  useEffect(() => {
    const setupLobby = async () => {
      try {
        const currentQuiz = await getOngoingQuiz(id || "");
        if (currentQuiz) {
          setOngoingQuiz(currentQuiz);
        }
        const currentLatestScore = await getScore(id || "");
        setLatestScore(currentLatestScore);
      } catch (error) {
        console.error("Error setting up lobby:", error);
      }
    };

    setupLobby();
  }, [id]);

  const nextSlide = async () => {
    const startedQuiz = await incrementSlide(quizCode);
    setCurrentSlide(startedQuiz?.currentSlide);
    setOngoingQuiz(startedQuiz);
  };

  const nextSlideQuestion = async (question: QuestionSlide) => {
    setLatestScore(await getScore(id || ""));
    await updateScore(quizCode, question);
    const startedQuiz = await incrementSlide(quizCode);
    setCurrentSlide(startedQuiz?.currentSlide);
    setOngoingQuiz(startedQuiz);
  };

  const showAnswer = async (questionSlide: QuestionSlide) => {
    setIsShowingAnswer(id ? id : "", true);
    return (
      <div>
        <h1>Visar svaren</h1>
        <Button
          onClick={() => nextSlideQuestion(questionSlide)}
          className="m-5"
        >
          Next Slide
        </Button>
      </div>
    );
  };

  const renderQuestionUtils = async (questionSlide: QuestionSlide) => {
    setIsTimerRunning(true);
    if (questionSlide.timeLimit === 0) {
      setTimeLeft(-1);
    } else {
      setTimeLeft(questionSlide.timeLimit);
    }

    return (
      <div className="flex flex-col">
        <Button
          onClick={() => nextSlideQuestion(questionSlide)}
          className="m-5"
        >
          Next Slide
        </Button>
        {questionSlide.showCorrectAnswer === showCorrectAnswerTypes.manual && (
          <Button
            onClick={() => showAnswer(questionSlide)} // Replace with your logic to show the correct answer
            className="m-5"
          >
            Show Correct Answer
          </Button>
        )}
      </div>
    );
  };

  if (ongoingQuiz?.currentSlide === 0) {
    // Render QuizLobby when currentSlide is 0 Record<string, Participant>
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
      switch (ongoingQuiz?.quiz.slides[currentSlide].type) {
        case SlideTypes.info: {
          <div className="flex flex-col">
            <Button onClick={nextSlide} className="m-5">
              Start Game
            </Button>
          </div>;
          break;
        }
        case SlideTypes.score: {
          <div className="flex flex-col">
            <Button onClick={nextSlide} className="m-5">
              Start Game
            </Button>
          </div>;
          break;
        }
        case SlideTypes.question: {
          const questionSlide = ongoingQuiz?.quiz.slides[
            currentSlide
          ] as QuestionSlide;
          switch (questionSlide.questionType) {
            case QuestionTypes.FA: {
              renderQuestionUtils(questionSlide);
              break;
            }
            case QuestionTypes.MCQMA: {
              renderQuestionUtils(questionSlide);
              break;
            }
            case QuestionTypes.MCQSA: {
              renderQuestionUtils(questionSlide);
              break;
            }
            case QuestionTypes.RANK: {
              renderQuestionUtils(questionSlide);
              break;
            }
            default: {
              renderQuestionUtils(questionSlide);
              break;
            }
          }
          break;
        }
        default: {
          console.log("default");
          <div className="flex flex-col">
            <Button onClick={nextSlide} className="m-5">
              Start Game
            </Button>
          </div>;
        }
      }
    } else {
      return (
        <h1 className="text-5xl font-display">
          Your Quiz is missing slides :(
        </h1>
      );
    }
  }

  return (
    <div className="lobby-container">
      <h1></h1>
      <h1>Lobby for Quiz {id}</h1>
      <h1>Current slide {ongoingQuiz?.currentSlide}</h1>
      <h2>Participants:</h2>
      <ul>
        {ongoingQuiz?.participants &&
          Object.entries(participants ? participants : {}).map(
            ([id, participant]) => <li key={id}>{participant.name}</li>
          )}
      </ul>
      <button onClick={nextSlide}>Start Game</button>
    </div>
  );
};

export default HostLogic;
