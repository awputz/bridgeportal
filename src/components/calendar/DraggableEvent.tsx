import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/hooks/useCalendarEvents";

interface DraggableEventProps {
  event: CalendarEvent;
  children: React.ReactNode;
  disabled?: boolean;
}

export function DraggableEvent({ event, children, disabled = false }: DraggableEventProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: event.id,
    data: { event },
    disabled: disabled || event.source === "company", // Only allow dragging Google events
  });

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "transition-shadow",
        isDragging && "opacity-50 z-50 shadow-lg ring-2 ring-primary/50",
        !disabled && event.source !== "company" && "cursor-grab active:cursor-grabbing"
      )}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  );
}
