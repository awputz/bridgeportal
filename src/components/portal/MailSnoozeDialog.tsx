import { useState } from "react";
import { format, addHours, addDays, setHours, setMinutes, nextMonday, nextSaturday } from "date-fns";
import { Clock, Calendar as CalendarIcon, Sun, Moon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MailSnoozeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messageId: string;
  onSnooze: (until: Date) => void;
}

interface SnoozeOption {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  getDate: () => Date;
}

export function MailSnoozeDialog({
  open,
  onOpenChange,
  messageId,
  onSnooze,
}: MailSnoozeDialogProps) {
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [customDate, setCustomDate] = useState<Date | undefined>(new Date());
  const [customTime, setCustomTime] = useState("09:00");

  const now = new Date();

  const snoozeOptions: SnoozeOption[] = [
    {
      icon: <Clock className="h-5 w-5 text-gmail-red" />,
      label: "Later today",
      sublabel: format(addHours(now, 3), "h:mm a"),
      getDate: () => addHours(now, 3),
    },
    {
      icon: <Moon className="h-5 w-5 text-indigo-500" />,
      label: "This evening",
      sublabel: format(setHours(setMinutes(now, 0), 18), "h:mm a"),
      getDate: () => setHours(setMinutes(now, 0), 18),
    },
    {
      icon: <Sun className="h-5 w-5 text-gmail-yellow" />,
      label: "Tomorrow morning",
      sublabel: format(setHours(setMinutes(addDays(now, 1), 0), 8), "EEE, h:mm a"),
      getDate: () => setHours(setMinutes(addDays(now, 1), 0), 8),
    },
    {
      icon: <CalendarIcon className="h-5 w-5 text-green-500" />,
      label: "Tomorrow afternoon",
      sublabel: format(setHours(setMinutes(addDays(now, 1), 0), 13), "EEE, h:mm a"),
      getDate: () => setHours(setMinutes(addDays(now, 1), 0), 13),
    },
    {
      icon: <CalendarIcon className="h-5 w-5 text-blue-500" />,
      label: "This weekend",
      sublabel: format(setHours(setMinutes(nextSaturday(now), 0), 9), "EEE, h:mm a"),
      getDate: () => setHours(setMinutes(nextSaturday(now), 0), 9),
    },
    {
      icon: <CalendarIcon className="h-5 w-5 text-purple-500" />,
      label: "Next week",
      sublabel: format(setHours(setMinutes(nextMonday(now), 0), 8), "EEE, MMM d, h:mm a"),
      getDate: () => setHours(setMinutes(nextMonday(now), 0), 8),
    },
  ];

  const handleSnooze = (date: Date) => {
    onSnooze(date);
    toast.success(`Snoozed until ${format(date, "EEE, MMM d 'at' h:mm a")}`);
    onOpenChange(false);
  };

  const handleCustomSnooze = () => {
    if (!customDate) return;
    
    const [hours, minutes] = customTime.split(":").map(Number);
    const snoozeDate = setHours(setMinutes(customDate, minutes), hours);
    
    if (snoozeDate <= now) {
      toast.error("Please select a future date and time");
      return;
    }
    
    handleSnooze(snoozeDate);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-gmail-red" />
            Snooze until...
          </DialogTitle>
        </DialogHeader>

        {!showCustomPicker ? (
          <div className="space-y-1">
            {snoozeOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSnooze(option.getDate())}
                className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center group-hover:bg-muted/50">
                  {option.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{option.label}</p>
                  <p className="text-sm text-muted-foreground">{option.sublabel}</p>
                </div>
              </button>
            ))}

            <div className="pt-2 border-t">
              <button
                onClick={() => setShowCustomPicker(true)}
                className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center group-hover:bg-muted/50">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">Pick date & time</p>
                  <p className="text-sm text-muted-foreground">Choose your own schedule</p>
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCustomPicker(false)}
              className="mb-2"
            >
              ← Back to suggestions
            </Button>

            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={customDate}
                onSelect={setCustomDate}
                disabled={(date) => date < new Date()}
                initialFocus
                className="rounded-md border"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm font-medium">Time:</label>
              <input
                type="time"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCustomPicker(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCustomSnooze}
                disabled={!customDate}
                className="flex-1 bg-gmail-red hover:bg-gmail-red/90"
              >
                Snooze
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
