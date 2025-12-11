import { Link } from "react-router-dom";
import { MarketStats } from "@/components/MarketStats";
import { InvestmentCalculator } from "@/components/InvestmentCalculator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Calculator, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBridgeCalculatorBySection } from "@/hooks/useBridgeCalculators";

const MarketInsights = () => {
  const { data: calculatorConfig } = useBridgeCalculatorBySection("commercial_market_insights", "insights_calculator");

  return (
    <div className="min-h-screen pt-28 md:pt-36 lg:pt-44 pb-20 md:pb-28 lg:pb-36 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 md:mb-20 max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 md:mb-10 tracking-tight">
            Market Insights
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light">
            Perspectives on New York real estate from the Bridge Advisory Group team.
          </p>
        </div>

        {/* Research Link */}
        <div className="mb-12 p-6 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <FileText className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-light mb-1">Research And Reports</h3>
                <p className="text-sm text-muted-foreground font-light">
                  Formal reports, yearly reviews, and market studies from Bridge Advisory Group.
                </p>
              </div>
            </div>
            <Button asChild variant="outline" className="font-light">
              <Link to="/research">
                View Reports
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="market" className="space-y-8">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2">
            <TabsTrigger value="market" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Market Data
            </TabsTrigger>
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Calculator
            </TabsTrigger>
          </TabsList>

          <TabsContent value="market" className="space-y-8">
            <MarketStats />
          </TabsContent>

          <TabsContent value="calculator">
            <InvestmentCalculator config={calculatorConfig ? {
              title: calculatorConfig.title || undefined,
              subtitle: calculatorConfig.subtitle || undefined,
              defaults: calculatorConfig.input_config?.defaults as any,
            } : undefined} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MarketInsights;
