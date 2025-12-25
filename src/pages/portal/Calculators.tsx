import { useState } from "react";
import { Calculator, TrendingUp, Building2, Home, DollarSign, Percent, BarChart3, PiggyBank, Receipt, Users, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvestmentCalculator } from "@/components/InvestmentCalculator";
import { CashFlowAnalyzer } from "@/components/CashFlowAnalyzer";
import { Exchange1031Calculator } from "@/components/Exchange1031Calculator";
import LeaseCalculator from "@/components/LeaseCalculator";
import NetEffectiveRentCalculator from "@/components/NetEffectiveRentCalculator";
import { RentVsBuyCalculator } from "@/components/RentVsBuyCalculator";
import { RentOptimizationCalculator } from "@/components/RentOptimizationCalculator";
import { GRMCalculator } from "@/components/calculators/GRMCalculator";
import { DSCRCalculator } from "@/components/calculators/DSCRCalculator";
import { CommissionCalculator } from "@/components/calculators/CommissionCalculator";
import { TransferTaxCalculator } from "@/components/calculators/TransferTaxCalculator";
import { RentAffordabilityCalculator } from "@/components/calculators/RentAffordabilityCalculator";
import { TICalculator } from "@/components/calculators/TICalculator";

const calculatorCategories = [
  {
    id: "investment-sales",
    name: "Investment Sales",
    icon: TrendingUp,
    description: "Analyze deals, cap rates, and returns",
    calculators: [
      { id: "cap-rate", name: "Cap Rate & NOI", description: "Calculate capitalization rates and net operating income", icon: Percent, component: InvestmentCalculator },
      { id: "cash-flow", name: "Cash Flow Analyzer", description: "Multi-year ROI projections with IRR analysis", icon: BarChart3, component: CashFlowAnalyzer },
      { id: "1031-exchange", name: "1031 Exchange", description: "Tax-deferred exchange calculations", icon: DollarSign, component: Exchange1031Calculator },
      { id: "grm", name: "Gross Rent Multiplier", description: "Quick property valuation by GRM", icon: TrendingUp, component: GRMCalculator },
      { id: "dscr", name: "DSCR Calculator", description: "Debt service coverage ratio for loan qualification", icon: FileText, component: DSCRCalculator },
    ],
  },
  {
    id: "commercial-leasing",
    name: "Commercial Leasing",
    icon: Building2,
    description: "Lease analysis and tenant calculations",
    calculators: [
      { id: "lease-calc", name: "Lease Calculator", description: "Commercial lease term analysis", icon: Calculator, component: LeaseCalculator },
      { id: "net-effective-commercial", name: "Net Effective Rent", description: "Calculate effective rent with concessions", icon: DollarSign, component: NetEffectiveRentCalculator },
      { id: "ti-calculator", name: "TI Allowance", description: "Tenant improvement and concession analysis", icon: Building2, component: TICalculator },
    ],
  },
  {
    id: "residential",
    name: "Residential",
    icon: Home,
    description: "Home buying and rental analysis",
    calculators: [
      { id: "rent-vs-buy", name: "Rent vs Buy", description: "Compare renting versus buying costs", icon: Home, component: RentVsBuyCalculator },
      { id: "rent-affordability", name: "Rent Affordability (40x)", description: "NYC 40x income rule calculator", icon: PiggyBank, component: RentAffordabilityCalculator },
      { id: "net-effective-residential", name: "Net Effective Rent", description: "Residential rent with concessions", icon: DollarSign, component: NetEffectiveRentCalculator },
      { id: "rent-optimization", name: "Rent Optimization", description: "Optimize rental pricing and vacancy", icon: TrendingUp, component: RentOptimizationCalculator },
    ],
  },
  {
    id: "general",
    name: "General",
    icon: Calculator,
    description: "Universal calculators for all divisions",
    calculators: [
      { id: "commission", name: "Commission Calculator", description: "Calculate agent and house commission splits", icon: Users, component: CommissionCalculator },
      { id: "transfer-tax", name: "NYC Transfer Tax", description: "NYC/NYS transfer tax and mansion tax", icon: Receipt, component: TransferTaxCalculator },
    ],
  },
];

const Calculators = () => {
  const [activeCategory, setActiveCategory] = useState("investment-sales");
  const [activeCalculator, setActiveCalculator] = useState<string | null>(null);

  const currentCategory = calculatorCategories.find(c => c.id === activeCategory);
  const CurrentCalculatorComponent = activeCalculator
    ? currentCategory?.calculators.find(c => c.id === activeCalculator)?.component
    : null;

  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground mb-2">
            Calculator Suite
          </h1>
          <p className="text-muted-foreground font-light">
            Professional tools for deal analysis and client presentations
          </p>
        </div>

        {/* Back button when calculator is open */}
        {activeCalculator && (
          <button
            onClick={() => setActiveCalculator(null)}
            className="mb-6 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
          >
            ← Back to calculators
          </button>
        )}

        {/* Calculator View */}
        {activeCalculator && CurrentCalculatorComponent ? (
          <div className="glass-card p-6 md:p-8">
            <CurrentCalculatorComponent />
          </div>
        ) : (
          <>
            {/* Category Tabs */}
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
              <TabsList className="w-full justify-start bg-transparent border-b border-white/10 rounded-none h-auto p-0 mb-8 overflow-x-auto">
                {calculatorCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      className={cn(
                        "flex items-center gap-2 px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-foreground",
                        "text-muted-foreground data-[state=active]:text-foreground",
                        "bg-transparent data-[state=active]:bg-transparent",
                        "transition-all duration-200"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="whitespace-nowrap">{category.name}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {calculatorCategories.map((category) => (
                <TabsContent key={category.id} value={category.id} className="mt-0">
                  <p className="text-muted-foreground mb-6">{category.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.calculators.map((calc) => {
                      const Icon = calc.icon;
                      return (
                        <button
                          key={calc.id}
                          onClick={() => setActiveCalculator(calc.id)}
                          className="glass-card p-6 text-left group"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                              <Icon className="h-6 w-6 text-foreground/70 group-hover:text-foreground transition-colors" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-light text-foreground mb-1">
                                {calc.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {calc.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default Calculators;
