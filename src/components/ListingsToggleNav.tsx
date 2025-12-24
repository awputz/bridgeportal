import { Link, useLocation } from "react-router-dom";
import { Building2, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
export const ListingsToggleNav = () => {
  const location = useLocation();
  const isInvestmentSales = location.pathname.includes("/investment-sales/listings");
  const isCommercial = location.pathname === "/commercial-listings";
  return <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center gap-2 py-3">
          <Button variant={isInvestmentSales ? "default" : "ghost"} size="sm" asChild className="gap-2">
            <Link to="/services/investment-sales/listings">
              <Building2 className="h-4 w-4" />
              Investment Sales Listings 
            </Link>
          </Button>
          <Button variant={isCommercial ? "default" : "ghost"} size="sm" asChild className="gap-2">
            <Link to="/commercial-listings">
              <Store className="h-4 w-4" />
              Commercial Leasing Listings
            </Link>
          </Button>
        </div>
      </div>
    </div>;
};