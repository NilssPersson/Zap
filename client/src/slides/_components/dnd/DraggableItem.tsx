import { useDraggable } from "@dnd-kit/core";
import * as React from "react";

interface DraggableItemProps {
  id: string;
  text: string;
  inDroppable?: boolean;
}

export function DraggableItem({ id, text, inDroppable = false }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 1000,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`p-3 rounded-lg cursor-grab active:cursor-grabbing
        ${inDroppable ? 'bg-primary/20' : 'bg-primary/10'}`}
      style={style}
    >
      {text}
    </div>
  );
} 