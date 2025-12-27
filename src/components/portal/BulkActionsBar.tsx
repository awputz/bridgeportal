import { useState } from "react";
import { 
  X, 
  Trash2, 
  Tag, 
  ArrowRight, 
  Download, 
  CheckSquare,
  Square
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface BulkActionsBarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBulkStageChange: (stageId: string) => void;
  onBulkDelete: () => void;
  onExport: () => void;
  stages: { id: string; name: string; color: string }[];
  isAllSelected: boolean;
}

export const BulkActionsBar = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onBulkStageChange,
  onBulkDelete,
  onExport,
  stages,
  isAllSelected,
}: BulkActionsBarProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string>("");

  if (selectedCount === 0) return null;

  const handleStageChange = (stageId: string) => {
    setSelectedStage(stageId);
    onBulkStageChange(stageId);
    setSelectedStage("");
  };

  return (
    <>
      <div 
        className={cn(
          "fixed bottom-4 left-1/2 -translate-x-1/2 z-50",
          "bg-background border border-border rounded-lg shadow-lg",
          "px-4 py-3 flex items-center gap-4",
          "animate-in slide-in-from-bottom-5 duration-300"
        )}
      >
        {/* Selection Info */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={isAllSelected ? onDeselectAll : onSelectAll}
            className="gap-1.5"
          >
            {isAllSelected ? (
              <CheckSquare className="h-4 w-4" />
            ) : (
              <Square className="h-4 w-4" />
            )}
            {isAllSelected ? "Deselect All" : "Select All"}
          </Button>
          
          <Badge variant="secondary" className="font-medium">
            {selectedCount} of {totalCount} selected
          </Badge>
        </div>

        <div className="h-6 w-px bg-border" />

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Move to Stage */}
          <Select value={selectedStage} onValueChange={handleStageChange}>
            <SelectTrigger className="w-[160px] h-9">
              <div className="flex items-center gap-1.5">
                <ArrowRight className="h-3.5 w-3.5" />
                <SelectValue placeholder="Move to stage" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {stages.map((stage) => (
                <SelectItem key={stage.id} value={stage.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                    {stage.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Export */}
          <Button variant="outline" size="sm" onClick={onExport} className="gap-1.5">
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>

          {/* Delete */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowDeleteConfirm(true)}
            className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </Button>
        </div>

        <div className="h-6 w-px bg-border" />

        {/* Close */}
        <Button variant="ghost" size="icon" onClick={onDeselectAll} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedCount} Deal{selectedCount > 1 ? "s" : ""}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The selected deals will be permanently removed from your pipeline.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onBulkDelete();
                setShowDeleteConfirm(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete {selectedCount} Deal{selectedCount > 1 ? "s" : ""}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BulkActionsBar;
