import { useState } from "react";
import { 
  Copy, 
  ExternalLink, 
  Trash2, 
  MoreVertical,
  Link as LinkIcon,
  Eye,
  CheckCircle,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface IntakeLinkCardProps {
  link: {
    id: string;
    name: string;
    link_code: string;
    division: string | null;
    is_active: boolean | null;
    view_count: number | null;
    created_at: string;
    expires_at: string | null;
  };
  onDelete: (id: string) => void;
  divisionLabel?: string;
}

const divisionColors: Record<string, string> = {
  "investment-sales": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  "commercial-leasing": "bg-blue-500/10 text-blue-600 border-blue-500/20",
  "residential": "bg-violet-500/10 text-violet-600 border-violet-500/20",
};

export function IntakeLinkCard({ link, onDelete, divisionLabel }: IntakeLinkCardProps) {
  const [copied, setCopied] = useState(false);
  const baseUrl = window.location.origin;
  const fullUrl = `${baseUrl}/intake/${link.link_code}`;
  
  const isExpired = link.expires_at && new Date(link.expires_at) < new Date();
  const isActive = link.is_active && !isExpired;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className={cn(
      "group transition-all duration-200 hover:shadow-lg hover:border-primary/30",
      !isActive && "opacity-75"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "bg-muted text-muted-foreground"
              )}>
                <LinkIcon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold truncate">{link.name}</h3>
                <p className="text-xs text-muted-foreground">
                  Created {formatDistanceToNow(new Date(link.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover">
              <DropdownMenuItem onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={fullUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Link
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(link.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Status and Division */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs",
              isActive 
                ? "bg-green-500/10 text-green-600 border-green-500/20" 
                : "bg-muted text-muted-foreground"
            )}
          >
            {isActive ? (
              <><CheckCircle className="h-3 w-3 mr-1" /> Active</>
            ) : (
              <><Clock className="h-3 w-3 mr-1" /> {isExpired ? "Expired" : "Inactive"}</>
            )}
          </Badge>
          {link.division && (
            <Badge 
              variant="outline" 
              className={cn("text-xs", divisionColors[link.division])}
            >
              {divisionLabel || link.division}
            </Badge>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Eye className="h-4 w-4" />
            <span>{link.view_count || 0} views</span>
          </div>
        </div>

        {/* URL Preview */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border/50">
          <LinkIcon className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          <span className="text-xs font-mono text-muted-foreground truncate flex-1">
            {fullUrl}
          </span>
        </div>

        {/* Copy Button */}
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full transition-all duration-200"
          onClick={handleCopy}
          disabled={!isActive}
        >
          {copied ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

export function IntakeLinkCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-9 w-full" />
      </CardContent>
    </Card>
  );
}
