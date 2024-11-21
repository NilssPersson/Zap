import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Quiz from "@/models/Quiz";
import { SlidePreview } from "../quiz-editor/SlidePreview";

interface QuizCardProps {
  quiz: Quiz;
  onHost: (quiz: Quiz) => Promise<void>;
  onShare?: (quiz: Quiz) => void;
  onDelete: (quizId: string) => Promise<void>;
  onClick: () => void;
}

export function QuizCard({ quiz, onHost, onShare, onDelete, onClick }: QuizCardProps) {
  return (
    <Card 
      className="transition-transform hover:scale-[101%] cursor-pointer"
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="text-lg">{quiz.quiz_name}</CardTitle>
      </CardHeader>
      <CardContent>
        {quiz.slides && quiz.slides.length > 0 ? (
          <div className="aspect-video w-full rounded overflow-hidden">
            <SlidePreview slide={quiz.slides[0]} />
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
            onShare?.(quiz);
          }}
        >
          Share
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(quiz.id);
          }}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
} 