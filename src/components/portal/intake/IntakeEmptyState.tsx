import { Users } from "lucide-react";

interface IntakeEmptyStateProps {
  type: "submissions";
}

export function IntakeEmptyState({ type }: IntakeEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
        <Users className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No submissions yet</h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        Share your intake link with clients to start collecting their criteria and requirements.
      </p>
    </div>
  );
}
