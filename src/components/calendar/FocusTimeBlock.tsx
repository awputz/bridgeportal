import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { addHours, setMinutes, setSeconds } from "date-fns";

interface FocusTimeBlockProps {
  onCreateFocusTime: (startTime: Date, endTime: Date) => void;
}

export function FocusTimeBlock({ onCreateFocusTime }: FocusTimeBlockProps) {
  const handleClick = () => {
    // Set to next hour, 2-hour block
    const now = new Date();
    const nextHour = addHours(setMinutes(setSeconds(now, 0), 0), 1);
    const endTime = addHours(nextHour, 2);
    onCreateFocusTime(nextHour, endTime);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClick}
            className="gap-2 text-purple-600 border-purple-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300"
          >
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Focus Time</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Block 2 hours for focused work</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
