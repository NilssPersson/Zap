import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import CreateQuizPopover from '@/components/quizzes/CreateQuizPopover';
import QuizList from '@/components/quizzes/QuizList';
import SharedQuizList from '@/components/quizzes/SharedQuizList';
import { useCallback, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SharedQuizzes } from '@/models/Quiz';
import { useAppContext } from '@/contexts/App/context';
import { quizService } from '@/services/quizzes';
import { useTranslation } from 'react-i18next';

function useQuizzesPage() {
  const {
    quizzes: {
      resources: quizzes,
      isLoading: quizzesLoading,
      optimisticCreate,
      optimisticDelete,
      optimisticUpdate,
    },
    user: { user },
    ongoingQuizzes: { resources: ongoingQuizzes },
  } = useAppContext();

  const [sharedQuizzes, setSharedQuizzes] = useState<SharedQuizzes[]>([]);
  const [sharedQuizzesLoading, setSharedQuizzesLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setSharedQuizzesLoading(true);
      quizService.listShared(user.id).then(({ data }) => {
        setSharedQuizzes(data || []);
        setSharedQuizzesLoading(false);
      });
    }
  }, [user]);

  const handleCreateQuiz = useCallback(
    async (name: string) => {
      if (!user) return;

      // Create optimistic quiz from userQuiz data
      const { error } = await optimisticCreate({
        quiz_name: name,
        user_id: user.id,
      });

      if (error) {
        toast.error('Failed to create quiz' + error.message);
        return;
      }

      toast.success('Quiz created successfully');
    },
    [user, optimisticCreate]
  );

  const handleDeleteQuiz = useCallback(
    async (quizId: string) => {
      const { error } = await quizService.deleteQuiz(quizId);

      if (error) {
        toast.error('Failed to delete quiz');
        return;
      }

      optimisticDelete(quizId);
      toast.success('Quiz deleted successfully');
    },
    [optimisticDelete]
  );

  const handleShareQuiz = useCallback(
    async (quizId: string, quizName: string) => {
      if (!user) return;

      const { data: isShared, error } = await quizService.shareQuiz(
        quizId,
        user,
        quizName
      );

      if (error) {
        toast.error('Failed to share quiz');
        return;
      }

      optimisticUpdate(quizId, { isShared: isShared ?? false });
      if (isShared) {
        toast.success(`Quiz ${quizName} was successfully shared`);
      }
    },
    [optimisticUpdate, user]
  );

  const handleCopyQuiz = useCallback(
    async (quiz: SharedQuizzes) => {
      if (!user) return;

      const { data: newQuiz, error } = await quizService.copyQuiz(
        quiz,
        user.id
      );

      if (error || !newQuiz) {
        toast.error('Failed to copy quiz');
        return;
      }

      optimisticCreate(newQuiz, newQuiz.id);
      toast.success('Quiz copied successfully');
    },
    [user, optimisticCreate]
  );

  const ongoingQuiz = ongoingQuizzes.find((quiz) => quiz.quizHost !== user?.id);

  return {
    quizzes,
    quizzesLoading,
    sharedQuizzes,
    sharedQuizzesLoading,
    handleCreateQuiz,
    handleDeleteQuiz,
    handleShareQuiz,
    handleCopyQuiz,
    ongoingQuiz,
  };
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
  } = useQuizzesPage();

  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="h-screen overflow-y-auto bg-background text-foreground">
      <div className="flex flex-col items-center w-full p-5 lg:p-10 h-full max-w-[1800px] mx-auto">
        {/* My Quizzes Section */}
        <div className="w-full flex-col">
          <div className="flex-row flex items-center justify-between">
            <h1 className="font-display text-5xl">{t('homepage:myQuizzes')}</h1>
            <CreateQuizPopover onCreateQuiz={handleCreateQuiz} />
          </div>

          <Card
            className="w-full border-none shadow-none bg-transparent"
            id="quiz-manager-container"
          >
            <CardContent className="p-0 pt-4">
              {quizzesLoading ? (
                <div className="flex justify-center items-center">
                  <Loader2 className="animate-spin" />
                </div>
              ) : (
                <QuizList
                  quizzes={quizzes.map((quiz) => ({
                    quizId: quiz.id,
                    quizName: quiz.quiz_name,
                    userId: quiz.user_id,
                    isHosted: quiz.isHosted,
                    isShared: quiz.isShared,
                    createdAt: quiz.created_at,
                    updatedAt: quiz.updated_at,
                  }))}
                  onDeleteQuiz={handleDeleteQuiz}
                  onShareQuiz={handleShareQuiz}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Shared Quizzes Section */}
        <div className="w-full flex-col mt-10">
          <div className="mb-2 flex justify-between items-center flex-row">
            <h1 className="font-display text-5xl mb-2">
              {t('homepage:sharedQuizzes')}
            </h1>
            <Input
              type="search"
              placeholder={t('homepage:searchShared')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm font-display"
              aria-label={t('homepage:searchShared')}
            />
          </div>
          <Card className="w-full border-none shadow-none bg-transparent">
            <CardContent className="min-h-[300px]">
              {sharedQuizzesLoading ? (
                <div className="flex justify-center items-center h-[300px]">
                  <Loader2 className="animate-spin" />
                </div>
              ) : (
                <SharedQuizList
                  quizzes={sharedQuizzes}
                  onCopyQuiz={handleCopyQuiz}
                  searchTerm={searchTerm}
                />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="w-full flex-col mt-10 pb-10 ">
          <div className="mb-2">
            <h1 className="font-display text-5xl mb-2">
              {t('homepage:templates')}
            </h1>
          </div>
          <Card className="w-full border-none shadow-none bg-transparent">
            <CardContent className="min-h-[300px]">
              {sharedQuizzesLoading ? (
                <div className="flex justify-center items-center h-[300px]">
                  <Loader2 className="animate-spin" />
                </div>
              ) : (
                <SharedQuizList
                  quizzes={sharedQuizzes}
                  onCopyQuiz={handleCopyQuiz}
                  searchTerm={searchTerm}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Quizzes;
