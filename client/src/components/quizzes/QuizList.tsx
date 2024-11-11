import { Button } from "@/components/ui/button";
import Quiz from "@/models/Quiz"

interface QuizListProps {
    quizzes: Quiz[];
    onDeleteQuiz: (quizId: string) => Promise<void>;
}

function QuizList({ quizzes, onDeleteQuiz }: QuizListProps) {
    return (
        <div className="mt-4 space-y-2">
            {quizzes.map((quiz) => (
                <div key={quiz.id} className="flex items-center justify-between p-2 border rounded">
                    <span>{quiz.quiz_name}</span>
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