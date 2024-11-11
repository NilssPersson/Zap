import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { quizAPI } from '@/api/quizzes';
import type Quiz from '@/models/Quiz';
import { SlideSidebar } from '@/components/quiz-editor/SlideSidebar';
import type { Slide, SlideType, QuestionType } from '@/types/quiz';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Editor } from '@/components/quiz-editor/Editor';

function QuizEdit() {
    const { id } = useParams();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [slides, setSlides] = useState<Slide[]>([]);
    const [activeSlideId, setActiveSlideId] = useState<string | null>(null);

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
        setActiveSlideId(newSlide.id);
    };

    const handleSlideUpdate = (updatedSlide: Slide) => {
        setSlides(prev => prev.map(slide => 
            slide.id === updatedSlide.id ? updatedSlide : slide
        ));
    };

    const activeSlide = slides.find(slide => slide.id === activeSlideId) ?? null;

    if (error) return <div>Error: {error}</div>;
    if (!quiz) return <div>Loading...</div>;

    return (
        <div className="flex-1 flex overflow-hidden">
            <ResizablePanelGroup direction="horizontal" style={{ height: "inherit" }}>
                <ResizablePanel defaultSize={14} minSize={12} maxSize={20}>
                    <SlideSidebar 
                        quizName={quiz.quiz_name}
                        slides={slides}
                        onAddSlide={handleAddSlide}
                        activeSlideId={activeSlideId}
                        onSlideSelect={setActiveSlideId}
                    />
                </ResizablePanel>
                
                <ResizableHandle withHandle />
                
                <ResizablePanel defaultSize={60}>
                    <Editor 
                        slide={activeSlide}
                        onSlideUpdate={handleSlideUpdate}
                    />
                </ResizablePanel>
                
                <ResizableHandle withHandle />
                
                <ResizablePanel defaultSize={20} minSize={15}>
                    <div className="bg-secondary/90 shadow-md h-full"></div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
export default QuizEdit;
