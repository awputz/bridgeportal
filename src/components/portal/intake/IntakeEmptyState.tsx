import { Users } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

interface IntakeEmptyStateProps {
  type: "submissions";
}

export function IntakeEmptyState({ type }: IntakeEmptyStateProps) {
  return (
    <EmptyState
      icon={Users}
      title="No submissions yet"
      description="Share your intake link with clients to start collecting their criteria and requirements. Submissions will appear here once clients complete the form."
      className="py-20"
    />
  );
}
