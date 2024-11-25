import { useParams } from "react-router-dom";
import { useQuizEditor } from "@/hooks/useQuizEditor";
import { SlideSidebar } from "@/components/quiz-editor/SlideSidebar";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Editor } from "@/components/quiz-editor/Editor";
import { Toolbar } from "@/components/quiz-editor/Toolbar";
import { QuizBackground } from "@/components/quiz-editor/QuizBackground";
import { QuizSettingsToolbar } from "@/components/quiz-editor/QuizSettingsToolbar";
import { quizDefaults } from "@/components/quiz-editor/utils/quiz-defaults";
import { Button } from "@/components/ui/button";
import { useState } from "react";

function QuizEdit() {
  const { id } = useParams();
  const {
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
    handleSave,
    handleQuizUpdate,
    setActiveSlideId,
    setShowSettings,
  } = useQuizEditor(id);
  const [whichPreview, setWhichPreview] = useState("Host");

  if (error) return <div>Error: {error}</div>;
  if (!quiz) return <div>Loading...</div>;

  const quizSettings = {
    ...quizDefaults,
    ...quiz.settings,
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      <QuizBackground
        primaryColor={quiz.primary_color}
        secondaryColor={quiz.secondary_color}
        backgroundColor={quiz.background_color}
        className="absolute inset-0 -z-10"
      />
      <ResizablePanelGroup direction="horizontal" style={{ height: "inherit" }}>
        <ResizablePanel defaultSize={20} minSize={12} maxSize={20}>
          <SlideSidebar
            quizName={quiz.quiz_name}
            slides={slides}
            onAddSlide={handleAddSlide}
            activeSlideId={activeSlideId}
            onSlideSelect={(slideId) => {
              setActiveSlideId(slideId);
              setShowSettings(false);
            }}
            onSlideDelete={handleSlideDelete}
            onSlideDuplicate={handleSlideDuplicate}
            onSlideMove={handleSlideMove}
            onSettingsClick={() => setShowSettings(true)}
            onSaveClick={handleSave}
            backgroundColor={quizSettings.backgroundColor}
            primaryColor={quizSettings.primaryColor}
            secondaryColor={quizSettings.secondaryColor}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={60}>
          <div className="flex items-center justify-center space-x-4">
            <Button onClick={() => setWhichPreview("Preview")}>Preview</Button>
            <Button onClick={() => setWhichPreview("Host")}> Host </Button>
            <Button onClick={() => setWhichPreview("Participant")}>
              Participant
            </Button>
          </div>
          <Editor
            slide={activeSlide}
            backgroundColor={quizSettings.backgroundColor}
            primaryColor={quizSettings.primaryColor}
            secondaryColor={quizSettings.secondaryColor}
            whichPreview={whichPreview}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={20} minSize={15}>
          {showSettings ? (
            <QuizSettingsToolbar quiz={quiz} onUpdate={handleQuizUpdate} />
          ) : activeSlide ? (
            <Toolbar slide={activeSlide} onSlideUpdate={handleSlideUpdate} />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground bg-secondary/90">
              Select a slide
            </div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default QuizEdit;
