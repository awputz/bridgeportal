import { MarketStats } from "@/components/MarketStats";
import { InvestmentCalculator } from "@/components/InvestmentCalculator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Calculator } from "lucide-react";

const MarketInsights = () => {
  return (
    <div className="min-h-screen pt-28 md:pt-36 lg:pt-44 pb-20 md:pb-28 lg:pb-36 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 md:mb-20 max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 md:mb-10 tracking-tight">
            Market Insights
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light">
            Real-time data, investment tools, and market analysis to inform your NYC real estate decisions
          </p>
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
            <InvestmentCalculator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MarketInsights;
