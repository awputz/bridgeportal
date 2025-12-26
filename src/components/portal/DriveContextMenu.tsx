import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  ExternalLink,
  Eye,
  Download,
  Link2,
  Star,
  StarOff,
  Pencil,
  FolderInput,
  Copy,
  Trash2,
  FolderOpen,
} from "lucide-react";
import { DriveFile } from "@/hooks/useGoogleDrive";
import { toast } from "sonner";

interface DriveContextMenuProps {
  file: DriveFile;
  children: React.ReactNode;
  onPreview?: (file: DriveFile) => void;
  onNavigateToFolder?: (folderId: string) => void;
}

export function DriveContextMenu({ file, children, onPreview, onNavigateToFolder }: DriveContextMenuProps) {
  const isFolder = file.mimeType.includes("folder");
  
  const handleCopyLink = async () => {
    if (file.webViewLink) {
      await navigator.clipboard.writeText(file.webViewLink);
      toast.success("Link copied to clipboard");
    }
  };

  const handleDownload = () => {
    if (file.webContentLink) {
      window.open(file.webContentLink, "_blank");
    } else if (file.webViewLink) {
      // For Google Docs/Sheets/Slides, open the export URL
      const exportUrl = file.webViewLink.replace("/view", "/export");
      window.open(exportUrl, "_blank");
    }
  };

  const handleOpenInDrive = () => {
    if (file.webViewLink) {
      window.open(file.webViewLink, "_blank");
    }
  };

  const handleOpenFolder = () => {
    if (isFolder && onNavigateToFolder) {
      onNavigateToFolder(file.id);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        {isFolder ? (
          <>
            <ContextMenuItem onClick={handleOpenFolder} className="gap-2">
              <FolderOpen className="h-4 w-4" />
              Open folder
            </ContextMenuItem>
            <ContextMenuItem onClick={handleOpenInDrive} className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Open in Google Drive
            </ContextMenuItem>
          </>
        ) : (
          <>
            {onPreview && (
              <ContextMenuItem onClick={() => onPreview(file)} className="gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </ContextMenuItem>
            )}
            <ContextMenuItem onClick={handleOpenInDrive} className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Open in new tab
            </ContextMenuItem>
          </>
        )}
        
        <ContextMenuSeparator />
        
        {!isFolder && (
          <ContextMenuItem onClick={handleDownload} className="gap-2">
            <Download className="h-4 w-4" />
            Download
          </ContextMenuItem>
        )}
        
        <ContextMenuItem onClick={handleCopyLink} className="gap-2">
          <Link2 className="h-4 w-4" />
          Copy link
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        <ContextMenuItem disabled className="gap-2 opacity-50">
          <Star className="h-4 w-4" />
          Add to starred
        </ContextMenuItem>
        
        <ContextMenuItem disabled className="gap-2 opacity-50">
          <Pencil className="h-4 w-4" />
          Rename
        </ContextMenuItem>
        
        <ContextMenuItem disabled className="gap-2 opacity-50">
          <FolderInput className="h-4 w-4" />
          Move to...
        </ContextMenuItem>
        
        <ContextMenuItem disabled className="gap-2 opacity-50">
          <Copy className="h-4 w-4" />
          Make a copy
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        <ContextMenuItem disabled className="gap-2 text-destructive opacity-50">
          <Trash2 className="h-4 w-4" />
          Move to trash
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
