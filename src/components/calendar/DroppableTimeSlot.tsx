import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface DroppableTimeSlotProps {
  id: string;
  day: Date;
  hour: number;
  minute?: number;
  children?: React.ReactNode;
  className?: string;
}

export function DroppableTimeSlot({ 
  id, 
  day, 
  hour, 
  minute = 0,
  children, 
  className 
}: DroppableTimeSlotProps) {
  const { isOver, setNodeRef } = useDroppable({ 
    id,
    data: { day, hour, minute },
  });

  return (
    <div 
      ref={setNodeRef} 
      className={cn(
        "transition-colors duration-150",
        isOver && "bg-primary/10 ring-1 ring-primary/30",
        className
      )}
    >
      {children}
    </div>
  );
}
