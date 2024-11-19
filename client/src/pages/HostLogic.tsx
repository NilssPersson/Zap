import React, { useEffect, useState } from "react";
import { useParams /* useNavigate */ } from "react-router-dom";
import { useOngoingQuiz } from "@/services/host";
import QuizLobby from "./QuizLobby";
import { Button } from "@/components/ui/button";
const HostLogic: React.FC = () => {
  const { id } = useParams();
  const [ongoingQuiz, setOngoingQuiz] = useState<any | null>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { quizCode, participants, incrementSlide, getOngoingQuiz } =
    useOngoingQuiz();

  useEffect(() => {
    const setupLobby = async () => {
      try {
        const currentQuiz = await getOngoingQuiz(id || "");

        // Add initial participants from database
        if (currentQuiz) {
          setOngoingQuiz(currentQuiz);
        }
      } catch (error) {
        console.error("Error setting up lobby:", error);
      }
    };

    setupLobby();
  }, [id]);

  const updateScore = async () => {
    // Save old score
    // 1000 poäng
  };

  const nextSlide = async () => {
    await updateScore();
    const startedQuiz = await incrementSlide(quizCode);
    setCurrentSlide(startedQuiz?.currentSlide);
    setOngoingQuiz(startedQuiz);
  };

  if (ongoingQuiz?.currentSlide === 0) {
    // Render QuizLobby when currentSlide is 0 Record<string, Participant>
    return (
      <div className="flex flex-col">
        <QuizLobby
          quizCode={quizCode}
          participants={participants ? participants : {}}
        />
        <Button onClick={nextSlide} className="m-5">
          Start Game
        </Button>
      </div>
    );
  } else {
    switch (ongoingQuiz?.slides[currentSlide]?.type) {
      case "info": {
        //statements;
        break;
      }
      case "question": {
        switch (ongoingQuiz?.slides[currentSlide]?.type) {
          case "MCQ": {
            return (
              <div className="flex flex-col">
                <Button onClick={nextSlide} className="m-5">
                  Start Game
                </Button>
              </div>
            );
            break;
          }
          default: {
            return (
              <div className="flex flex-col">
                <Button onClick={nextSlide} className="m-5">
                  Start Game
                </Button>
              </div>
            );
          }
        }
      }
      case "score": {
        return <div></div>;
        break;
      }
      default: {
        <div className="flex flex-col">
          <Button onClick={nextSlide} className="m-5">
            Start Game
          </Button>
        </div>;
      }
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
