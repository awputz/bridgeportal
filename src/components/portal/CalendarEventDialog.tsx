import { useState, useEffect } from "react";
import { format, addHours, setHours, setMinutes } from "date-fns";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  AlignLeft,
  Palette,
  Bell,
  Repeat,
  Users,
  Video,
  X,
  ChevronDown,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CalendarEvent } from "@/hooks/useCalendarEvents";

// Google Calendar color palette
const EVENT_COLORS = [
  { id: "1", name: "Lavender", color: "#7986cb" },
  { id: "2", name: "Sage", color: "#33b679" },
  { id: "3", name: "Grape", color: "#8e24aa" },
  { id: "4", name: "Flamingo", color: "#e67c73" },
  { id: "5", name: "Banana", color: "#f6bf26" },
  { id: "6", name: "Tangerine", color: "#f4511e" },
  { id: "7", name: "Peacock", color: "#039be5" },
  { id: "8", name: "Graphite", color: "#616161" },
  { id: "9", name: "Blueberry", color: "#3f51b5" },
  { id: "10", name: "Basil", color: "#0b8043" },
  { id: "11", name: "Tomato", color: "#d50000" },
  { id: "12", name: "Default", color: "#4285f4" },
];

const REMINDER_OPTIONS = [
  { value: "0", label: "At time of event" },
  { value: "5", label: "5 minutes before" },
  { value: "10", label: "10 minutes before" },
  { value: "15", label: "15 minutes before" },
  { value: "30", label: "30 minutes before" },
  { value: "60", label: "1 hour before" },
  { value: "1440", label: "1 day before" },
];

const RECURRENCE_OPTIONS = [
  { value: "none", label: "Does not repeat" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
  { value: "custom", label: "Custom..." },
];

interface CalendarEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: CalendarEvent | null;
  defaultDate?: Date;
  defaultTime?: string;
  onSave?: (event: Partial<CalendarEvent>) => void;
  onDelete?: (eventId: string) => void;
}

