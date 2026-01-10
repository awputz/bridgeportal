import { useState } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { CalendarIcon, Instagram, Facebook, Linkedin, Twitter, Loader2, Clock } from "lucide-react";
import { useCreateScheduledPost } from "@/hooks/marketing/useScheduledPosts";

interface SchedulePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialContent?: string;
  projectId?: string;
}

const platforms = [
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-600' },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
  { id: 'twitter', label: 'Twitter / X', icon: Twitter, color: 'text-sky-500' },
] as const;

export function SchedulePostDialog({ 
  open, 
  onOpenChange, 
  initialContent = '',
  projectId 
}: SchedulePostDialogProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram']);
  const [content, setContent] = useState(initialContent);
  const [hashtags, setHashtags] = useState('');
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('09:00');

  const { mutate: schedulePost, isPending } = useCreateScheduledPost();

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handleSchedule = () => {
    if (!date || selectedPlatforms.length === 0 || !content.trim()) return;

    const [hours, minutes] = time.split(':').map(Number);
    const scheduledDate = new Date(date);
    scheduledDate.setHours(hours, minutes, 0, 0);

    const hashtagArray = hashtags
      .split(/[,\s#]+/)
      .filter(tag => tag.trim())
      .map(tag => tag.trim());

    // Schedule for each selected platform
    selectedPlatforms.forEach(platform => {
      schedulePost({
        platform: platform as 'instagram' | 'facebook' | 'linkedin' | 'twitter',
        content: content.trim(),
        hashtags: hashtagArray.length > 0 ? hashtagArray : undefined,
        scheduled_at: scheduledDate.toISOString(),
        project_id: projectId,
      });
    });

    onOpenChange(false);
    // Reset form
    setContent('');
    setHashtags('');
    setDate(undefined);
    setTime('09:00');
    setSelectedPlatforms(['instagram']);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
        <DialogHeader className="space-y-2 pb-4 flex-shrink-0">
          <DialogTitle className="text-2xl font-light">Schedule Social Post</DialogTitle>
          <DialogDescription className="text-sm">
            Schedule your content to be posted on social media
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-6 py-4">
            {/* Platform Selection */}
            <div className="space-y-2">
              <Label>Platforms</Label>
              <div className="flex flex-wrap gap-3">
                {platforms.map(platform => {
                  const Icon = platform.icon;
                  const isSelected = selectedPlatforms.includes(platform.id);
                  return (
                    <button
                      key={platform.id}
                      type="button"
                      onClick={() => handlePlatformToggle(platform.id)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors",
                        isSelected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <Icon className={cn("h-4 w-4", isSelected && platform.color)} />
                      <span className="text-sm">{platform.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Write your post content..."
                rows={4}
              />
              <p className="text-xs text-muted-foreground text-right">
                {content.length} characters
              </p>
            </div>

            {/* Hashtags */}
            <div className="space-y-2">
              <Label htmlFor="hashtags">Hashtags</Label>
              <Input
                id="hashtags"
                value={hashtags}
                onChange={e => setHashtags(e.target.value)}
                placeholder="#realestate #justlisted #homeforsale"
              />
              <p className="text-xs text-muted-foreground">
                Separate with spaces or commas
              </p>
            </div>

            {/* Date & Time */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
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
                      disabled={(d) => d < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2 pt-4 border-t flex-shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSchedule}
            disabled={isPending || !date || selectedPlatforms.length === 0 || !content.trim()}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scheduling...
              </>
            ) : (
              <>
                <CalendarIcon className="mr-2 h-4 w-4" />
                Schedule Post
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
