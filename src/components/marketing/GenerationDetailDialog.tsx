import { Image, Mail, FileText, Presentation, Copy, Clock, Calendar, Cpu } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { formatSafeDate } from "@/lib/dateUtils";
import type { AIGenerationRecord } from "@/hooks/marketing/useAIGenerationHistory";

interface GenerationDetailDialogProps {
  record: AIGenerationRecord | null;
  onClose: () => void;
  onCopy: (content: string) => void;
}

const getTypeConfig = (type: string) => {
  switch (type) {
    case "social-post":
      return { icon: Image, label: "Social Post", color: "text-pink-400" };
    case "email":
      return { icon: Mail, label: "Email", color: "text-violet-400" };
    case "flyer":
      return { icon: FileText, label: "Flyer", color: "text-indigo-400" };
    case "presentation":
      return { icon: Presentation, label: "Presentation", color: "text-cyan-400" };
    default:
      return { icon: FileText, label: type, color: "text-muted-foreground" };
  }
};

const formatDuration = (ms: number | null) => {
  if (!ms) return "—";
  return `${(ms / 1000).toFixed(1)}s`;
};

export function GenerationDetailDialog({
  record,
  onClose,
  onCopy,
}: GenerationDetailDialogProps) {
  if (!record) return null;

  const config = getTypeConfig(record.generator_type);
  const TypeIcon = config.icon;

  return (
    <Dialog open={!!record} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TypeIcon className={`h-5 w-5 ${config.color}`} />
            {config.label} Generation
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-6">
            {/* Metadata */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formatSafeDate(record.created_at, "PPp")}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {formatDuration(record.generation_time_ms)}
              </div>
              <div className="flex items-center gap-1.5">
                <Cpu className="h-4 w-4" />
                {record.model_used || "gemini-2.5-flash"}
              </div>
            </div>

            {/* Generated Content */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Generated Content</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5"
                  onClick={() => onCopy(record.generated_content)}
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </Button>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border border-white/5">
                <pre className="text-sm whitespace-pre-wrap font-sans">
                  {record.generated_content}
                </pre>
              </div>
            </div>

            {/* Prompt Used */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium hover:text-foreground transition-colors">
                <span className="text-muted-foreground">▶</span>
                Prompt Used
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 p-4 rounded-lg bg-muted/30 border border-white/5">
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
                    {record.prompt_used}
                  </pre>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Form Data */}
            {record.form_data && Object.keys(record.form_data).length > 0 && (
              <Collapsible>
                <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium hover:text-foreground transition-colors">
                  <span className="text-muted-foreground">▶</span>
                  Form Inputs
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-2 p-4 rounded-lg bg-muted/30 border border-white/5">
                    <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
                      {JSON.stringify(record.form_data, null, 2)}
                    </pre>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
