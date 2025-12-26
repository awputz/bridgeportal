import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  FolderPlus,
  Upload,
  ChevronDown,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  FileText,
  Sheet,
  Presentation,
  Image,
  Film,
  Music,
  File,
  Grid3X3,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export type SortField = "name" | "modifiedTime" | "size";
export type SortDirection = "asc" | "desc";
export type FileTypeFilter = "all" | "documents" | "spreadsheets" | "presentations" | "images" | "videos" | "audio" | "pdfs";

interface DriveActionBarProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField, direction: SortDirection) => void;
  fileFilter: FileTypeFilter;
  onFilterChange: (filter: FileTypeFilter) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onRefresh: () => void;
}

const sortOptions: { field: SortField; label: string }[] = [
  { field: "name", label: "Name" },
  { field: "modifiedTime", label: "Modified" },
  { field: "size", label: "Size" },
];

const filterOptions: { value: FileTypeFilter; label: string; icon: React.ElementType }[] = [
  { value: "all", label: "All files", icon: File },
  { value: "documents", label: "Documents", icon: FileText },
  { value: "spreadsheets", label: "Spreadsheets", icon: Sheet },
  { value: "presentations", label: "Presentations", icon: Presentation },
  { value: "pdfs", label: "PDFs", icon: FileText },
  { value: "images", label: "Images", icon: Image },
  { value: "videos", label: "Videos", icon: Film },
  { value: "audio", label: "Audio", icon: Music },
];

export function DriveActionBar({
  sortField,
  sortDirection,
  onSortChange,
  fileFilter,
  onFilterChange,
  viewMode,
  onViewModeChange,
  onRefresh,
}: DriveActionBarProps) {
  const handleNewFolder = () => {
    toast.info("Creating folders requires additional permissions. Use Google Drive directly.");
  };

  const handleUpload = () => {
    toast.info("Upload to Google Drive requires additional permissions. Use Google Drive directly to upload files.");
  };

  const currentSort = sortOptions.find(s => s.field === sortField);
  const currentFilter = filterOptions.find(f => f.value === fileFilter);

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {/* New Button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="gap-2 bg-gdrive-folder hover:bg-gdrive-folder/90 text-white">
            <Plus className="h-4 w-4" />
            New
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuItem onClick={handleNewFolder} className="gap-2">
            <FolderPlus className="h-4 w-4" />
            New folder
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleUpload} className="gap-2">
            <Upload className="h-4 w-4" />
            File upload
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleUpload} className="gap-2">
            <FolderPlus className="h-4 w-4" />
            Folder upload
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex-1" />

      {/* Filter Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">{currentFilter?.label || "Filter"}</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {filterOptions.map((option) => {
            const Icon = option.icon;
            return (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onFilterChange(option.value)}
                className={cn("gap-2", fileFilter === option.value && "bg-muted")}
              >
                <Icon className="h-4 w-4" />
                {option.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Sort Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowUpDown className="h-4 w-4" />
            <span className="hidden sm:inline">{currentSort?.label}</span>
            {sortDirection === "asc" ? (
              <ArrowUp className="h-3 w-3" />
            ) : (
              <ArrowDown className="h-3 w-3" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.field}
              onClick={() => {
                if (sortField === option.field) {
                  onSortChange(option.field, sortDirection === "asc" ? "desc" : "asc");
                } else {
                  onSortChange(option.field, "asc");
                }
              }}
              className={cn("gap-2", sortField === option.field && "bg-muted")}
            >
              {option.label}
              {sortField === option.field && (
                sortDirection === "asc" ? (
                  <ArrowUp className="h-3 w-3 ml-auto" />
                ) : (
                  <ArrowDown className="h-3 w-3 ml-auto" />
                )
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Mode Toggle */}
      <div className="hidden sm:flex items-center border rounded-lg overflow-hidden">
        <Button
          variant={viewMode === "grid" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange("grid")}
          className={cn(
            "rounded-none h-8",
            viewMode === "grid" && "bg-gdrive-folder hover:bg-gdrive-folder/90"
          )}
        >
          <Grid3X3 className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange("list")}
          className={cn(
            "rounded-none h-8",
            viewMode === "list" && "bg-gdrive-folder hover:bg-gdrive-folder/90"
          )}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
