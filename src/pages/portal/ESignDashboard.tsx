import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  MoreHorizontal,
  Send,
  Trash2,
  Search,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { DocumentUploadDialog } from "@/components/esign/DocumentUploadDialog";
import {
  useESignDocuments,
  useVoidESignDocument,
} from "@/hooks/esign/useESignDocuments";
import { formatDistanceToNow } from "date-fns";
import type { ESignDocumentStatus } from "@/types/esign";
import type { LucideIcon } from "lucide-react";

const statusConfig: Record<
  ESignDocumentStatus,
  { label: string; color: string; icon: LucideIcon }
> = {
  draft: {
    label: "Draft",
    color: "bg-muted text-muted-foreground",
    icon: FileText,
  },
  pending: {
    label: "Pending",
    color: "bg-amber-500/10 text-amber-500",
    icon: Clock,
  },
  in_progress: {
    label: "In Progress",
    color: "bg-blue-500/10 text-blue-500",
    icon: Clock,
  },
  completed: {
    label: "Completed",
    color: "bg-green-500/10 text-green-500",
    icon: CheckCircle2,
  },
  voided: {
    label: "Voided",
    color: "bg-destructive/10 text-destructive",
    icon: XCircle,
  },
  declined: {
    label: "Declined",
    color: "bg-destructive/10 text-destructive",
    icon: XCircle,
  },
};

const ESignDashboard = () => {
  const navigate = useNavigate();
  const { data: documents, isLoading } = useESignDocuments();
  const voidDocument = useVoidESignDocument();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  // Filter documents
  const filteredDocs = documents?.filter((doc) => {
    const matchesSearch = doc.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      doc.status === statusFilter ||
      (statusFilter === "pending" &&
        (doc.status === "pending" || doc.status === "in_progress"));
    return matchesSearch && matchesStatus;
  });

  // Count by status
  const counts = {
    all: documents?.length || 0,
    pending:
      documents?.filter(
        (d) => d.status === "pending" || d.status === "in_progress"
      ).length || 0,
    completed: documents?.filter((d) => d.status === "completed").length || 0,
    draft: documents?.filter((d) => d.status === "draft").length || 0,
  };

  const handleVoidDocument = (id: string) => {
    if (confirm("Are you sure you want to void this document?")) {
      voidDocument.mutate({ id, reason: "Voided by sender" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extralight tracking-tight">
              eSign Suite
            </h1>
            <p className="text-muted-foreground mt-1">
              Send and manage documents for electronic signature
            </p>
          </div>

          <Button onClick={() => setShowUploadDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Document
          </Button>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs
            value={statusFilter}
            onValueChange={setStatusFilter}
            className="w-full sm:w-auto"
          >
            <TabsList>
              <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({counts.pending})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({counts.completed})
              </TabsTrigger>
              <TabsTrigger value="draft">Drafts ({counts.draft})</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Documents List */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : !filteredDocs?.length ? (
          <div className="text-center py-16 border border-dashed border-border rounded-lg">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Documents</h3>
            <p className="text-muted-foreground mt-1 mb-4">
              {searchQuery
                ? "No documents match your search."
                : "Create your first document to get started."}
            </p>
            {!searchQuery && (
              <Button onClick={() => setShowUploadDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Document
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredDocs.map((doc) => {
              const config = statusConfig[doc.status];
              const StatusIcon = config.icon;
              const recipientCount =
                (doc.recipients as { count: number }[])?.[0]?.count || 0;

              return (
                <div
                  key={doc.id}
                  className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  {/* Icon */}
                  <div className="hidden sm:flex h-10 w-10 rounded-lg bg-primary/10 items-center justify-center flex-shrink-0">
                    <StatusIcon className="h-5 w-5 text-primary" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium truncate">{doc.title}</h3>
                      <Badge variant="secondary" className={config.color}>
                        {config.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1 flex-wrap">
                      <span>{recipientCount} recipients</span>
                      <span>•</span>
                      <span>
                        {doc.signed_count}/{doc.total_signers} signed
                      </span>
                      {doc.deal && (
                        <>
                          <span>•</span>
                          <span className="truncate">
                            {doc.deal.property_address}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="hidden md:block text-sm text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(doc.created_at), {
                      addSuffix: true,
                    })}
                  </div>

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/portal/esign/${doc.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      {doc.status === "draft" && (
                        <DropdownMenuItem asChild>
                          <Link to={`/portal/esign/edit/${doc.id}`}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Fields
                          </Link>
                        </DropdownMenuItem>
                      )}
                      {(doc.status === "pending" ||
                        doc.status === "in_progress") && (
                        <DropdownMenuItem>
                          <Send className="h-4 w-4 mr-2" />
                          Resend Reminder
                        </DropdownMenuItem>
                      )}
                      {doc.status !== "voided" && doc.status !== "completed" && (
                        <DropdownMenuItem
                          onClick={() => handleVoidDocument(doc.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Void Document
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
          </div>
        )}

        {/* Upload Dialog */}
        <DocumentUploadDialog
          open={showUploadDialog}
          onOpenChange={setShowUploadDialog}
          onSuccess={(id) => {
            navigate(`/portal/esign/edit/${id}`);
          }}
        />
      </div>
    </div>
  );
};

export default ESignDashboard;
