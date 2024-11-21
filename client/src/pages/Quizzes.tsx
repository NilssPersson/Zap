import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import useGetAuthenticatedUser from "@/hooks/useGetAuthenticatedUser";
import { useQuizzes } from "@/hooks/useQuizzes";
import { toast } from "sonner";
import CreateQuizPopover from "@/components/quizzes/CreateQuizPopover";
import QuizList from "@/components/quizzes/QuizList";
import { useCallback } from "react";
import { useGetSharedQuizzes } from "@/hooks/useGetSharedQuizzes";

function useQuizzesPage() {
    const { user } = useGetAuthenticatedUser();
    const { resources: quizzes, optimisticCreate, optimisticDelete, optimisticUpdate } = useQuizzes();
    const { resources: sharedQuizzes } = useGetSharedQuizzes();

    const handleCreateQuiz = useCallback(async (name: string) => {
        if (!user) return;

        const { error } = await optimisticCreate({
            quiz_name: name,
            user_id: user.id,
        });

        if (error) {
            toast.error("Failed to create quiz");
            return;
        }

        toast.success("Quiz created successfully");
    }, [user, optimisticCreate]);

    const handleDeleteQuiz = useCallback(async (quizId: string) => {
        const { error } = await optimisticDelete(quizId);

        if (error) {
            toast.error("Failed to delete quiz");
            return;
        }

        toast.success("Quiz deleted successfully");
    }, [optimisticDelete]);

    const handleShareQuiz = useCallback(async (quizId: string) => {
        const currentShareState = quizzes.find(quiz => quiz.id === quizId)?.isShared;
        const { error } = await optimisticUpdate(quizId, { isShared: !currentShareState });

        const shareString = !currentShareState ? "shared" : "unshared";

        if (error) {
            toast.error(`Failed to ${shareString} quiz`);
            return;
        }

        toast.success(`Quiz ${shareString} successfully`);
    }, [optimisticUpdate, quizzes]);

    return {
        quizzes,
        sharedQuizzes,
        handleCreateQuiz,
        handleDeleteQuiz,
        handleShareQuiz
    }
}

function Quizzes() {
    const {
        quizzes,
        handleCreateQuiz,
        handleDeleteQuiz,
        handleShareQuiz
    } = useQuizzesPage();

    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 overflow-y-auto">
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
                        onShareQuiz={handleShareQuiz}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default Quizzes;