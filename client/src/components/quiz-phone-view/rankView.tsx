import { useState, useEffect } from 'react';
import { useDraggable, useDroppable, DndContext, MouseSensor, TouchSensor, useSensors, useSensor, DragEndEvent } from '@dnd-kit/core';

// Define a type for the ranking items
type RankItem = {
  name: string;
  score: number;
};

// Shuffle function to randomize the order
const shuffleArray = (array: RankItem[]): RankItem[] => {
  return array
    .map((a) => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value);
};

// Draggable-Droppable item component
function DraggableDroppableItem({ rank, index, originalIndex }: { rank: RankItem; index: number; originalIndex: number }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id: `draggable-${index}`, // Unique ID for each item
    });
  
    const { setNodeRef: droppableRef, isOver } = useDroppable({
      id: `droppable-${index}`, // Unique ID for each droppable area
    });
  
    // Combine the draggable and droppable refs
    const combinedRef = (node: HTMLElement | null) => {
      setNodeRef(node);
      droppableRef(node);
    };
  
    // Restrict to vertical movement by setting x to 0 and allowing y to change
    const style = transform ? {
      transform: `translate3d(0px, ${transform.y}px, 0)`, // Only change vertical position
      zIndex: isOver ? 1000 : undefined, // Bring item to top when it's over a droppable area
    } : {};
  
    return (
      <div className="flex items-center w-full">
        {/* Rank number column (fixed outside of the draggable component) */}
        <div className=" m-4 rounded-full text-4xl font-bold">{`${originalIndex + 1}`}</div>
  
        {/* Draggable item column (rank name moves) */}
        <div
          ref={combinedRef}
          style={{ ...style, minHeight: '64px' }}
          {...listeners}
          {...attributes}
          className={`font-display flex items-center justify-start p-4 rounded-xl backdrop-blur-md flex-grow shadow-lg ${
            isOver ? 'bg-green-500' : index % 2 === 0 ? 'bg-component-background' : 'bg-gray-300'
          }`}
        >
          <span className="text-3xl font-bold text-textonwbg-grayonw">{rank.name}</span>
        </div>
      </div>
    );
  }
  


// Main SlideRank component
export function SlideRank({ ranking }: { ranking: RankItem[] }) {
  const [currentRanking, setCurrentRanking] = useState<RankItem[]>(ranking);

  // Randomize the ranking on the first render
  useEffect(() => {
    const randomizedRanking = shuffleArray([...ranking]);
    setCurrentRanking(randomizedRanking); // Update state with randomized ranking
  }, [ranking]);

  const topRanking = [...currentRanking];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Log when the drag event is triggered
    console.log('Item is being dragged:', active.id);

    // Check if the item is dropped over a valid droppable area
    if (over) {
      console.log('Item dropped inside droppable area:', over.id);

      const activeIndex = Number(String(active.id).replace('draggable-', ''));
      const overIndex = Number(String(over.id).replace('droppable-', ''));

      console.log("Active Index:", activeIndex, "Over Index:", overIndex);

      // Swap the items only if they are dropped in a different index
      if (activeIndex !== overIndex) {
        const updatedRanking = [...currentRanking];
        const [movedItem] = updatedRanking.splice(activeIndex, 1); // Remove the dragged item
        updatedRanking.splice(overIndex, 0, movedItem); // Insert it at the new position

        console.log("Updated Ranking:", updatedRanking);

        setCurrentRanking(updatedRanking); // Update the state to reflect the new order
      }
    } else {
      // If the item is dropped outside a droppable area, log that event
      console.log('Item dropped outside any droppable area');
    }
  };

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <div className="flex items-center justify-center h-screen w-full p-4">
        <div className="flex flex-col items-center space-y-4 w-full max-w-md max-h-[80vh] overflow-y-auto">
          {topRanking.map((rank, index) => (
            <DraggableDroppableItem
              key={index}
              rank={rank}
              index={index}
              originalIndex={currentRanking.indexOf(rank)} // Keep original index for rank number
            />
          ))}
        </div>
      </div>
    </DndContext>
  );
}

export default SlideRank;
