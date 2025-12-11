import { ReactNode } from "react";
import { ServicesSubNav } from "./ServicesSubNav";
import { ServicePageNav } from "./ServicePageNav";
import { ServiceKey } from "@/lib/serviceSubPages";

interface ServicePageLayoutProps {
  children: ReactNode;
  serviceKey: ServiceKey;
  heroContent: ReactNode;
}

export const ServicePageLayout = ({
  children,
  serviceKey,
  heroContent,
}: ServicePageLayoutProps) => {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      {heroContent}

      {/* Service Sub-Nav */}
      <ServicesSubNav />

      {/* Page-Specific Nav */}
      <ServicePageNav serviceKey={serviceKey} />

      {/* Page Content */}
      {children}
    </main>
  );
};
