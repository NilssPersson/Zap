import { useState, useEffect } from "react";
import {
  useDraggable,
  useDroppable,
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensors,
  useSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { RankSlide } from "@/models/Quiz";
import {rankColors } from "../base/QuizColors";


interface RankViewProps {
  slide: RankSlide;
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
      className="flex items-center w-full p-4 rounded-lg shadow-md bg-[#F4F3F2] text-xl font-display cursor-grab text-[#333333]"
      style={style}
    >
      {text}
    </div>
  );
}

// Droppable container component
function DroppableContainer({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${index}`, // Unique ID for each droppable area
  });

  return (
    <div
      ref={setNodeRef}
      className={`p-0 rounded-lg w-full ${
        isOver ? "bg-blue-200" : "bg-gray-100"
      } shadow-md`}
    >
      {children}
    </div>
  );
}

// Main RankView component
export function Participant({ slide, answerQuestion }: RankViewProps) {
  const [currentRanking, setCurrentRanking] = useState<string[]>([]);

  useEffect(() => {
    // Randomize the ranking on the first render
    const shuffleArray = (array: string[]): string[] =>
      array
        .map((item) => ({ sort: Math.random(), value: item }))
        .sort((a, b) => a.sort - b.sort)
        .map((item) => item.value);

    setCurrentRanking(shuffleArray([...slide.ranking]));
  }, [slide.ranking]);

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
      <div className="flex flex-col items-center justify-center  w-full p-4">
        <div className="flex flex-col items-center w-full max-w-md space-y-4">
          <h2 className="text-4xl font-display text-center">{slide.title}</h2>
          <h3 className="text-2xl font-display text-center">{slide.content}</h3>
          <div className="flex flex-col w-full space-y-3 pb-5">
            {currentRanking.map((text, index) => (
              <div
                key={index}
                className="rounded-lg flex items-center w-full space-x-4"
              >
                {/* Display the index with proper alignment */}
                <h2
                  style={{
                    backgroundColor: rankColors(index),
                  }}
                  className="font-display text-2xl font-bold text-center p-4 rounded-lg text-[#F4F3F2] w-20"
                >
                  {index + 1}
                </h2>
                <DroppableContainer index={index}>
                  <DraggableItem text={text} index={index} />
                </DroppableContainer>
              </div>
            ))}
          </div>

          <Button
            onClick={handleAnswerQuestion}
            className="w-[60%] py-8 text-xl font-display text-white"
          >
            Submit Answer
          </Button>
        </div>
      </div>
    </DndContext>
  );
}
