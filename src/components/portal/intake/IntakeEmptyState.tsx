import { Users, FileText } from "lucide-react";

interface IntakeEmptyStateProps {
  type: "submissions";
}

export function IntakeEmptyState({ type }: IntakeEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
        <Users className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-3">No submissions yet</h3>
      <p className="text-muted-foreground max-w-sm leading-relaxed">
        Share your intake link with clients to start collecting their criteria and requirements.
      </p>
      <div className="flex items-center gap-2 mt-6 text-sm text-muted-foreground">
        <FileText className="h-4 w-4" />
        <span>Submissions will appear here once clients complete the form</span>
      </div>
    </div>
  );
}
