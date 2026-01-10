import { useState } from "react";
import { FileText, Download, Edit3, ExternalLink, FileSpreadsheet, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useTrackTemplateDownload } from "@/hooks/useFilledTemplates";
import type { AgentTemplate } from "@/types/templates";

interface TemplateActionCardProps {
  template: AgentTemplate;
  onFill: (template: AgentTemplate) => void;
}

const fileTypeConfig: Record<string, { icon: typeof FileText; label: string; color: string }> = {
  pdf: { icon: FileText, label: "PDF", color: "bg-red-500/10 text-red-500" },
  document: { icon: FileText, label: "Doc", color: "bg-blue-500/10 text-blue-500" },
  spreadsheet: { icon: FileSpreadsheet, label: "Sheet", color: "bg-green-500/10 text-green-500" },
  canva: { icon: Image, label: "Canva", color: "bg-purple-500/10 text-purple-500" },
};

export const TemplateActionCard = ({ template, onFill }: TemplateActionCardProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const trackDownload = useTrackTemplateDownload();
  
  const config = fileTypeConfig[template.file_type || "pdf"] || fileTypeConfig.pdf;
  const Icon = config.icon;

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Track download
      await trackDownload.mutateAsync(template.id);
      
      // Open in new tab (works for Google Docs, PDFs, etc.)
      window.open(template.file_url, "_blank");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-border hover:shadow-lg">
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          {/* Header with icon and badges */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className={`text-xs font-medium ${config.color}`}>
                {config.label}
              </Badge>
              {template.is_fillable && (
                <Badge variant="outline" className="border-primary/30 bg-primary/5 text-xs text-primary">
                  Fillable
                </Badge>
              )}
            </div>
          </div>

          {/* Title and description */}
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-medium text-foreground">
              {template.name}
            </h3>
            {template.description && (
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {template.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            {template.is_fillable ? (
              <>
                <Button
                  size="sm"
                  variant="default"
                  className="flex-1 gap-1.5"
                  onClick={() => onFill(template)}
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Fill
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0"
                  onClick={handleDownload}
                  disabled={isDownloading}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="w-full gap-1.5"
                onClick={handleDownload}
                disabled={isDownloading}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open Template
              </Button>
            )}
          </div>

          {/* Analytics footer */}
          {(template.fill_count > 0 || template.download_count > 0) && (
            <p className="text-xs text-muted-foreground/70">
              {template.fill_count > 0 && `${template.fill_count} filled`}
              {template.fill_count > 0 && template.download_count > 0 && " • "}
              {template.download_count > 0 && `${template.download_count} downloaded`}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
