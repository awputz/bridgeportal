import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { FileText, Download, Trash2, Upload, File, FileSpreadsheet, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDealRoomFiles, useUploadDealRoomFile, useDeleteDealRoomFile } from "@/hooks/useDealRoom";
import { OMUploader } from "./OMUploader";
import { toast } from "sonner";

interface DealRoomFilesProps {
  dealId: string;
  isOwner: boolean;
  omFileUrl?: string | null;
  omFileName?: string | null;
}

function getFileIcon(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return <FileText className="h-5 w-5 text-red-500" />;
  if (["xls", "xlsx", "csv"].includes(ext || "")) return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
  if (["doc", "docx"].includes(ext || "")) return <FileText className="h-5 w-5 text-blue-500" />;
  return <File className="h-5 w-5 text-muted-foreground" />;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function DealRoomFiles({ dealId, isOwner, omFileUrl, omFileName }: DealRoomFilesProps) {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const { data: files, isLoading } = useDealRoomFiles(dealId);
  const uploadFileMutation = useUploadDealRoomFile();
  const deleteFileMutation = useDeleteDealRoomFile();

  const handleUpload = async () => {
    if (!uploadFile) return;

    try {
      await uploadFileMutation.mutateAsync({ dealId, file: uploadFile });
      setUploadFile(null);
      setUploadDialogOpen(false);
      toast.success("File uploaded successfully");
    } catch {
      toast.error("Failed to upload file");
    }
  };

  const handleDelete = async (fileId: string, fileName: string) => {
    if (!confirm(`Delete ${fileName}?`)) return;

    try {
      await deleteFileMutation.mutateAsync({ dealId, fileId });
      toast.success("File deleted");
    } catch {
      toast.error("Failed to delete file");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
            <Skeleton className="h-10 w-10 rounded" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const allFiles = [
    // OM file first if exists
    ...(omFileUrl
      ? [
          {
            id: "om-file",
            file_name: omFileName || "Offering Memorandum.pdf",
            file_url: omFileUrl,
            file_size: null,
            created_at: null,
            isOM: true,
          },
        ]
      : []),
    // Additional files
    ...(files || []).map((f) => ({ ...f, isOM: false })),
  ];

  return (
    <div className="space-y-4">
      {/* Upload Button (Owner only) */}
      {isOwner && (
        <div className="px-4 pt-4">
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full gap-2">
                <Plus className="h-4 w-4" />
                Upload File
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload File</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <OMUploader
                  file={uploadFile}
                  onFileChange={setUploadFile}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
                  maxSize={25 * 1024 * 1024}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setUploadDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={!uploadFile || uploadFileMutation.isPending}
                  >
                    {uploadFileMutation.isPending ? "Uploading..." : "Upload"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Files List */}
      <ScrollArea className="h-[350px]">
        {allFiles.length > 0 ? (
          <div className="space-y-2 px-4 pb-4">
            {allFiles.map((file) => (
              <div
                key={file.id}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  file.isOM ? "border-primary/30 bg-primary/5" : ""
                }`}
              >
                <div className="flex-shrink-0">{getFileIcon(file.file_name)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{file.file_name}</p>
                    {file.isOM && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-primary/20 text-primary">
                        OM
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {file.file_size ? formatFileSize(file.file_size) : ""}
                    {file.created_at && (
                      <>
                        {file.file_size && " • "}
                        {formatDistanceToNow(new Date(file.created_at), { addSuffix: true })}
                      </>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => window.open(file.file_url, "_blank")}
                  >
                    <Download className="h-4 w-4" />
                  </Button>

                  {isOwner && !file.isOM && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(file.id, file.file_name)}
                      disabled={deleteFileMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <Upload className="h-10 w-10 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">No files attached</p>
            {isOwner && (
              <p className="text-xs text-muted-foreground mt-1">
                Upload an OM or supporting documents
              </p>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