export function CalendarEventDialog({
  open,
  onOpenChange,
  event,
  defaultDate,
  defaultTime,
  onSave,
  onDelete,
}: CalendarEventDialogProps) {
  const isEditing = !!event;
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [allDay, setAllDay] = useState(false);
  const [colorId, setColorId] = useState("12");
  const [reminder, setReminder] = useState("30");
  const [recurrence, setRecurrence] = useState("none");
  const [guests, setGuests] = useState("");
  const [addMeet, setAddMeet] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  // Reset form when dialog opens/closes or event changes
  useEffect(() => {
    if (open) {
      if (event) {
        setTitle(event.title || "");
        setDescription(event.description || "");
        setLocation(event.location || "");
        const start = new Date(event.start_time);
        setStartDate(start);
        setStartTime(format(start, "HH:mm"));
        if (event.end_time) {
          const end = new Date(event.end_time);
          setEndDate(end);
          setEndTime(format(end, "HH:mm"));
        }
        setAllDay(event.all_day || false);
      } else {
        // New event
        const baseDate = defaultDate || new Date();
        setTitle("");
        setDescription("");
        setLocation("");
        setStartDate(baseDate);
        setEndDate(baseDate);
        
        if (defaultTime) {
          setStartTime(defaultTime);
          const [hours, minutes] = defaultTime.split(":").map(Number);
          const endTimeDate = setMinutes(setHours(new Date(), hours + 1), minutes);
          setEndTime(format(endTimeDate, "HH:mm"));
        } else {
          setStartTime("09:00");
          setEndTime("10:00");
        }
        
        setAllDay(false);
        setColorId("12");
        setReminder("30");
        setRecurrence("none");
        setGuests("");
        setAddMeet(false);
      }
    }
  }, [open, event, defaultDate, defaultTime]);

  const handleSave = () => {
    if (!title.trim()) return;
    
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);
    
    const start = allDay 
      ? startDate 
      : setMinutes(setHours(startDate, startHours), startMinutes);
    
    const end = allDay
      ? endDate
      : setMinutes(setHours(endDate, endHours), endMinutes);

    onSave?.({
      id: event?.id,
      title: title.trim(),
      description: description.trim() || null,
      location: location.trim() || null,
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      all_day: allDay,
      event_type: "personal",
    });
    
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (event?.id && onDelete) {
      onDelete(event.id);
      onOpenChange(false);
    }
  };

  const selectedColor = EVENT_COLORS.find(c => c.id === colorId) || EVENT_COLORS[11];

  // Generate time options (15-minute intervals)
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      const label = format(setMinutes(setHours(new Date(), hour), minute), "h:mm a");
      timeOptions.push({ value: time, label });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden">
        {/* Header with color accent */}
        <div 
          className="h-2 w-full"
          style={{ backgroundColor: selectedColor.color }}
        />
        
        <DialogHeader className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-normal">
              {isEditing ? "Edit Event" : "Create Event"}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="p-4 form-section max-h-[70vh] overflow-y-auto">
          {/* Title */}
          <Input
            placeholder="Add title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
            autoFocus
          />

          {/* Date & Time */}
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-muted-foreground mt-2.5" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Start Date */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 px-3 font-normal">
                      {format(startDate, "EEE, MMM d, yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => date && setStartDate(date)}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>

                {!allDay && (
                  <>
                    <Select value={startTime} onValueChange={setStartTime}>
                      <SelectTrigger className="w-[100px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {timeOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <span className="text-muted-foreground">–</span>
                    
                    <Select value={endTime} onValueChange={setEndTime}>
                      <SelectTrigger className="w-[100px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {timeOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </>
                )}
              </div>

              {/* All Day Toggle */}
              <div className="flex items-center gap-2">
                <Switch
                  id="all-day"
                  checked={allDay}
                  onCheckedChange={setAllDay}
                />
                <Label htmlFor="all-day" className="text-sm text-muted-foreground">
                  All day
                </Label>
              </div>

              {/* Recurrence */}
              <Select value={recurrence} onValueChange={setRecurrence}>
                <SelectTrigger className="w-full h-8 text-sm">
                  <Repeat className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RECURRENCE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Add location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1"
            />
          </div>

          {/* Add Google Meet */}
          <div className="flex items-center gap-3">
            <Video className="h-5 w-5 text-muted-foreground" />
            <Button
              variant={addMeet ? "default" : "outline"}
              size="sm"
              onClick={() => setAddMeet(!addMeet)}
              className={cn(
                "gap-2",
                addMeet && "bg-gcal-blue hover:bg-gcal-blue/90"
              )}
            >
              <Video className="h-4 w-4" />
              {addMeet ? "Google Meet added" : "Add Google Meet"}
            </Button>
          </div>

          {/* Description */}
          <div className="flex items-start gap-3">
            <AlignLeft className="h-5 w-5 text-muted-foreground mt-2" />
            <Textarea
              placeholder="Add description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-1 min-h-[80px] resize-none"
            />
          </div>

          {/* Show More Options */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMoreOptions(!showMoreOptions)}
            className="w-full justify-between text-muted-foreground"
          >
            More options
            <ChevronDown className={cn("h-4 w-4 transition-transform", showMoreOptions && "rotate-180")} />
          </Button>

          {showMoreOptions && (
            <div className="form-section pt-2 border-t border-border/50">
              {/* Guests */}
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Add guests (email addresses)"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="flex-1"
                />
              </div>

              {/* Reminder */}
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <Select value={reminder} onValueChange={setReminder}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REMINDER_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Color */}
              <div className="flex items-center gap-3">
                <Palette className="h-5 w-5 text-muted-foreground" />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: selectedColor.color }}
                      />
                      {selectedColor.name}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2" align="start">
                    <div className="grid grid-cols-4 gap-2">
                      {EVENT_COLORS.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => setColorId(color.id)}
                          className={cn(
                            "w-8 h-8 rounded-full transition-all hover:scale-110",
                            colorId === color.id && "ring-2 ring-offset-2 ring-primary"
                          )}
                          style={{ backgroundColor: color.color }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border/50 bg-muted/5">
          {isEditing && (
            <Button
              variant="ghost"
              onClick={handleDelete}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              Delete
            </Button>
          )}
          {!isEditing && <div />}
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!title.trim()}
              className="bg-gcal-blue hover:bg-gcal-blue/90"
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
