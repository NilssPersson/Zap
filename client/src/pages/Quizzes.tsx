import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import useGetAuthenticatedUser from "@/hooks/useGetAuthenticatedUser";
import { useQuizzes } from "@/hooks/useQuizzes";
import { toast } from "sonner";
import CreateQuizPopover from "@/components/quizzes/CreateQuizPopover";
import QuizList from "@/components/quizzes/QuizList";
import { useOngoingQuizzes } from "@/hooks/useOngoingQuizzes";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";

function useQuizzesPage() {
    const navigate = useNavigate();
    const { user } = useGetAuthenticatedUser();
    const { resources: quizzes, optimisticCreate, optimisticDelete } = useQuizzes();
    const { resources: ongoingQuizzes, optimisticDelete: deleteOngoingQuiz } = useOngoingQuizzes();

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

    const handleDeleteOngoingQuiz = useCallback(async (ongoingQuizId: string) => {
        const { error } = await deleteOngoingQuiz(ongoingQuizId);

        if (error) {
            toast.error("Failed to delete room");
            return;
        }

        toast.success("Room deleted successfully");
    }, [deleteOngoingQuiz]);

    const handleGoToLobby = useCallback((ongoingQuizId: string) => {
        navigate(`/quizzes/${ongoingQuizId}/lobby`);
    }, [navigate]);

    return {
        quizzes,
        ongoingQuizzes,
        handleCreateQuiz,
        handleDeleteQuiz,
        handleDeleteOngoingQuiz,
        handleGoToLobby
    }
}

function Quizzes() {
    const {
        quizzes,
        ongoingQuizzes,
        handleCreateQuiz,
        handleDeleteQuiz,
        handleDeleteOngoingQuiz,
        handleGoToLobby
    } = useQuizzesPage();

    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 overflow-y-auto">
            <Card className="w-full max-w-7xl">
                <CardHeader>
                    <CardTitle>My Rooms</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-2">
                        {ongoingQuizzes.map(ongoingQuiz => (
                            <div key={ongoingQuiz.id} className="flex items-center gap-2 border p-2 rounded">
                                <span>{ongoingQuiz.id}</span>
                                {ongoingQuiz.quiz && <span className="bg-primary text-white p-2 rounded">Quiz: {ongoingQuiz.quiz.quiz_name}</span>}
                                <div className="mr-auto" />
                                <Button variant="outline" onClick={() => handleGoToLobby(ongoingQuiz.id)}>Go to Lobby</Button>
                                <Button variant="destructive" onClick={() => handleDeleteOngoingQuiz(ongoingQuiz.id)}>Delete</Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

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