import { useEffect } from "react";
import { Calendar as CalendarIcon, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Calendar() {
  useEffect(() => {
    // Redirect to Google Calendar after a brief moment
    const timer = setTimeout(() => {
      window.location.href = "https://calendar.google.com";
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="glass-card p-8 md:p-12 max-w-xl text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-green-500/20 flex items-center justify-center mx-auto mb-6">
          <CalendarIcon className="h-10 w-10 text-blue-500" />
        </div>
        <h2 className="text-2xl font-light text-foreground mb-3">Opening Google Calendar...</h2>
        <p className="text-muted-foreground font-light mb-6">
          Redirecting you to Google Calendar in a moment.
        </p>
        <div className="flex items-center justify-center gap-3 mb-6">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
        <Button
          size="lg"
          onClick={() => window.open("https://calendar.google.com", "_blank")}
          className="gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          Open Calendar Now
        </Button>
      </div>
    </div>
  );
}
