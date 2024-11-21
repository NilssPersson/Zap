import Quiz from "@/models/Quiz"
import { useNavigate } from "react-router-dom";
import { useOngoingQuiz } from "@/services/host";
import { QuizCard, MyQuizButtons } from "./QuizCard";

interface QuizListProps {
  quizzes: Quiz[];
  onDeleteQuiz: (quizId: string) => Promise<void>;
  onShareQuiz: (quizId: string) => Promise<void>;
}

function QuizList({ quizzes, onDeleteQuiz, onShareQuiz }: QuizListProps) {
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
    <div className="flex overflow-x-auto overflow-y-visible gap-2 pb-2">
      {[...quizzes]
        .sort((a, b) => {
          const aDate = a.updated_at || a.created_at;
          const bDate = b.updated_at || b.created_at;
          return new Date(bDate).getTime() - new Date(aDate).getTime();
        })
        .map((quiz) => (
          <div key={quiz.id} className="flex-none w-[300px]">
            <QuizCard
              quiz={quiz}
              onClick={() => navigate(`/quizzes/${quiz.id}/edit`)}
            >
              <MyQuizButtons 
                quiz={quiz} 
                onHost={handleHostGame} 
                onShare={onShareQuiz}
                onDelete={onDeleteQuiz} 
              />
            </QuizCard>
          </div>
        ))}
    </div>
  );
}

export default QuizList; 