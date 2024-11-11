import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { quizAPI } from '@/api/quizzes';
import type Quiz from '@/models/Quiz';
import { EditorSidebar } from '@/components/quiz-editor/EditorSidebar';
import type { Slide, SlideType, QuestionType } from '@/types/quiz';

function QuizEdit() {
    const { id } = useParams();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [slides, setSlides] = useState<Slide[]>([]);

    useEffect(() => {
        async function fetchQuiz() {
            if (!id) return;
            
            const { data, error } = await quizAPI.getById(id);
            if (error) {
                setError(error.message);
                return;
            }
            setQuiz(data);
        }

        fetchQuiz();
    }, [id]);

    const handleAddSlide = (type: SlideType, questionType?: QuestionType) => {
        const newSlide: Slide = {
            id: crypto.randomUUID(),
            title: `New ${type} slide`,
            content: '',
            type,
            questionType
        };
        setSlides(prev => [...prev, newSlide]);
    };

    if (error) return <div>Error: {error}</div>;
    if (!quiz) return <div>Loading...</div>;

    return (
        <div className="flex-1 flex overflow-hidden">
            <EditorSidebar 
                quizName={quiz.quiz_name}
                slides={slides}
                onAddSlide={handleAddSlide}
            />
            <div className="flex-1"></div>
        </div>
    );
}

export default QuizEdit;