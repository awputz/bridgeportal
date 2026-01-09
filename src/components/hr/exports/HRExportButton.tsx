import { useState } from "react";
import { Download, FileSpreadsheet, FileText, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportToCSV, CSVColumn } from "@/lib/csvExport";
import { exportToExcel, ExcelColumn } from "@/lib/excelExport";
import { toast } from "sonner";

interface HRExportButtonProps<T> {
  data: T[];
  csvColumns: CSVColumn<T>[];
  excelColumns?: ExcelColumn<T>[];
  filename: string;
  sheetName?: string;
  disabled?: boolean;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function HRExportButton<T>({
  data,
  csvColumns,
  excelColumns,
  filename,
  sheetName = "Data",
  disabled = false,
  variant = "outline",
  size = "sm",
}: HRExportButtonProps<T>) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCSV = async () => {
    if (data.length === 0) {
      toast.error("No data to export");
      return;
    }

    setIsExporting(true);
    try {
      exportToCSV(data, csvColumns, filename);
      toast.success(`Exported ${data.length} records to CSV`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = async () => {
    if (data.length === 0) {
      toast.error("No data to export");
      return;
    }

    setIsExporting(true);
    try {
      const columns = excelColumns || csvColumns.map(c => ({
        ...c,
        type: 'string' as const
      }));
      exportToExcel(data, columns, filename, sheetName);
      toast.success(`Exported ${data.length} records to Excel`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          disabled={disabled || isExporting || data.length === 0}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Export
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportCSV} className="gap-2 cursor-pointer">
          <FileText className="h-4 w-4" />
          Export as CSV
          <span className="ml-auto text-xs text-muted-foreground">
            {data.length} records
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportExcel} className="gap-2 cursor-pointer">
          <FileSpreadsheet className="h-4 w-4" />
          Export as Excel
          <span className="ml-auto text-xs text-muted-foreground">
            {data.length} records
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
