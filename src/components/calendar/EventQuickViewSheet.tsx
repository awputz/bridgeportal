import { format } from "date-fns";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Trash2,
  Pencil,
  Copy,
  ExternalLink,
} from "lucide-react";
import {
  Drawer,
  DrawerContent,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarEvent } from "@/hooks/useCalendarEvents";

interface EventQuickViewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: CalendarEvent | null;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export function EventQuickViewSheet({
  open,
  onOpenChange,
  event,
  onEdit,
  onDelete,
  onDuplicate,
}: EventQuickViewSheetProps) {
  if (!event) return null;

  const startDate = new Date(event.start_time);
  const endDate = event.end_time ? new Date(event.end_time) : null;

  // Check if event has a meeting link
  const hasMeetingLink =
    event.location?.includes("meet.google.com") ||
    event.location?.includes("zoom.us") ||
    event.location?.includes("teams.microsoft.com");

  const handleJoinMeeting = () => {
    if (event.location && hasMeetingLink) {
      window.open(event.location, "_blank");
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-background">
        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-4 mt-4" />

        <div className="px-4 pb-8 max-h-[80vh] overflow-y-auto">
          {/* Event Color Accent */}
          <div className="h-1 w-16 rounded-full bg-gcal-blue mb-4" />

          {/* Title */}
          <h2 className="text-xl font-semibold text-foreground mb-4">
            {event.title}
          </h2>

          {/* Time */}
          <div className="flex items-center gap-3 text-muted-foreground mb-3">
            <Clock className="h-5 w-5 shrink-0" />
            <div>
              {event.all_day ? (
                <span>{format(startDate, "EEEE, MMMM d, yyyy")}</span>
              ) : (
                <>
                  <p>{format(startDate, "EEEE, MMMM d, yyyy")}</p>
                  <p className="text-sm">
                    {format(startDate, "h:mm a")}
                    {endDate && ` – ${format(endDate, "h:mm a")}`}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-center gap-3 text-muted-foreground mb-3">
              {hasMeetingLink ? (
                <Video className="h-5 w-5 shrink-0 text-gcal-blue" />
              ) : (
                <MapPin className="h-5 w-5 shrink-0" />
              )}
              <span className="text-sm truncate">{event.location}</span>
            </div>
          )}

          {/* Description Preview */}
          {event.description && (
            <div className="mt-4 p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
              {event.description.slice(0, 150)}
              {event.description.length > 150 && "..."}
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 space-y-2">
            {hasMeetingLink && (
              <Button
                onClick={handleJoinMeeting}
                className="w-full gap-2 bg-gcal-blue hover:bg-gcal-blue/90"
              >
                <Video className="h-4 w-4" />
                Join Meeting
              </Button>
            )}

            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  onEdit();
                  onOpenChange(false);
                }}
                className="gap-1.5"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  onDuplicate();
                  onOpenChange(false);
                }}
                className="gap-1.5"
              >
                <Copy className="h-4 w-4" />
                Copy
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  onDelete();
                  onOpenChange(false);
                }}
                className="gap-1.5 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
