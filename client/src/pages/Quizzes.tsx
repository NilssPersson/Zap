import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import useGetAuthenticatedUser from "@/hooks/useGetAuthenticatedUser";
import { useQuizzes } from "@/hooks/useQuizzes";
import { toast } from "sonner";
import CreateQuizPopover from "@/components/quizzes/CreateQuizPopover";
import QuizList from "@/components/quizzes/QuizList";

function Quizzes() {
    const { user } = useGetAuthenticatedUser();
    const { resources: quizzes, optimisticCreate, optimisticDelete } = useQuizzes();

    const handleCreateQuiz = async (name: string) => {
        if (!user) return;

        const { error } = await optimisticCreate({
            quiz_name: name,
            user_id: user.id
        });

        if (error) {
            toast.error("Failed to create quiz");
            return;
        }

        toast.success("Quiz created successfully");
    };

    const handleDeleteQuiz = async (quizId: string) => {
        const { error } = await optimisticDelete(quizId);

        if (error) {
            toast.error("Failed to delete quiz");
            return;
        }

        toast.success("Quiz deleted successfully");
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center">
            <Card className="w-full max-w-7xl">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <span>My Quizzes</span>
                        <CreateQuizPopover onCreateQuiz={handleCreateQuiz} />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <QuizList 
                        quizzes={quizzes}
                        onDeleteQuiz={handleDeleteQuiz}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default Quizzes;