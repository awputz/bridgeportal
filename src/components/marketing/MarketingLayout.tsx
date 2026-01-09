import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface MarketingLayoutProps {
  children: ReactNode;
  showBackButton?: boolean;
  backTo?: string;
  backLabel?: string;
}

export const MarketingLayout = ({ 
  children, 
  showBackButton = true,
  backTo = "/portal/marketing",
  backLabel = "Back to Marketing Center"
}: MarketingLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-full overflow-x-hidden min-w-0">
      <div className="w-full max-w-full p-4 md:p-6 lg:p-8 space-y-6">
        {showBackButton && (
          <div className="mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(backTo)}
              className="gap-2 hover:bg-muted -ml-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {backLabel}
            </Button>
          </div>
        )}
        <div className="w-full max-w-full min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
};
