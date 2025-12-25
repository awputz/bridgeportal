import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface AgentDisplayProps {
  name: string | null;
  email: string | null;
  showAvatar?: boolean;
  size?: "sm" | "md";
}

export function AgentDisplay({ name, email, showAvatar = true, size = "md" }: AgentDisplayProps) {
  const initials = name
    ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : email
    ? email[0].toUpperCase()
    : "?";

  const displayName = name || email?.split("@")[0] || "Unknown Agent";

  return (
    <div className="flex items-center gap-2">
      {showAvatar && (
        <Avatar className={size === "sm" ? "h-6 w-6" : "h-8 w-8"}>
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            {initials || <User className="h-3 w-3" />}
          </AvatarFallback>
        </Avatar>
      )}
      <div className="flex flex-col">
        <span className={`font-medium ${size === "sm" ? "text-sm" : ""}`}>{displayName}</span>
        {email && name && (
          <span className="text-xs text-muted-foreground">{email}</span>
        )}
      </div>
    </div>
  );
}
