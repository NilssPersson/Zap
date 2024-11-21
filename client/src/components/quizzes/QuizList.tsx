import Quiz from "@/models/Quiz"
import { useNavigate } from "react-router-dom";
import { useOngoingQuiz } from "@/services/host";
import { QuizCard } from "./QuizCard";

interface QuizListProps {
  quizzes: Quiz[];
  onDeleteQuiz: (quizId: string) => Promise<void>;
}

function QuizList({ quizzes, onDeleteQuiz }: QuizListProps) {
  const navigate = useNavigate();
  const { createOngoingQuiz } = useOngoingQuiz();

  const handleHostGame = async (quiz: Quiz) => {
    try {
      const quizCode = await createOngoingQuiz(quiz)
      console.log("Created quiz: ", quizCode);
      if (quizCode) {
        navigate(`/quizzes/${quizCode}/lobby`);
      } else {
        console.error("Failed to create ongoing quiz or quiz_code is missing");
      }
    } catch (err) {
      console.error("Error creating ongoing quiz:", err);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
      {quizzes.map((quiz) => (
        <QuizCard
          key={quiz.id}
          quiz={quiz}
          onHost={handleHostGame}
          onShare={(quiz) => console.log('Share clicked', quiz)}
          onDelete={onDeleteQuiz}
          onClick={() => navigate(`/quizzes/${quiz.id}/edit`)}
        />
      ))}
    </div>
  );
}

export default QuizList; 