import { Link } from "react-router-dom";
import { ServicePageLayout } from "@/components/ServicePageLayout";
import { useTransactions } from "@/hooks/useTransactions";
import { Building2, TrendingUp, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
const DivisionTrackRecord = () => {
  const {
    data: transactions,
    isLoading
  } = useTransactions();
  const salesTransactions = transactions?.filter(t => t.deal_type === "sale") || [];
  const stats = [{
    label: "Total Volume",
    value: "$5B+",
    icon: TrendingUp
  }, {
    label: "Transactions Closed",
    value: "350+",
    icon: Building2
  }, {
    label: "Avg. Deal Size",
    value: "$14M",
    icon: TrendingUp
  }, {
    label: "Markets Covered",
    value: "5",
    icon: MapPin
  }];
  const heroContent = <section className="relative bg-gradient-to-b from-secondary to-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-primary font-medium mb-4">Investment Sales / Track Record</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
          Investment Sales Track Record
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          A proven history of successful investment sales transactions across New York City's 
          most competitive markets.
        </p>
      </div>
    </section>;
  return <ServicePageLayout serviceKey="investment-sales" heroContent={heroContent}>
      {/* Stats */}
      

      {/* Recent Transactions */}
      

      {/* By The Numbers */}
      

      {/* CTA */}
      
    </ServicePageLayout>;
};
export default DivisionTrackRecord;