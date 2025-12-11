import { Link } from "react-router-dom";
import { ServicePageLayout } from "@/components/ServicePageLayout";
import { BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Reporting = () => {
  const heroContent = (
    <section className="relative bg-gradient-to-b from-secondary to-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-primary font-medium mb-4">Property Management / Reporting</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">Reporting & Analytics</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">Data-driven insights and comprehensive reporting for informed decision making.</p>
      </div>
    </section>
  );

  return (
    <ServicePageLayout serviceKey="property-management" heroContent={heroContent}>
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8">Reporting Capabilities</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {["Monthly financial statements", "Rent roll analysis", "Vacancy tracking", "Expense trending", "Budget vs actual", "Custom dashboards"].map(item => (
              <div key={item} className="bg-secondary/20 rounded-lg p-6 border border-border flex items-center gap-4">
                <BarChart3 className="h-6 w-6 text-primary" />
                <span className="text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-6">Need Better Reporting?</h2>
          <Button asChild size="lg" variant="secondary"><Link to="/contact">Contact Us <ArrowRight className="ml-2 h-5 w-5" /></Link></Button>
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default Reporting;
