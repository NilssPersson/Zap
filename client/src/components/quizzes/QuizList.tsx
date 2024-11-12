import { Button } from "@/components/ui/button";
import Quiz from "@/models/Quiz"
import { useNavigate } from "react-router-dom";
// import { useOngoingQuiz } from "@/hooks/useOngoingQuizzes";

import supabase from "@/api/client";


interface QuizListProps {
    quizzes: Quiz[];
    onDeleteQuiz: (quizId: string) => Promise<void>;
}



function QuizList({ quizzes, onDeleteQuiz }: QuizListProps) {
    const navigate = useNavigate();
    // const {
    //   ongoingQuiz,
    // quizParticipants,
    // isLoading,
    // error,
    // getOngoingQuiz,
    // getParticipants,
    // createOngoingQuiz,
    // } = useOngoingQuiz();

    const handleHostGame = async (quizId: string, quizHost: string) => {
      try {
        const quizCode = "ABCDEF";
        const today = new Date().toISOString();
         // Add quiz to ongoing quizes
        const { data, error } = await supabase
          .from("QuizOngoing")
          .insert([
            {
              quiz_code: quizCode,
              host_user_id: quizHost,
              created_quiz_id: quizId,
              started_at: today,
              question_number: 0,
            },
          ]) 
          .select()
          .single();

        if (error) {
          throw error;
        }
        if (data) {
          navigate(`/quizzes/${quizCode}/lobby`);
        }
        // createOngoingQuiz(quizHost, quizId)

        // if (ongoingQuiz) {
        //   navigate(`/quizzes/${ongoingQuiz.quiz_code}/lobby`);
        // }
      } catch (error) {
        console.error("Failed to start hosting the game:", error);
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
              onClick={() => handleHostGame(quiz.id, quiz.user_id)}
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