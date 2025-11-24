import { PropertyChatCard } from "./PropertyChatCard";
import { Property } from "@/hooks/useProperties";

interface PropertyMatchDisplayProps {
  properties: (Property & { match_score?: number; match_reason?: string })[];
}

export const PropertyMatchDisplay = ({ properties }: PropertyMatchDisplayProps) => {
  if (properties.length === 0) {
    return (
      <div className="p-4 bg-muted rounded-lg my-4">
        <p className="text-sm text-muted-foreground">
          No exact matches found yet, but we're constantly adding new properties. 
          Our team will reach out personally with recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 my-4">
      <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {properties.length} {properties.length === 1 ? 'Match Found' : 'Matches Found'}
      </p>
      <div className="grid grid-cols-1 gap-4">
        {properties.map((property) => (
          <PropertyChatCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
};
