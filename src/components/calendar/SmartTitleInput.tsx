import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Check, Loader2 } from "lucide-react";
import { format, parse, addDays, isValid } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface ParsedEvent {
  title: string;
  date: string | null;
  time: string | null;
  duration: number;
  all_day: boolean;
  location: string | null;
}

interface SmartTitleInputProps {
  value: string;
  onChange: (value: string) => void;
  onParsedAccept?: (parsed: ParsedEvent) => void;
  placeholder?: string;
  className?: string;
}

export function SmartTitleInput({
  value,
  onChange,
  onParsedAccept,
  placeholder = "Add title or type naturally (e.g., 'Lunch with Sarah tomorrow at noon')",
  className,
}: SmartTitleInputProps) {
  const [isParsing, setIsParsing] = useState(false);
  const [parsedResult, setParsedResult] = useState<ParsedEvent | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Debounced parsing
  useEffect(() => {
    const hasNaturalLanguage = /\b(tomorrow|today|next|at|pm|am|noon|morning|afternoon|evening|monday|tuesday|wednesday|thursday|friday|saturday|sunday|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/i.test(value);
    
    if (!hasNaturalLanguage || value.length < 10) {
      setParsedResult(null);
      setShowPreview(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsParsing(true);
      try {
        const { data, error } = await supabase.functions.invoke("parse-event-title", {
          body: { text: value, referenceDate: format(new Date(), "yyyy-MM-dd") },
        });

        if (error) throw error;
        if (data?.parsed) {
          setParsedResult(data.parsed);
          setShowPreview(true);
        }
      } catch (e) {
        console.error("Failed to parse:", e);
        setParsedResult(null);
      } finally {
        setIsParsing(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [value]);

  const formatPreview = useCallback(() => {
    if (!parsedResult) return "";

    const parts: string[] = [];
    
    if (parsedResult.date) {
      try {
        const date = parse(parsedResult.date, "yyyy-MM-dd", new Date());
        if (isValid(date)) {
          parts.push(format(date, "EEEE, MMM d"));
        }
      } catch {
        parts.push(parsedResult.date);
      }
    }

    if (parsedResult.time && !parsedResult.all_day) {
      try {
        const time = parse(parsedResult.time, "HH:mm", new Date());
        if (isValid(time)) {
          parts.push(`at ${format(time, "h:mm a")}`);
        }
      } catch {
        parts.push(`at ${parsedResult.time}`);
      }
    }

    if (parsedResult.all_day) {
      parts.push("(All day)");
    } else if (parsedResult.duration && parsedResult.duration !== 60) {
      parts.push(`(${parsedResult.duration} min)`);
    }

    if (parsedResult.location) {
      parts.push(`📍 ${parsedResult.location}`);
    }

    return parts.join(" ");
  }, [parsedResult]);

  const handleAccept = () => {
    if (parsedResult && onParsedAccept) {
      onParsedAccept(parsedResult);
      onChange(parsedResult.title);
      setShowPreview(false);
      setParsedResult(null);
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn("pr-10", className)}
        />
        {isParsing && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
        {!isParsing && parsedResult && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
        )}
      </div>

      {showPreview && parsedResult && (
        <div className="flex items-center gap-2 p-2 bg-primary/5 border border-primary/20 rounded-md text-sm">
          <Sparkles className="h-4 w-4 text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{parsedResult.title}</div>
            <div className="text-muted-foreground text-xs truncate">
              {formatPreview()}
            </div>
          </div>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handleAccept}
            className="shrink-0"
          >
            <Check className="h-4 w-4 mr-1" />
            Apply
          </Button>
        </div>
      )}
    </div>
  );
}
