import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner";
import CreateQuizPopover from "@/components/quizzes/CreateQuizPopover";
import QuizList from "@/components/quizzes/QuizList";
import { useCallback, useState } from "react";
import { useGetSharedQuizzes } from "@/hooks/useGetSharedQuizzes";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Quiz from "@/models/Quiz";
import { useAppContext } from "@/contexts/App/context";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function useQuizzesPage() {
    const {
        quizzes: {
            resources: quizzes,
            isLoading: quizzesLoading,
            optimisticCreate,
            optimisticDelete,
            optimisticUpdate
        },
        user: { user },
        ongoingQuizzes: { resources: ongoingQuizzes }
    } = useAppContext();

    const { resources: sharedQuizzes, isLoading: sharedQuizzesLoading } = useGetSharedQuizzes(user?.id || "")();

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

    const handleCopyQuiz = useCallback(async (quiz: Quiz) => {
        if (!user) return;

        const { data, error } = await optimisticCreate({
            ...quiz,
            quiz_name: `${quiz.quiz_name} (Copy)`,
            user_id: user.id,
            isShared: false,
            updated_at: new Date().toLocaleString()
        });

        if (error || !data) {
            toast.error("Failed to copy quiz");
            return;
        }

        const { error: updateError } = await optimisticUpdate(data.id, { id: data.id });

        if (updateError) {
            toast.error("Failed to copy quiz");
            return;
        }

        toast.success("Quiz copied successfully");
    }, [user, optimisticCreate, optimisticUpdate]);

    const ongoingQuiz = ongoingQuizzes.find(quiz => quiz.quizHost === user?.id);

    return {
        quizzes,
        quizzesLoading,
        sharedQuizzes,
        sharedQuizzesLoading,
        handleCreateQuiz,
        handleDeleteQuiz,
        handleShareQuiz,
        handleCopyQuiz,
        ongoingQuiz
    }
}

function Quizzes() {
    const {
        quizzes,
        quizzesLoading,
        sharedQuizzes,
        sharedQuizzesLoading,
        handleCreateQuiz,
        handleDeleteQuiz,
        handleShareQuiz,
        handleCopyQuiz,
        ongoingQuiz
    } = useQuizzesPage();

    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 overflow-y-auto">
            <Card className="w-full max-w-7xl">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <span>My Quizzes</span>
                        {ongoingQuiz && <Button variant="outline" onClick={() => navigate(`/quizzes/${ongoingQuiz.id}/lobby`)}>Goto Ongoing Quiz</Button>}
                        <CreateQuizPopover onCreateQuiz={handleCreateQuiz} />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {quizzesLoading ? (
                        <div className="flex justify-center items-center h-[300px] w-full">
                            <Loader2 className="animate-spin" />
                        </div>
                    ) : (
                        <QuizList
                            quizzes={quizzes}
                            variant="my-quizzes"
                            onDeleteQuiz={handleDeleteQuiz}
                            onShareQuiz={handleShareQuiz}
                        />
                    )}
                </CardContent>
            </Card>

            <Card className="w-full max-w-7xl">
                <CardHeader>
                    <CardTitle>
                        <div className="flex items-center gap-4">
                            <span className="m-0">Shared Quizzes</span>
                            <div className="flex items-center gap-2">
                                <Search className="w-4 h-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search shared quizzes..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="max-w-lg"
                                />
                            </div>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {sharedQuizzesLoading ? (
                        <div className="flex justify-center items-center h-[300px] w-full">
                            <Loader2 className="animate-spin" />
                        </div>
                    ) : (
                        <QuizList
                            quizzes={sharedQuizzes}
                            variant="shared-quizzes"
                            onCopyQuiz={handleCopyQuiz}
                            searchTerm={searchTerm}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default Quizzes;