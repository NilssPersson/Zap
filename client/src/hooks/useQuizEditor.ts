import { useState, useEffect } from 'react';
import { quizAPI } from '@/api/quizzes';
import type Quiz from '@/models/Quiz';
import type { Slide, SlideType, QuestionType } from '@/types/quiz';

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
                // Fetch quiz
                const { data: quizData, error: quizError } = await quizAPI.getById(quizId);
                if (quizError) {
                    setError(quizError.message);
                    return;
                }
                setQuiz(quizData);

                // Fetch slides
                const { data: slidesData, error: slidesError } = await quizAPI.getSlides(quizId);
                if (slidesError) {
                    setError(slidesError.message);
                    return;
                }
                setSlides(slidesData || []);
                
                // Set first slide as active if there are slides and no active slide
                if (slidesData?.length && !activeSlideId) {
                    setActiveSlideId(slidesData[0].id);
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
        
        try {
            const { error: saveError } = await quizAPI.saveSlides(quizId, slides);
            if (saveError) {
                setError(saveError.message);
                return false;
            }
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save slides');
            return false;
        } finally {
            setIsSaving(false);
        }
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
                        { playerName: 'Player 1', score: 100 },
                        { playerName: 'Player 2', score: 80 },
                    ],
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