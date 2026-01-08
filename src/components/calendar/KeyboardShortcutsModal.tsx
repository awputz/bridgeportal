import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Keyboard } from "lucide-react";

interface KeyboardShortcutsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const shortcuts = [
  {
    category: "Navigation",
    items: [
      { key: "T", description: "Go to today" },
      { key: "J / →", description: "Next period" },
      { key: "K / ←", description: "Previous period" },
    ],
  },
  {
    category: "Views",
    items: [
      { key: "D", description: "Day view" },
      { key: "3", description: "3-day view" },
      { key: "W", description: "Week view" },
      { key: "M", description: "Month view" },
      { key: "A", description: "Agenda view" },
    ],
  },
  {
    category: "Actions",
    items: [
      { key: "C", description: "Create event" },
      { key: "/", description: "Search events" },
      { key: "?", description: "Show shortcuts" },
    ],
  },
];

export function KeyboardShortcutsModal({ open, onOpenChange }: KeyboardShortcutsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {shortcuts.map(({ category, items }) => (
            <div key={category}>
              <h4 className="text-sm font-medium text-muted-foreground mb-3">
                {category}
              </h4>
              <div className="space-y-2">
                {items.map(({ key, description }) => (
                  <div
                    key={key}
                    className="flex justify-between items-center gap-4"
                  >
                    <span className="text-sm text-foreground/80">{description}</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono text-muted-foreground min-w-[2rem] text-center">
                      {key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="pt-4 border-t mt-4">
          <p className="text-xs text-muted-foreground text-center">
            Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">?</kbd> anytime to show this help
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
