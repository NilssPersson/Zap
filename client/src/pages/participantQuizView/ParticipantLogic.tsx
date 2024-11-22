import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ParticipantService, useGameStatus } from "@/services/participant";
import TeamInfo from "./components/teamInfo";
import CreateParticipant from "./components/CreateParticipant";
import { LogOut } from "lucide-react";
import { useCookies } from "react-cookie";
import LobbyView from "@/pages/participantQuizView/components/LobbyView";
import HasAnsweredView from "@/pages/participantQuizView/components/HasAnsweredView";
import QuizEndedView from "@/pages/participantQuizView/components/QuizEndedView";
import { Participant, Slide } from "@/models/Quiz";
import { getSlideComponents } from "@/slides/utils";

function QuizView({
  questions,
  currentSlide,
  participantData,
  answerQuestion,
  showAnswer,
}: {
  questions: Slide[] | undefined;
  currentSlide: number;
  participantData: Participant;
  answerQuestion: (answer: string[]) => Promise<void>;
  showAnswer: boolean;
}) {
  if (!questions || !participantData) return <div>Loading Questions...</div>;
  if (currentSlide === 0) return <LobbyView />;
  if (currentSlide > questions.length) return <QuizEndedView />;

  const currentQuestion = questions[currentSlide - 1];
  const SlideComponent = getSlideComponents(currentQuestion);

  // If we are on a question slide render the corresponding answerView
  if (showAnswer) {
    return (
      <SlideComponent.ParticipantAnswer
        slide={currentQuestion as never}
        participant={participantData}
      />
    );
  }

  if (participantData.hasAnswered) return <HasAnsweredView />;

  return (
    <SlideComponent.Participant
      slide={currentQuestion as never}
      answerQuestion={answerQuestion}
    />
  );
}

export default function ParticipantLogic() {
  const { quizCode } = useParams();
  const [participantId, setParticipantId] = useState<string | undefined>(
    undefined,
  );
  const [cookies, setCookie, removeCookie] = useCookies(["participantId"]);
  const [questions, setQuestions] = useState<Slide[]>();
  const navigate = useNavigate();

  const { currentSlide, participantData, showAnswer } = useGameStatus(
    quizCode as string,
    participantId as string,
  );

  // Fetch quiz and participant data
  useEffect(() => {
    const initialize = async () => {
      if (!quizCode) return;

      try {
        // Check if the ongoingQuiz exists, if not send the player back to /play
        const quizExists = await ParticipantService.checkIfGameExists(quizCode);
        if (!quizExists) {
          navigate("/play");
          removeCookie("participantId");
          return;
        }

        // Check if a cookie exists
        if (cookies.participantId) {
          const participant = await ParticipantService.getParticipant(
            quizCode,
            cookies.participantId,
          );
          // Check if the cookie corresponds to a participant in this ongoingQuiz
          if (participant) {
            setParticipantId(cookies.participantId);

            const slides = await ParticipantService.getQuizSlides(quizCode);
            setQuestions(slides);
          } else {
            // Cookie corresponds to participant in different quiz, remove it
            removeCookie("participantId");
            setParticipantId(undefined);
          }
        }
      } catch (error) {
        console.error("Error initializing quiz:", error);
      }
    };

    initialize();
  }, [quizCode, cookies, navigate, removeCookie]);

  const handleRemoveParticipant = async () => {
    if (!quizCode || !participantId) return;
    try {
      const success = await ParticipantService.removeParticipant(
        quizCode,
        participantId,
      );
      if (success) {
        removeCookie("participantId");
        navigate("/play");
      }
    } catch (error) {
      console.error("Error removing participant:", error);
    }
  };

  const handleAddParticipant = async (
    participantName: string,
    participantAvatar: string,
  ) => {
    if (!quizCode || !participantName || !participantAvatar) return;
    try {
      const createdId = await ParticipantService.addParticipant(
        quizCode,
        participantName,
        participantAvatar,
      );
      if (createdId) {
        setCookie("participantId", createdId);
        setParticipantId(createdId);
        const slides = await ParticipantService.getQuizSlides(quizCode);
        setQuestions(slides);
      }
    } catch (error) {
      console.error("Error adding participant:", error);
    }
  };

  const answerQuestion = async (answer: string[]) => {
    if (!quizCode || !participantId || !answer) return;
    try {
      await ParticipantService.addAnswer(
        quizCode,
        participantId,
        answer,
        currentSlide - 1,
      );
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  if (!participantId || !participantData) {
    return <CreateParticipant handleAddParticipant={handleAddParticipant} />;
  }

  return (
    <div>
      {/* Top: Leave functionality */}
      <div className="fixed top-2 left-2 bg-[#F4F3F2] text-[#333333] rounded-md">
        <Button variant="ghost" onClick={handleRemoveParticipant}>
          <LogOut />
          Leave
        </Button>
      </div>

      {/* Middle: Quiz Question */}
      <QuizView
        questions={questions}
        currentSlide={currentSlide}
        participantData={participantData}
        answerQuestion={answerQuestion}
        showAnswer={showAnswer}
      />

      {/* Bottom: Team info */}
      <TeamInfo participant={participantData} />
    </div>
  );
}
