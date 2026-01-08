import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useHRReminders } from "@/hooks/hr/useHRReminders";

interface ReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agentId?: string;
  agentName?: string;
}

export function ReminderDialog({ open, onOpenChange, agentId, agentName }: ReminderDialogProps) {
  const { createReminder } = useHRReminders();
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("09:00");
  const [message, setMessage] = useState(agentName ? `Follow up with ${agentName}` : "");

  const handleSubmit = () => {
    if (!date || !message.trim()) return;

    const [hours, minutes] = time.split(":").map(Number);
    const reminderDate = new Date(date);
    reminderDate.setHours(hours, minutes, 0, 0);

    createReminder.mutate({
      reminder_date: reminderDate.toISOString(),
      message: message.trim(),
      related_agent_id: agentId || null,
    }, {
      onSuccess: () => {
        onOpenChange(false);
        setDate(undefined);
        setTime("09:00");
        setMessage("");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-sidebar border-border/40">
        <DialogHeader>
          <DialogTitle className="text-lg font-light flex items-center gap-2">
            <Clock className="h-5 w-5 text-emerald-400" />
            Create Reminder
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white/5 border-white/10",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Time</Label>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-white/5 border-white/10"
            />
          </div>

          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What do you need to remember?"
              className="bg-white/5 border-white/10 min-h-[100px]"
            />
          </div>

          {agentName && (
            <p className="text-sm text-muted-foreground">
              Linked to: <span className="text-foreground">{agentName}</span>
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!date || !message.trim() || createReminder.isPending}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Create Reminder
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
