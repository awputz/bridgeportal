import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Settings, Clock, Calendar, Eye, Save, Loader2 } from "lucide-react";
import {
  CalendarPreferences,
  useUpdateCalendarPreferences,
  defaultPreferences,
} from "@/hooks/useCalendarPreferences";

interface CalendarSettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preferences: CalendarPreferences | null | undefined;
}

const viewOptions = [
  { value: "day", label: "Day" },
  { value: "3day", label: "3 Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "agenda", label: "Agenda" },
];

const weekStartOptions = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 6, label: "Saturday" },
];

const durationOptions = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
  { value: 120, label: "2 hours" },
];

const reminderOptions = [
  { value: 0, label: "None" },
  { value: 5, label: "5 minutes" },
  { value: 10, label: "10 minutes" },
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 60, label: "1 hour" },
  { value: 1440, label: "1 day" },
];

const weekDays = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
];

export function CalendarSettingsSheet({
  open,
  onOpenChange,
  preferences,
}: CalendarSettingsSheetProps) {
  const updatePreferences = useUpdateCalendarPreferences();
  
  const [localPrefs, setLocalPrefs] = useState<Partial<CalendarPreferences>>(
    preferences || defaultPreferences
  );

  useEffect(() => {
    if (preferences) {
      setLocalPrefs(preferences);
    }
  }, [preferences]);

  const handleSave = () => {
    updatePreferences.mutate(localPrefs, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  const updatePref = <K extends keyof CalendarPreferences>(
    key: K,
    value: CalendarPreferences[K]
  ) => {
    setLocalPrefs((prev) => ({ ...prev, [key]: value }));
  };

  const toggleWorkingDay = (day: number) => {
    const currentDays = localPrefs.working_days || defaultPreferences.working_days;
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day].sort((a, b) => a - b);
    updatePref("working_days", newDays);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Calendar Settings
          </SheetTitle>
          <SheetDescription>
            Customize your calendar experience
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Default View */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Default View
            </div>
            <Select
              value={localPrefs.default_view || defaultPreferences.default_view}
              onValueChange={(value) => updatePref("default_view", value as CalendarPreferences['default_view'])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {viewOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Time Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Time Settings
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="time-format">24-hour time</Label>
                <Switch
                  id="time-format"
                  checked={localPrefs.time_format === "24h"}
                  onCheckedChange={(checked) =>
                    updatePref("time_format", checked ? "24h" : "12h")
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Week starts on</Label>
                <Select
                  value={String(localPrefs.week_starts_on ?? defaultPreferences.week_starts_on)}
                  onValueChange={(value) => updatePref("week_starts_on", Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {weekStartOptions.map((option) => (
                      <SelectItem key={option.value} value={String(option.value)}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Default event duration</Label>
                <Select
                  value={String(localPrefs.default_event_duration ?? defaultPreferences.default_event_duration)}
                  onValueChange={(value) => updatePref("default_event_duration", Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {durationOptions.map((option) => (
                      <SelectItem key={option.value} value={String(option.value)}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Default reminder</Label>
                <Select
                  value={String(localPrefs.default_reminder_minutes ?? defaultPreferences.default_reminder_minutes)}
                  onValueChange={(value) => updatePref("default_reminder_minutes", Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {reminderOptions.map((option) => (
                      <SelectItem key={option.value} value={String(option.value)}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Working Days */}
          <div className="space-y-3">
            <Label>Working days</Label>
            <div className="flex flex-wrap gap-2">
              {weekDays.map((day) => {
                const isChecked = (localPrefs.working_days || defaultPreferences.working_days).includes(day.value);
                return (
                  <label
                    key={day.value}
                    className="flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer hover:bg-accent transition-colors"
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => toggleWorkingDay(day.value)}
                    />
                    <span className="text-sm">{day.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Display Options */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Eye className="h-4 w-4 text-muted-foreground" />
              Display Options
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-weekends">Show weekends</Label>
                <Switch
                  id="show-weekends"
                  checked={localPrefs.show_weekends ?? defaultPreferences.show_weekends}
                  onCheckedChange={(checked) => updatePref("show_weekends", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-declined">Show declined events</Label>
                <Switch
                  id="show-declined"
                  checked={localPrefs.show_declined_events ?? defaultPreferences.show_declined_events}
                  onCheckedChange={(checked) => updatePref("show_declined_events", checked)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={handleSave}
            disabled={updatePreferences.isPending}
          >
            {updatePreferences.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
