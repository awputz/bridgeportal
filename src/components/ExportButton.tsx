import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportToCSV, CSVColumn } from "@/lib/csvExport";
import { toast } from "sonner";

interface ExportButtonProps<T> {
  data: T[];
  columns: CSVColumn<T>[];
  filename: string;
  label?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function ExportButton<T>({
  data,
  columns,
  filename,
  label = "Export",
  variant = "outline",
  size = "sm",
  className,
}: ExportButtonProps<T>) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (data.length === 0) {
      toast.error("No data to export");
      return;
    }

    setIsExporting(true);
    try {
      // Add timestamp to filename
      const timestamp = new Date().toISOString().split('T')[0];
      const fullFilename = `${filename}-${timestamp}`;
      
      exportToCSV(data, columns, fullFilename);
      toast.success(`Exported ${data.length} records`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleExport}
      disabled={isExporting || data.length === 0}
      className={className}
    >
      {isExporting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {size !== "icon" && <span className="ml-2">{label}</span>}
    </Button>
  );
}