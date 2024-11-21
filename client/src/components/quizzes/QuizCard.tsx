import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Quiz from "@/models/Quiz";
import { SlidePreview } from "../quiz-editor/SlidePreview";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ReactNode } from "react";
import { Share } from "lucide-react";

interface QuizCardProps {
    quiz: Quiz;
    onClick: () => void;
    children?: ReactNode;
}

export function QuizCard({ quiz, onClick, children }: QuizCardProps) {
    return (
        <Card
            className="cursor-pointer"
            onClick={onClick}
        >
            <CardHeader>
                <div className="flex items-center gap-2">
                    <CardTitle className="text-lg mr-auto">{quiz.quiz_name}</CardTitle>
                    {quiz.isShared && (
                        <div className="bg-primary text-white p-1 rounded flex flex-row">
                            <Share className="w-4 h-4" />
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {quiz.slides && quiz.slides.length > 0 ? (
                    <div className="aspect-video w-full rounded overflow-hidden text-white">
                        <SlidePreview slide={quiz.slides[0]} {...quiz.settings} />
                    </div>
                ) : (
                    <div className="aspect-video w-full">
                        <div className="h-full w-full bg-gray-200 animate-pulse rounded flex items-center justify-center">
                            <span>No slides yet</span>
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter className="gap-2 flex-wrap">
                {children}
            </CardFooter>
        </Card>
    );
}

interface MyQuizButtonsProps {
    quiz: Quiz;
    onHost: (quiz: Quiz) => Promise<void>;
    onShare: (quizId: string) => Promise<void>;
    onDelete: (quizId: string) => Promise<void>;
}

export function MyQuizButtons({ quiz, onHost, onShare, onDelete }: MyQuizButtonsProps) {
    return (
        <>
            <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                    e.stopPropagation();
                    onHost(quiz);
                }}
            >
                Host
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                    e.stopPropagation();
                    onShare(quiz.id);
                }}
            >
                Share
            </Button>
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        Delete
                    </Button>
                </DialogTrigger>
                <DialogContent onClick={(e) => e.stopPropagation()}>
                    <DialogHeader>
                        <DialogTitle>Delete Quiz</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{quiz.quiz_name}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <div className="flex justify-end gap-2 mt-4">
                            <DialogClose asChild>
                                <Button
                                    variant="outline"
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button
                                    variant="destructive"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(quiz.id);
                                    }}
                                >
                                    Delete
                                </Button>
                            </DialogClose>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
} 