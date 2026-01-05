import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { NoteFilters as NoteFiltersType } from "@/hooks/useNotes";

const categories = [
  { value: "general", label: "General" },
  { value: "meeting", label: "Meeting" },
  { value: "call", label: "Call" },
  { value: "research", label: "Research" },
  { value: "idea", label: "Idea" },
  { value: "action-item", label: "Action Item" },
];

const priorities = [
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
];

const sortOptions = [
  { value: "updated_at", label: "Last Modified" },
  { value: "created_at", label: "Date Created" },
  { value: "title", label: "Subject" },
  { value: "priority", label: "Priority" },
];

interface NoteFiltersProps {
  filters: NoteFiltersType;
  onFiltersChange: (filters: NoteFiltersType) => void;
}

export const NoteFilters = ({ filters, onFiltersChange }: NoteFiltersProps) => {
  const hasActiveFilters = filters.category || filters.priority;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Category filter */}
      <Select
        value={filters.category || "all"}
        onValueChange={(v) => onFiltersChange({ ...filters, category: v === "all" ? undefined : v })}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c.value} value={c.value}>
              {c.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Priority filter */}
      <Select
        value={filters.priority || "all"}
        onValueChange={(v) => onFiltersChange({ ...filters, priority: v === "all" ? undefined : v })}
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          {priorities.map((p) => (
            <SelectItem key={p.value} value={p.value}>
              {p.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sort */}
      <Select
        value={filters.sortBy || "updated_at"}
        onValueChange={(v) => onFiltersChange({ ...filters, sortBy: v as NoteFiltersType["sortBy"] })}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sort direction */}
      <Select
        value={filters.sortDirection || "desc"}
        onValueChange={(v) => onFiltersChange({ ...filters, sortDirection: v as "asc" | "desc" })}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="desc">Newest first</SelectItem>
          <SelectItem value="asc">Oldest first</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-muted-foreground"
          onClick={() => onFiltersChange({ 
            ...filters, 
            category: undefined, 
            priority: undefined 
          })}
        >
          <X className="h-3 w-3" />
          Clear filters
        </Button>
      )}

      {/* Active filter badges */}
      {filters.category && (
        <Badge variant="secondary" className="gap-1">
          {categories.find((c) => c.value === filters.category)?.label}
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() => onFiltersChange({ ...filters, category: undefined })}
          />
        </Badge>
      )}
      {filters.priority && (
        <Badge variant="secondary" className="gap-1">
          {priorities.find((p) => p.value === filters.priority)?.label} Priority
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() => onFiltersChange({ ...filters, priority: undefined })}
          />
        </Badge>
      )}
    </div>
  );
};
