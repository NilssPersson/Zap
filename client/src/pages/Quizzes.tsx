import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import CreateQuizPopover from '@/components/quizzes/CreateQuizPopover';
import QuizList from '@/components/quizzes/QuizList';
import SharedQuizList from '@/components/quizzes/SharedQuizList';
import { useCallback, useEffect, useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SharedQuizzes, UserQuizzes } from '@/models/Quiz';
import { useAppContext } from '@/contexts/App/context';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { quizService } from '@/services/quizzes';
import { useTranslation } from 'react-i18next';
import { database } from '@/firebase';
import { ref, remove, set, update, get } from 'firebase/database';
import { nanoid } from 'nanoid';

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
  const [userQuizzes, setUserQuizzes] = useState<UserQuizzes[]>([]);
  const [userQuizzesLoading, setUserQuizzesLoading] = useState(false);

  console.log('Shared quizzes:', sharedQuizzes);
  console.log('My quizzes:', userQuizzes);
  console.log('Ongoing quizzes:', ongoingQuizzes);

  useEffect(() => {
    if (user) {
      setSharedQuizzesLoading(true);
      setUserQuizzesLoading(true);
      quizService.listShared(user.id).then(({ data }) => {
        setSharedQuizzes(data || []);
        setSharedQuizzesLoading(false);
      });
      quizService.listUserQuizzes(user.id).then(({ data }) => {
        setUserQuizzes(data || []);
        setUserQuizzesLoading(false);
      });
    }
  }, [user]);

  const handleCreateQuiz = useCallback(
    async (name: string) => {
      if (!user) return;

      const { data } = await quizService.createQuiz({
        quiz_name: name,
        user_id: user.id,
      });

      if (!data) {
        toast.error('Failed to create quiz');
        return;
      }

      setUserQuizzes((userQuizzes) => [...userQuizzes, data]);
    },
    [user, optimisticCreate]
  );

  const handleDeleteQuiz = useCallback(
    async (quizId: string) => {
      const userQuizRef = ref(database, `userQuizzes/${quizId}`);
      const quizRef = ref(database, `quizzes/${quizId}`);
      const sharedQuizRef = ref(database, `sharedQuizzes/${quizId}`);

      await Promise.all([
        remove(userQuizRef),
        remove(quizRef),
        remove(sharedQuizRef),
      ])
        .then(() => {
          toast.success('Quiz deleted successfully');
          setUserQuizzes((userQuizzes) =>
            userQuizzes.filter((quiz) => quiz.quizId !== quizId)
          );
        })
        .catch(() => {
          toast.error('Failed to delete quiz');
        });
    },
    [optimisticDelete]
  );

  const handleShareQuiz = useCallback(
    async (quizId: string, quizName: string) => {
      if (!user) return;
      console.log('Sharing quiz:', quizId);
      console.log(user);

      const sharedQuizRef = ref(database, `sharedQuizzes/${quizId}`);

      const sharedQuizSnap = await get(sharedQuizRef);

      if (sharedQuizSnap.exists()) {
        await remove(sharedQuizRef);
        const userQuizRef = ref(database, `userQuizzes/${quizId}`);
        await update(userQuizRef, { isShared: false });
        setUserQuizzes((userQuizzes) =>
          userQuizzes.map((quiz) =>
            quiz.quizId === quizId ? { ...quiz, isShared: false } : quiz
          )
        );
        return;
      }

      const newShared: SharedQuizzes = {
        userId: user.id,
        userName: user.username || 'NoName',
        userAvatar: user.avatar || 'NoAvatar',
        quizId: quizId,
        quizName: quizName,
        sharedAt: new Date().toLocaleString(),
      };

      await set(sharedQuizRef, newShared);

      const userQuizRef = ref(database, `userQuizzes/${quizId}`);
      await update(userQuizRef, { isShared: true });
      setUserQuizzes((userQuizzes) =>
        userQuizzes.map((quiz) =>
          quiz.quizId === quizId ? { ...quiz, isShared: true } : quiz
        )
      );
      toast.success(`Quiz ${quizName} was successfully shared`);
    },
    [optimisticUpdate, quizzes]
  );

  const handleCopyQuiz = useCallback(
    async (quiz: SharedQuizzes) => {
      if (!user) return;

      console.log('Copying quiz:', quiz);

      const quizRef = ref(database, `quizzes/${quiz.quizId}`);

      const quizData = await get(quizRef);

      if (!quizData.exists()) {
        toast.error('Failed to copy quiz');
        return;
      }

      const newQuizId = nanoid();
      const newQuizRef = ref(database, `quizzes/${newQuizId}`);
      await set(newQuizRef, {
        ...quizData.val(),
        id: newQuizId,
        quiz_name: `${quizData.val().quiz_name} (Copy)`,
        user_id: user.id,
        isShared: false,
        updated_at: new Date().toLocaleString(),
      });

      const userQuizRef = ref(database, `userQuizzes/${newQuizId}`);
      await set(userQuizRef, {
        userId: user.id,
        quizId: newQuizId,
        quizName: `${quizData.val().quiz_name} (Copy)`,
        isHosted: false,
        isShared: false,
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString(),
      });

      toast.success('Quiz copied successfully');
    },
    [user, optimisticCreate, optimisticUpdate]
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
    userQuizzes,
    userQuizzesLoading,
  };
}

function Quizzes() {
  const {
    sharedQuizzes,
    sharedQuizzesLoading,
    handleCreateQuiz,
    handleDeleteQuiz,
    handleShareQuiz,
    handleCopyQuiz,
    ongoingQuiz,
    userQuizzes,
    userQuizzesLoading,
  } = useQuizzesPage();

  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex-1 flex flex-col items-center justify-around gap-4 overflow-y-auto p-4">
      <Card className="w-full max-w-7xl">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{t('homepage:myQuizzes')}</span>
            {ongoingQuiz && (
              <Button
                variant="outline"
                onClick={() => navigate(`/quizzes/${ongoingQuiz.id}/lobby`)}
              >
                {t('homepage:gotoOngoing')}
              </Button>
            )}
            <CreateQuizPopover onCreateQuiz={handleCreateQuiz} />
          </CardTitle>
        </CardHeader>
        <CardContent className="min-h-[300px]">
          {userQuizzesLoading ? (
            <div className="flex justify-center items-center h-[300px] w-full">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <QuizList
              quizzes={userQuizzes}
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
              <span className="m-0">{t('homepage:sharedQuizzes')}</span>
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t('homepage:searchShared')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-lg"
                />
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="min-h-[300px]">
          {sharedQuizzesLoading ? (
            <div className="flex justify-center items-center h-[300px] w-full">
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
  );
}

export default Quizzes;
