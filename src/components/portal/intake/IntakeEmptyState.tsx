import { LucideIcon, Users, Link as LinkIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface IntakeEmptyStateProps {
  type: "submissions" | "links";
  onAction?: () => void;
}

const emptyStateConfig = {
  submissions: {
    icon: Users,
    title: "No submissions yet",
    description: "Share your intake links with clients to start collecting their criteria and requirements.",
    actionLabel: null,
  },
  links: {
    icon: LinkIcon,
    title: "No intake links yet",
    description: "Create a shareable link to start collecting client submissions.",
    actionLabel: "Create Link",
  },
};

export function IntakeEmptyState({ type, onAction }: IntakeEmptyStateProps) {
  const config = emptyStateConfig[type];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{config.title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        {config.description}
      </p>
      {config.actionLabel && onAction && (
        <Button onClick={onAction}>
          <Plus className="h-4 w-4 mr-2" />
          {config.actionLabel}
        </Button>
      )}
    </div>
  );
}
