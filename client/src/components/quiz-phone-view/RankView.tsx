import { useState, useEffect } from "react";
import {
  useDraggable,
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensors,
  useSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import { Button } from "@/components/ui/button";

interface RankViewProps {
  question: { title: string; ranking: string[] };
  answerQuestion: (answer: string[]) => void;
}

// Draggable item component
function DraggableItem({ text, index }: { text: string; index: number }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-${index}`, // Unique ID for each item
  });

  const style = transform
    ? {
        transform: `translate3d(0, ${transform.y}px, 0)`,
        zIndex: 1000,
      }
    : {};

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="flex items-center w-full p-4 rounded-lg shadow-md bg-gray-100 text-xl font-bold cursor-grab"
      style={style}
    >
      {text}
    </div>
  );
}

// Main RankView component
export default function RankView({ question, answerQuestion }: RankViewProps) {
  const [currentRanking, setCurrentRanking] = useState<string[]>([]);

  useEffect(() => {
    // Randomize the ranking on the first render
    const shuffleArray = (array: string[]): string[] =>
      array
        .map((item) => ({ sort: Math.random(), value: item }))
        .sort((a, b) => a.sort - b.sort)
        .map((item) => item.value);

    setCurrentRanking(shuffleArray([...question.ranking]));
  }, [question.ranking]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      console.log("Item dropped outside of droppable areas.");
      return;
    }

    // Convert UniqueIdentifier to string and parse index
    const activeIndex = parseInt(String(active.id).split("-")[1], 10);
    const overIndex = parseInt(String(over.id).split("-")[1], 10);

    if (activeIndex !== overIndex) {
      const updatedRanking = [...currentRanking];
      const [movedItem] = updatedRanking.splice(activeIndex, 1); // Remove the dragged item
      updatedRanking.splice(overIndex, 0, movedItem); // Insert at the new position
      setCurrentRanking(updatedRanking);
    }
  };

  const handleAnswerQuestion = () => {
    answerQuestion(currentRanking); // Submit the current ranking as string[]
  };

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex flex-col items-center w-full max-w-md mx-auto space-y-4">
        <h3 className="text-2xl font-bold text-center">{question.title}</h3>
        <div className="flex flex-col w-full space-y-2">
          {currentRanking.map((text, index) => (
            <DraggableItem key={index} text={text} index={index} />
          ))}
        </div>
        <Button
          onClick={handleAnswerQuestion}
          className="w-full py-2 text-xl font-bold bg-blue-500 text-white"
        >
          Submit Answer
        </Button>
      </div>
    </DndContext>
  );
}
