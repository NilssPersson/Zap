import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import useGetAuthenticatedUser from "@/hooks/useGetAuthenticatedUser";
import { useQuizzes } from "@/hooks/useQuizzes";
import { toast } from "sonner";
import CreateQuizPopover from "@/components/quizzes/CreateQuizPopover";
import QuizList from "@/components/quizzes/QuizList";
import { useCallback, useState } from "react";
import { useGetSharedQuizzes } from "@/hooks/useGetSharedQuizzes";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Quiz from "@/models/Quiz";

function useQuizzesPage() {
    const { user } = useGetAuthenticatedUser();
    const { resources: quizzes, isLoading: quizzesLoading, optimisticCreate, optimisticDelete, optimisticUpdate } = useQuizzes();
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
        toast.success("This feature will be implemented soon!");
    }, []);

    return {
        quizzes,
        quizzesLoading,
        sharedQuizzes,
        sharedQuizzesLoading,
        handleCreateQuiz,
        handleDeleteQuiz,
        handleShareQuiz,
        handleCopyQuiz
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
        handleCopyQuiz
    } = useQuizzesPage();

    const [searchTerm, setSearchTerm] = useState("");

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