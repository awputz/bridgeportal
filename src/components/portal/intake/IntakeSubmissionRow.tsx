import { 
  Building2, 
  Home, 
  Briefcase, 
  MoreVertical,
  Eye,
  CheckCircle2,
  UserPlus,
  Mail,
  Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { IntakeSubmission } from "@/hooks/useIntake";

const divisionInfo: Record<string, { label: string; icon: typeof Building2; color: string }> = {
  "investment-sales": { label: "Investment Sales", icon: Building2, color: "text-emerald-500" },
  "commercial-leasing": { label: "Commercial Leasing", icon: Briefcase, color: "text-blue-500" },
  "residential": { label: "Residential", icon: Home, color: "text-violet-500" },
};

const statusConfig: Record<string, { bg: string; text: string; icon?: typeof CheckCircle2 }> = {
  new: { 
    bg: "bg-blue-500/10 border-blue-500/20", 
    text: "text-blue-600",
  },
  contacted: { 
    bg: "bg-amber-500/10 border-amber-500/20", 
    text: "text-amber-600",
  },
  converted: { 
    bg: "bg-green-500/10 border-green-500/20", 
    text: "text-green-600",
    icon: CheckCircle2,
  },
  closed: { 
    bg: "bg-muted border-border", 
    text: "text-muted-foreground",
  },
};

interface IntakeSubmissionRowProps {
  submission: IntakeSubmission;
  onView: () => void;
  onMarkContacted: () => void;
  onConvertToContact: () => void;
}

export function IntakeSubmissionRow({
  submission,
  onView,
  onMarkContacted,
  onConvertToContact,
}: IntakeSubmissionRowProps) {
  const divInfo = divisionInfo[submission.division];
  const DivIcon = divInfo?.icon || Building2;
  const status = statusConfig[submission.status] || statusConfig.new;
  const StatusIcon = status.icon;

  return (
    <TableRow className="group hover:bg-muted/50 transition-colors">
      <TableCell>
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium"
          )}>
            {submission.client_name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate">{submission.client_name}</p>
            <p className="text-sm text-muted-foreground truncate">{submission.client_email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <DivIcon className={cn("h-4 w-4 flex-shrink-0", divInfo?.color)} />
          <span className="text-sm hidden sm:inline">{divInfo?.label || submission.division}</span>
        </div>
      </TableCell>
      <TableCell>
        <Badge 
          variant="outline" 
          className={cn("capitalize gap-1", status.bg, status.text)}
        >
          {StatusIcon && <StatusIcon className="h-3 w-3" />}
          {submission.status}
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground text-sm hidden md:table-cell">
        {formatDistanceToNow(new Date(submission.created_at), { addSuffix: true })}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
          {/* Quick Actions - visible on hover */}
          <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => window.location.href = `mailto:${submission.client_email}`}
              title="Send email"
            >
              <Mail className="h-4 w-4" />
            </Button>
            {submission.client_phone && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => window.location.href = `tel:${submission.client_phone}`}
                title="Call"
              >
                <Phone className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover">
              <DropdownMenuItem onClick={onView}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => window.location.href = `mailto:${submission.client_email}`}>
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </DropdownMenuItem>
              {submission.client_phone && (
                <DropdownMenuItem onClick={() => window.location.href = `tel:${submission.client_phone}`}>
                  <Phone className="h-4 w-4 mr-2" />
                  Call Client
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {submission.status === "new" && (
                <DropdownMenuItem onClick={onMarkContacted}>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark Contacted
                </DropdownMenuItem>
              )}
              {!submission.converted_contact_id && (
                <DropdownMenuItem onClick={onConvertToContact}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Convert to Contact
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function IntakeSubmissionRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-24" />
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-20 rounded-full" />
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-8 w-8 rounded ml-auto" />
      </TableCell>
    </TableRow>
  );
}
