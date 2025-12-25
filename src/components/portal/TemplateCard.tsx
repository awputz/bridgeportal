import { FileText, Download, Eye, FileSpreadsheet, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TemplateCardProps {
  name: string;
  description?: string;
  fileUrl: string;
  fileType?: string;
  className?: string;
}

const fileIcons: Record<string, typeof FileText> = {
  pdf: FileText,
  docx: FileText,
  doc: FileText,
  xlsx: FileSpreadsheet,
  xls: FileSpreadsheet,
  pptx: FileImage,
};

const fileColors: Record<string, string> = {
  pdf: "text-red-400",
  docx: "text-blue-400",
  doc: "text-blue-400",
  xlsx: "text-green-400",
  xls: "text-green-400",
  pptx: "text-orange-400",
};

export const TemplateCard = ({ 
  name, 
  description, 
  fileUrl,
  fileType = "pdf",
  className 
}: TemplateCardProps) => {
  const Icon = fileIcons[fileType] || FileText;
  const iconColor = fileColors[fileType] || "text-foreground/60";

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = () => {
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={cn(
      "glass-card p-4 md:p-5 flex flex-col gap-4",
      className
    )}>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
          <Icon className={cn("h-5 w-5 md:h-6 md:w-6", iconColor)} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm md:text-base font-light text-foreground truncate">
            {name}
          </h3>
          {description && (
            <p className="text-xs text-muted-foreground font-light mt-1 line-clamp-2">
              {description}
            </p>
          )}
          <p className="text-xs text-muted-foreground/60 uppercase mt-2">
            {fileType}
          </p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 text-xs font-light"
          onClick={handlePreview}
        >
          <Eye className="h-3.5 w-3.5 mr-1.5" />
          Preview
        </Button>
        <Button 
          size="sm" 
          className="flex-1 text-xs font-light"
          onClick={handleDownload}
        >
          <Download className="h-3.5 w-3.5 mr-1.5" />
          Download
        </Button>
      </div>
    </div>
  );
};
