import { Button } from "@/components/ui/button";
import Quiz from "@/models/Quiz"
import { useNavigate } from "react-router-dom";
import { useOngoingQuiz } from "@/services/host";

interface QuizListProps {
    quizzes: Quiz[];
    onDeleteQuiz: (quizId: string) => Promise<void>;
}

function QuizList({ quizzes, onDeleteQuiz}: QuizListProps) {
    const navigate = useNavigate();
    const {createOngoingQuiz} =
      useOngoingQuiz();

    const handleHostGame = async ( quizHost: string) => {
      try {
        const quizCode = await createOngoingQuiz(quizHost)
        console.log("Created quiz: ", quizCode);
        if (quizCode) {
          navigate(`/quizzes/${quizCode}/lobby`);
        } else {
          console.error(
            "Failed to create ongoing quiz or quiz_code is missing"
          );
        }
      }catch(err) {
            console.error("Error creating ongoing quiz:", err);
      }
    };


    return (
      <div className="mt-4 space-y-2">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="flex items-center gap-2 p-2 border rounded"
          >
            <span className="flex-1">{quiz.quiz_name}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleHostGame(quiz.user_id)}
            >
              Host Game
            </Button>{" "}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/quizzes/${quiz.id}/edit`)}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDeleteQuiz(quiz.id)}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    );
}

export default QuizList; 