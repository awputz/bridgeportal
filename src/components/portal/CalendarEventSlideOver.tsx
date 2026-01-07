import { useEffect, useCallback } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  MapPin,
  Video,
  ExternalLink,
  Pencil,
  Trash2,
  Copy,
  Link2,
  AlignLeft,
} from "lucide-react";
import { format } from "date-fns";

// Google Calendar color palette
const GOOGLE_COLORS: Record<string, string> = {
  "1": "#7986cb",
  "2": "#33b679",
  "3": "#8e24aa",
  "4": "#e67c73",
  "5": "#f6bf26",
  "6": "#f4511e",
  "7": "#039be5",
  "8": "#616161",
  "9": "#3f51b5",
  "10": "#0b8043",
  "11": "#d50000",
};

interface CalendarEvent {
  id: string;
  title: string;
  start_time: string;
  end_time?: string | null;
  location?: string | null;
  description?: string | null;
  all_day?: boolean;
  hangoutLink?: string;
  htmlLink?: string;
  colorId?: string;
}

interface CalendarEventSlideOverProps {
  event: CalendarEvent | null;
  onClose: () => void;
  onEdit?: (event: CalendarEvent) => void;
  onDelete?: (eventId: string) => void;
  onDuplicate?: (event: CalendarEvent) => void;
  onLinkToDeal?: (event: CalendarEvent) => void;
}

export function CalendarEventSlideOver({
  event,
  onClose,
  onEdit,
  onDelete,
  onDuplicate,
  onLinkToDeal,
}: CalendarEventSlideOverProps) {
  const eventColor = event?.colorId ? GOOGLE_COLORS[event.colorId] || "#039be5" : "#039be5";

  const handleEdit = useCallback(() => {
    if (event) onEdit?.(event);
  }, [event, onEdit]);

  const handleDelete = useCallback(() => {
    if (event?.id) onDelete?.(event.id);
  }, [event?.id, onDelete]);

  const handleDuplicate = useCallback(() => {
    if (event) onDuplicate?.(event);
  }, [event, onDuplicate]);

  const handleLinkToDeal = useCallback(() => {
    if (event) onLinkToDeal?.(event);
  }, [event, onLinkToDeal]);

  const handleJoinMeeting = useCallback(() => {
    if (event?.hangoutLink) {
      window.open(event.hangoutLink, "_blank");
    }
  }, [event?.hangoutLink]);

  const handleOpenDirections = useCallback(() => {
    if (event?.location) {
      const encodedLocation = encodeURIComponent(event.location);
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedLocation}`, "_blank");
    }
  }, [event?.location]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!event) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "e":
          if (!e.metaKey && !e.ctrlKey) handleEdit();
          break;
        case "j":
          if (!e.metaKey && !e.ctrlKey && event?.hangoutLink) handleJoinMeeting();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [event, onClose, handleEdit, handleJoinMeeting]);

  if (!event) return null;

  const startTime = new Date(event.start_time);
  const endTime = event.end_time ? new Date(event.end_time) : null;
  const googleCalendarUrl = event.htmlLink || `https://calendar.google.com/calendar/u/0/r/eventedit/${event.id}`;

  return (
    <Sheet open={!!event} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col">
        {/* Color accent bar */}
        <div className="h-2 w-full shrink-0" style={{ backgroundColor: eventColor }} />

        {/* Header */}
        <SheetHeader className="px-4 py-3 border-b shrink-0">
          <SheetTitle className="text-base font-semibold pr-8">
            {event.title || "(No title)"}
          </SheetTitle>
        </SheetHeader>

        {/* Actions Bar */}
        <div className="px-4 py-2 border-b flex items-center gap-1 shrink-0 bg-muted/30 flex-wrap">
          {event.hangoutLink && (
            <Button
              variant="default"
              size="sm"
              className="h-8 gap-1.5 text-xs bg-gcal-blue hover:bg-gcal-blue/90"
              onClick={handleJoinMeeting}
            >
              <Video className="h-3.5 w-3.5" />
              Join
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={handleEdit}
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={handleDuplicate}
          >
            <Copy className="h-3.5 w-3.5" />
            Duplicate
          </Button>
          {onLinkToDeal && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={handleLinkToDeal}
            >
              <Link2 className="h-3.5 w-3.5" />
              Link
            </Button>
          )}
          <div className="flex-1" />
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-xs text-destructive hover:text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </Button>
        </div>

        {/* Event Content */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {/* Date & Time */}
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">
                  {format(startTime, "EEEE, MMMM d, yyyy")}
                </p>
                {event.all_day ? (
                  <p className="text-sm text-muted-foreground">All day</p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {format(startTime, "h:mm a")}
                    {endTime && ` – ${format(endTime, "h:mm a")}`}
                  </p>
                )}
              </div>
            </div>

            {/* Google Meet Link */}
            {event.hangoutLink && (
              <div className="flex items-start gap-3">
                <Video className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Google Meet</p>
                  <button
                    onClick={handleJoinMeeting}
                    className="text-sm text-primary hover:underline"
                  >
                    Join video call
                  </button>
                </div>
              </div>
            )}

            {/* Location */}
            {event.location && (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{event.location}</p>
                  <button
                    onClick={handleOpenDirections}
                    className="text-sm text-primary hover:underline"
                  >
                    Get directions
                  </button>
                </div>
              </div>
            )}

            {/* Description */}
            {event.description && (
              <>
                <Separator />
                <div className="flex items-start gap-3">
                  <AlignLeft className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="text-sm text-foreground whitespace-pre-wrap">
                    {event.description}
                  </div>
                </div>
              </>
            )}

            {/* Open in Google Calendar */}
            <Separator />
            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              Open in Google Calendar
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
