import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { GmailWidget } from "./GmailWidget";
import { GoogleCalendarWidget } from "./GoogleCalendarWidget";
import { SectionErrorBoundary } from "./SectionErrorBoundary";
import { Mail, Calendar } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

export const WorkspaceCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const tabs = [
    { id: 0, label: "Gmail", icon: Mail, color: "text-red-400" },
    { id: 1, label: "Calendar", icon: Calendar, color: "text-emerald-400" },
  ];

  return (
    <div className="w-full">
      {/* Desktop: Side-by-side grid - 62/38 split for Gmail/Calendar */}
      <div className="hidden md:grid md:grid-cols-[62%_38%] gap-3 h-[400px]">
        <SectionErrorBoundary sectionName="Gmail">
          <GmailWidget />
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="Google Calendar">
          <GoogleCalendarWidget />
        </SectionErrorBoundary>
      </div>

      {/* Mobile: Swipeable carousel */}
      <div className="md:hidden">
        {/* Tab navigation */}
        <div className="flex items-center gap-1 mb-2 bg-muted/30 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => api?.scrollTo(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-xs font-medium transition-all",
                current === tab.id
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className={cn("h-3.5 w-3.5", current === tab.id && tab.color)} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Carousel */}
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2">
            <CarouselItem className="pl-2">
              <SectionErrorBoundary sectionName="Gmail">
                <GmailWidget />
              </SectionErrorBoundary>
            </CarouselItem>
            <CarouselItem className="pl-2">
              <SectionErrorBoundary sectionName="Google Calendar">
                <GoogleCalendarWidget />
              </SectionErrorBoundary>
            </CarouselItem>
          </CarouselContent>
        </Carousel>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-1.5 mt-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => api?.scrollTo(tab.id)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                current === tab.id
                  ? "w-4 bg-primary"
                  : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
              aria-label={`Go to ${tab.label}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
