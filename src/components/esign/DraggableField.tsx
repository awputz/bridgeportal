import { useState, useRef } from "react";
import { Pen, Type, Calendar, TextCursor, Check, List, Trash2, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ESignField, ESignFieldType, ESignRecipient, ESignSignerType } from "@/types/esign";

interface DraggableFieldProps {
  field: Partial<ESignField> & { id: string };
  recipient: ESignRecipient;
  scale: number;
  isSelected: boolean;
  onSelect: () => void;
  onMove: (x: number, y: number) => void;
  onResize: (width: number, height: number) => void;
  onDelete: () => void;
  disabled?: boolean;
}

const fieldIcons: Record<ESignFieldType, React.ElementType> = {
  signature: Pen,
  initials: Type,
  date: Calendar,
  text: TextCursor,
  checkbox: Check,
  dropdown: List,
};

const signerColors: Record<ESignSignerType | "default", { bg: string; border: string; text: string }> = {
  buyer: { bg: "bg-blue-500/20", border: "border-blue-500", text: "text-blue-700 dark:text-blue-300" },
  seller: { bg: "bg-green-500/20", border: "border-green-500", text: "text-green-700 dark:text-green-300" },
  agent: { bg: "bg-purple-500/20", border: "border-purple-500", text: "text-purple-700 dark:text-purple-300" },
  attorney: { bg: "bg-amber-500/20", border: "border-amber-500", text: "text-amber-700 dark:text-amber-300" },
  broker: { bg: "bg-pink-500/20", border: "border-pink-500", text: "text-pink-700 dark:text-pink-300" },
  other: { bg: "bg-gray-500/20", border: "border-gray-500", text: "text-gray-700 dark:text-gray-300" },
  default: { bg: "bg-gray-500/20", border: "border-gray-500", text: "text-gray-700 dark:text-gray-300" },
};

export const DraggableField = ({
  field,
  recipient,
  scale,
  isSelected,
  onSelect,
  onMove,
  onResize,
  onDelete,
  disabled = false,
}: DraggableFieldProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0, fieldX: 0, fieldY: 0 });

  const Icon = fieldIcons[field.field_type || "signature"];
  const colors = signerColors[recipient.signer_type || "default"];

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    onSelect();

    setIsDragging(true);
    startPos.current = {
      x: e.clientX,
      y: e.clientY,
      fieldX: field.x_position || 0,
      fieldY: field.y_position || 0,
    };

    const handleMouseMove = (e: MouseEvent) => {
      const dx = (e.clientX - startPos.current.x) / scale;
      const dy = (e.clientY - startPos.current.y) / scale;
      onMove(
        Math.max(0, startPos.current.fieldX + dx),
        Math.max(0, startPos.current.fieldY + dy)
      );
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const startWidth = field.width || 200;
    const startHeight = field.height || 50;
    const startX = e.clientX;
    const startY = e.clientY;

    const handleResize = (e: MouseEvent) => {
      const dx = (e.clientX - startX) / scale;
      const dy = (e.clientY - startY) / scale;
      onResize(Math.max(80, startWidth + dx), Math.max(24, startHeight + dy));
    };

    const handleResizeEnd = () => {
      window.removeEventListener("mousemove", handleResize);
      window.removeEventListener("mouseup", handleResizeEnd);
    };

    window.addEventListener("mousemove", handleResize);
    window.addEventListener("mouseup", handleResizeEnd);
  };

  return (
    <div
      className={cn(
        "absolute flex items-center gap-1 rounded border-2 transition-shadow",
        colors.bg,
        colors.border,
        isSelected && "ring-2 ring-primary ring-offset-1 shadow-lg",
        isDragging && "cursor-grabbing opacity-80",
        !disabled && !isDragging && "cursor-grab",
        disabled && "cursor-default opacity-60"
      )}
      style={{
        left: (field.x_position || 0) * scale,
        top: (field.y_position || 0) * scale,
        width: (field.width || 200) * scale,
        height: (field.height || 50) * scale,
        fontSize: 12 * scale,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Field Content */}
      <div className="flex items-center gap-1 px-2 w-full h-full overflow-hidden">
        <Icon className="shrink-0" style={{ width: 14 * scale, height: 14 * scale }} />
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className={cn("font-medium truncate", colors.text)}>
            {field.label || field.field_type}
          </div>
          <div className="text-muted-foreground truncate" style={{ fontSize: 10 * scale }}>
            {recipient.name}
          </div>
        </div>
        {field.required && (
          <span className="text-destructive font-bold shrink-0">*</span>
        )}
      </div>

      {/* Delete button (shown when selected) */}
      {isSelected && !disabled && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/80 z-10"
          style={{ padding: 2 * scale }}
        >
          <Trash2 style={{ width: 12 * scale, height: 12 * scale }} />
        </button>
      )}

      {/* Resize handle (shown when selected) */}
      {isSelected && !disabled && (
        <div
          className="absolute -bottom-1 -right-1 bg-primary rounded-sm cursor-se-resize z-10"
          style={{ width: 10 * scale, height: 10 * scale }}
          onMouseDown={handleResizeMouseDown}
        >
          <GripVertical
            className="text-primary-foreground rotate-45"
            style={{ width: 8 * scale, height: 8 * scale }}
          />
        </div>
      )}
    </div>
  );
};
