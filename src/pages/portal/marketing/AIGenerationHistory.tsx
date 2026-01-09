import { useState, useMemo } from "react";
import { History, Search, Image, Mail, FileText, Presentation, Copy, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { formatSafeRelativeTime } from "@/lib/dateUtils";
import {
  useAIGenerationHistory,
  useDeleteGeneration,
  type AIGenerationRecord,
} from "@/hooks/marketing/useAIGenerationHistory";
import { GenerationDetailDialog } from "@/components/marketing/GenerationDetailDialog";

const GENERATOR_TYPES = [
  { key: "all", label: "All", icon: History },
  { key: "social-post", label: "Social", icon: Image },
  { key: "email", label: "Email", icon: Mail },
  { key: "flyer", label: "Flyer", icon: FileText },
  { key: "presentation", label: "Presentation", icon: Presentation },
] as const;

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

const truncateContent = (content: string, maxLength = 80) => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + "...";
};

export default function AIGenerationHistory() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AIGenerationRecord | null>(null);
  const [detailRecord, setDetailRecord] = useState<AIGenerationRecord | null>(null);

  const { data: history, isLoading } = useAIGenerationHistory({ limit: 100 });
  const deleteGeneration = useDeleteGeneration();

  // Filter data based on tab and search
  const filteredData = useMemo(() => {
    if (!history) return [];
    
    let filtered = history;
    
    // Filter by type
    if (activeTab !== "all") {
      filtered = filtered.filter((r) => r.generator_type === activeTab);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.generated_content.toLowerCase().includes(query) ||
          r.prompt_used.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [history, activeTab, searchQuery]);

  // Count per type for tabs
  const typeCounts = useMemo(() => {
    if (!history) return {};
    return history.reduce((acc, r) => {
      acc[r.generator_type] = (acc[r.generator_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [history]);

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Content copied to clipboard");
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteGeneration.mutateAsync(deleteTarget.id);
      toast.success("Generation record deleted");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete record");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <History className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-extralight tracking-tight">AI Generation History</h1>
          <p className="text-sm text-muted-foreground">
            View and manage your past AI content generations
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search generations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Type Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          {GENERATOR_TYPES.map(({ key, label, icon: Icon }) => (
            <TabsTrigger key={key} value={key} className="gap-2">
              <Icon className="h-4 w-4" />
              {label}
              {key === "all" && history && (
                <span className="text-xs opacity-70">({history.length})</span>
              )}
              {key !== "all" && typeCounts[key] && (
                <span className="text-xs opacity-70">({typeCounts[key]})</span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : filteredData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <History className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">No generations yet</h3>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Content you generate with AI will appear here
          </p>
          <Button variant="outline" className="mt-4" asChild>
            <a href="/portal/marketing/generators">Go to AI Generators</a>
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border border-white/10 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[140px]">Type</TableHead>
                <TableHead>Content Preview</TableHead>
                <TableHead className="w-[120px]">Generated</TableHead>
                <TableHead className="w-[80px]">Duration</TableHead>
                <TableHead className="w-[120px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((record) => {
                const config = getTypeConfig(record.generator_type);
                const TypeIcon = config.icon;
                
                return (
                  <TableRow key={record.id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TypeIcon className={`h-4 w-4 ${config.color}`} />
                        <span className="text-sm">{config.label}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-muted-foreground truncate max-w-md">
                        {truncateContent(record.generated_content)}
                      </p>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatSafeRelativeTime(record.created_at)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDuration(record.generation_time_ms)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setDetailRecord(record)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleCopy(record.generated_content)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleteTarget(record)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Generation Record?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this generation from your history. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Detail Dialog */}
      <GenerationDetailDialog
        record={detailRecord}
        onClose={() => setDetailRecord(null)}
        onCopy={handleCopy}
      />
    </div>
  );
}
