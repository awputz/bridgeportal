import { useState } from "react";
import { Download, Clock, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UseInProjectDialog } from "./UseInProjectDialog";

interface BeforeAfterComparisonProps {
  originalUrl: string;
  stagedUrl: string;
  processingTimeMs?: number | null;
}

export function BeforeAfterComparison({
  originalUrl,
  stagedUrl,
  processingTimeMs,
}: BeforeAfterComparisonProps) {
  const [useDialogOpen, setUseDialogOpen] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await fetch(stagedUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `staged-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Before */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground text-center">Before</p>
          <div className="aspect-video rounded-lg overflow-hidden border bg-muted">
            <img
              src={originalUrl}
              alt="Original"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* After */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground text-center">After</p>
          <div className="aspect-video rounded-lg overflow-hidden border bg-muted">
            <img
              src={stagedUrl}
              alt="Staged"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        {processingTimeMs && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Generated in {(processingTimeMs / 1000).toFixed(1)}s</span>
          </div>
        )}
        
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="outline" size="sm" onClick={() => setUseDialogOpen(true)}>
            <FolderPlus className="h-4 w-4 mr-2" />
            Use in Project
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <UseInProjectDialog
        open={useDialogOpen}
        onOpenChange={setUseDialogOpen}
        imageUrl={stagedUrl}
      />
    </div>
  );
}