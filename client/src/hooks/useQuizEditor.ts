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

    useEffect(() => {
        async function fetchQuiz() {
            if (!quizId) return;

            const { data, error } = await quizAPI.getById(quizId);
            if (error) {
                setError(error.message);
                return;
            }
            setQuiz(data);
        }

        fetchQuiz();
    }, [quizId]);

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

    const handleQuizUpdate = (updates: {
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

        setQuiz(updatedQuiz);
        // TODO: Save quiz updates to backend
    };

    const activeSlide = slides.find(slide => slide.id === activeSlideId) ?? null;

    return {
        quiz,
        error,
        slides,
        activeSlide,
        activeSlideId,
        showSettings,
        handleAddSlide,
        handleSlideUpdate,
        handleSlideDelete,
        handleSlideDuplicate,
        handleSlideMove,
        handleQuizUpdate,
        setActiveSlideId,
        setShowSettings,
    };
} 