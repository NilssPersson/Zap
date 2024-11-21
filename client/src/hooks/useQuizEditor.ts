import { useState, useEffect } from 'react';
import { quizService } from '@/services/quizzes';
import type Quiz from '@/models/Quiz';
import { type Slide, type SlideType, type QuestionType, QuizSettings } from '@/models/Quiz';
import { toast } from 'sonner';
import { quizDefaults } from '@/components/quiz-editor/utils/quiz-defaults';
import { getSlideComponentsFromType } from '@/slides/utils';

const DEFAULT_TIME_LIMIT = 0;

export function useQuizEditor(quizId: string | undefined) {
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeSlideId, setActiveSlideId] = useState<string | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Fetch quiz and slides
    useEffect(() => {
        async function fetchQuizAndSlides() {
            if (!quizId) return;
            setIsLoading(true);

            try {
                const { data, error } = await quizService.getById(quizId)

                if (error) {
                    setError(error.message);
                    return;
                }
                setQuiz(data);
                setActiveSlideId(data?.slides?.[0]?.id || null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        }

        fetchQuizAndSlides();
    }, [quizId]);

    // Save all slides
    const handleSave = async () => {
        if (!quizId || !quiz) return;
        setIsSaving(true);

        const savePromise = new Promise((resolve, reject) => {
            quizService.update(quizId, quiz)
                .then(({ error: saveError }) => {
                    if (saveError) {
                        setError(saveError.message);
                        reject(saveError.message);
                        return false;
                    }
                    resolve('Slides saved successfully');
                    return true;
                })
                .catch(reject);
        });

        toast.promise(savePromise, {
            loading: 'Saving slides...',
            success: 'Slides saved successfully',
            error: (err) => `Error: ${err}`
        });
    };

    const handleAddSlide = (type: SlideType, questionType?: QuestionType) => {
        const baseSlide = {
            id: crypto.randomUUID(),
            title: `New ${type} slide`,
            content: '',
            backgroundStyle: 'waves' as const,
            type,
        };

        const SlideInfo = getSlideComponentsFromType(type, questionType).Info;

        const newSlide = {
            ...baseSlide,
            ...SlideInfo.defaults,
            ...(questionType ? {
                questionType,
                timeLimit: DEFAULT_TIME_LIMIT,
                showCorrectAnswer: quiz?.settings?.showCorrectAnswerDefault ?? quizDefaults.showCorrectAnswerDefault
            } : {}),
        } as Slide;

        setQuiz(prev => prev ? { ...prev, slides: [...(prev.slides || []), newSlide] } : null);
        setActiveSlideId(newSlide.id);
    };

    const handleSlideUpdate = (updatedSlide: Slide) => {
        setQuiz(prev => prev ? {
            ...prev, slides: prev.slides.map(slide =>
                slide.id === updatedSlide.id ? updatedSlide : slide
            )
        } : null);
    };

    const handleSlideDelete = (slideId: string) => {
        setQuiz(prev => prev ? { ...prev, slides: prev.slides.filter(slide => slide.id !== slideId) } : null);
        if (activeSlideId === slideId) {
            setActiveSlideId(quiz?.slides.find(s => s.id !== slideId)?.id ?? null);
        }
    };

    const handleSlideDuplicate = (slideId: string) => {
        const currentIndex = quiz?.slides.findIndex(slide => slide.id === slideId) || 0;
        const slideToClone = quiz?.slides[currentIndex];
        if (!slideToClone) return;

        const newSlide = {
            ...slideToClone,
            id: crypto.randomUUID(),
            title: `${slideToClone.title} (Copy)`,
            backgroundStyle: slideToClone.backgroundStyle || 'waves',
        };

        const newSlides = [...quiz?.slides || []];
        newSlides.splice(currentIndex + 1, 0, newSlide);
        setQuiz(prev => prev ? { ...prev, slides: newSlides } : null);
        setActiveSlideId(newSlide.id);
    };

    const handleSlideMove = (slideId: string, direction: 'up' | 'down') => {
        const currentIndex = quiz?.slides.findIndex(slide => slide.id === slideId);
        if (currentIndex === -1 || currentIndex === undefined) return;

        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (newIndex < 0 || newIndex >= (quiz?.slides.length || 0)) return;

        const newSlides = [...quiz?.slides || []];
        [newSlides[currentIndex], newSlides[newIndex]] = [newSlides[newIndex], newSlides[currentIndex]];
        setQuiz(prev => prev ? { ...prev, slides: newSlides } : null);
    };

    const handleQuizUpdate = async (updates: {
        quizName?: string;
        settings?: QuizSettings;
    }) => {
        if (!quiz || !quizId) return;

        const updatedQuiz = {
            ...quiz,
            quiz_name: updates.quizName ?? quiz.quiz_name,
            settings: {
                ...quizDefaults,
                ...quiz.settings,
                ...updates.settings,
            },
        };

        setQuiz(updatedQuiz);
    };

    const activeSlide = quiz?.slides?.find(slide => slide.id === activeSlideId) ?? null;

    return {
        quiz,
        error,
        slides: quiz?.slides || [],
        activeSlide,
        activeSlideId,
        showSettings,
        isLoading,
        isSaving,
        handleAddSlide,
        handleSlideUpdate,
        handleSlideDelete,
        handleSlideDuplicate,
        handleSlideMove,
        handleQuizUpdate,
        handleSave,
        setActiveSlideId,
        setShowSettings,
        setError,
    };
} 