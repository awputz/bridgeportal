import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Breadcrumbs } from "./Breadcrumbs";
import { QuickNav } from "./QuickNav";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface MarketingLayoutProps {
  children: ReactNode;
  showBackButton?: boolean;
  backTo?: string;
  backLabel?: string;
  breadcrumbs?: BreadcrumbItem[];
  showQuickNav?: boolean;
}

export const MarketingLayout = ({ 
  children, 
  showBackButton = true,
  backTo = "/portal/marketing",
  backLabel = "Back to Marketing Center",
  breadcrumbs,
  showQuickNav = true
}: MarketingLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-full overflow-x-hidden min-w-0">
      <div className="w-full max-w-full p-4 md:p-6 lg:p-8 space-y-6">
        {breadcrumbs ? (
          <Breadcrumbs items={breadcrumbs} />
        ) : showBackButton && (
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
        
        {showQuickNav && <QuickNav />}
        
        <div className="w-full max-w-full min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
};
