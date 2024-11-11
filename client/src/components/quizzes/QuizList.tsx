import { Button } from "@/components/ui/button";
import Quiz from "@/models/Quiz"
import { useNavigate } from "react-router-dom";

interface QuizListProps {
    quizzes: Quiz[];
    onDeleteQuiz: (quizId: string) => Promise<void>;
}

function QuizList({ quizzes, onDeleteQuiz }: QuizListProps) {
    const navigate = useNavigate();

    return (
        <div className="mt-4 space-y-2">
            {quizzes.map((quiz) => (
                <div key={quiz.id} className="flex items-center gap-2 p-2 border rounded">
                    <span className="flex-1">{quiz.quiz_name}</span>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/quizzes/${quiz.id}/edit`)}>
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