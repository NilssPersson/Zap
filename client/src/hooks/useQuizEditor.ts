import { useState, useEffect } from 'react';
import { quizAPI } from '@/api/quizzes';
import type Quiz from '@/models/Quiz';
import type { Slide, SlideType, QuestionType } from '@/types/quiz';
import { toast } from 'sonner';

export function useQuizEditor(quizId: string | undefined) {
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [slides, setSlides] = useState<Slide[]>([]);
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
                const [quizResponse, slidesResponse] = await Promise.all([
                    quizAPI.getById(quizId),
                    quizAPI.getSlides(quizId)
                ]);

                if (quizResponse.error) {
                    setError(quizResponse.error.message);
                    return;
                }
                if (slidesResponse.error) {
                    setError(slidesResponse.error.message);
                    return;
                }

                setQuiz(quizResponse.data);
                setSlides(slidesResponse.data || []);
                
                // Set first slide as active if there are slides and no active slide
                if (slidesResponse.data?.length) {
                    setActiveSlideId(slidesResponse.data[0].id);
                }
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
        if (!quizId) return;
        setIsSaving(true);
        
        const savePromise = new Promise((resolve, reject) => {
            quizAPI.saveSlides(quizId, slides)
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
        };

        let newSlide: Slide;

        switch (type) {
            case 'info':
                newSlide = {
                    ...baseSlide,
                    type: 'info',
                };
                break;
            case 'score':
                newSlide = {
                    ...baseSlide,
                    type: 'score',
                    mockScores: [
                        { name: 'Player 1', points: 100, newPoints: 120 },
                        { name: 'Player 2', points: 80, newPoints: 121 },
                    ],
                };
                break;
            
            case 'rank':
                newSlide = {
                    ...baseSlide,
                    type: 'rank',
                    timeLimit: 0,
                    ranking: []

                };
                break;    


            case 'question':
                if (!questionType) throw new Error('Question type is required');

                switch (questionType) {
                    case 'MCQSA':
                        newSlide = {
                            ...baseSlide,
                            type: 'question',
                            questionType: 'MCQSA',
                            timeLimit: 0,
                            options: Array.from({ length: 4 }, (_, i) => ({
                                id: crypto.randomUUID(),
                                text: `Option ${i + 1}`,
                                isCorrect: i === 0,
                            })),
                        };
                        break;
                    case 'MCQMA':
                        newSlide = {
                            ...baseSlide,
                            type: 'question',
                            questionType: 'MCQMA',
                            timeLimit: 0,
                            options: Array.from({ length: 4 }, (_, i) => ({
                                id: crypto.randomUUID(),
                                text: `Option ${i + 1}`,
                                isCorrect: i <= 1,
                            })),
                        };
                        break;
                    case 'FA':
                        newSlide = {
                            ...baseSlide,
                            type: 'question',
                            questionType: 'FA',
                            timeLimit: 0,
                            correctAnswer: '',
                        };
                        break;
                    default:
                        throw new Error('Invalid question type');
                }
                break;
            default:
                throw new Error('Invalid slide type');
        }

        setSlides(prev => [...prev, newSlide]);
        setActiveSlideId(newSlide.id);
    };

    const handleSlideUpdate = (updatedSlide: Slide) => {
        setSlides(prev => prev.map(slide =>
            slide.id === updatedSlide.id ? updatedSlide : slide
        ));
    };

    const handleSlideDelete = (slideId: string) => {
        setSlides(prev => prev.filter(slide => slide.id !== slideId));
        if (activeSlideId === slideId) {
            setActiveSlideId(slides.find(s => s.id !== slideId)?.id ?? null);
        }
    };

    const handleSlideDuplicate = (slideId: string) => {
        const currentIndex = slides.findIndex(slide => slide.id === slideId);
        const slideToClone = slides[currentIndex];
        if (!slideToClone) return;

        const newSlide = {
            ...slideToClone,
            id: crypto.randomUUID(),
            title: `${slideToClone.title} (Copy)`,
            backgroundStyle: slideToClone.backgroundStyle || 'waves',
        };

        const newSlides = [...slides];
        newSlides.splice(currentIndex + 1, 0, newSlide);
        setSlides(newSlides);
        setActiveSlideId(newSlide.id);
    };

    const handleSlideMove = (slideId: string, direction: 'up' | 'down') => {
        const currentIndex = slides.findIndex(slide => slide.id === slideId);
        if (currentIndex === -1) return;

        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (newIndex < 0 || newIndex >= slides.length) return;

        const newSlides = [...slides];
        [newSlides[currentIndex], newSlides[newIndex]] = [newSlides[newIndex], newSlides[currentIndex]];
        setSlides(newSlides);
    };

    const handleQuizUpdate = async (updates: {
        quizName?: string;
        primaryColor?: string;
        secondaryColor?: string;
        backgroundColor?: string;
    }) => {
        if (!quiz) return;

        const updatedQuiz = {
            ...quiz,
            quiz_name: updates.quizName ?? quiz.quiz_name,
            primary_color: updates.primaryColor ?? quiz.primary_color,
            secondary_color: updates.secondaryColor ?? quiz.secondary_color,
            background_color: updates.backgroundColor ?? quiz.background_color,
        };

        const { error: updateError } = await quizAPI.update(quiz.id, updatedQuiz);
        if (updateError) {
            setError(updateError.message);
            return;
        }

        setQuiz(updatedQuiz);
    };

    const activeSlide = slides.find(slide => slide.id === activeSlideId) ?? null;

    return {
        quiz,
        error,
        slides,
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