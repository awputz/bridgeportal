import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Calculator, TrendingUp, Building2, Home, DollarSign, Percent, BarChart3, PiggyBank, Receipt, Users, FileText, Landmark } from "lucide-react";
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
import { TransferTaxCalculator } from "@/components/calculators/TransferTaxCalculator";
import { RentAffordabilityCalculator } from "@/components/calculators/RentAffordabilityCalculator";
import { TICalculator } from "@/components/calculators/TICalculator";
import { InvestmentSalesCommissionCalculator } from "@/components/calculators/InvestmentSalesCommissionCalculator";
import { CommercialLeasingCommissionCalculator } from "@/components/calculators/CommercialLeasingCommissionCalculator";
import { ResidentialCommissionCalculator } from "@/components/calculators/ResidentialCommissionCalculator";
import { CapitalAdvisoryCommissionCalculator } from "@/components/calculators/CapitalAdvisoryCommissionCalculator";

const calculatorCategories = [
  {
    id: "commissions",
    name: "Commissions",
    icon: DollarSign,
    description: "Calculate your commission earnings by division",
    calculators: [
      { id: "is-commission", name: "Investment Sales Commission", description: "Calculate commissions for property sales", icon: TrendingUp, component: InvestmentSalesCommissionCalculator },
      { id: "cl-commission", name: "Commercial Leasing Commission", description: "Calculate commissions for commercial leases", icon: Building2, component: CommercialLeasingCommissionCalculator },
      { id: "res-commission", name: "Residential Commission", description: "Calculate commissions for rentals and sales", icon: Home, component: ResidentialCommissionCalculator },
      { id: "ca-commission", name: "Capital Advisory Commission", description: "Calculate commissions for debt/equity placements", icon: Landmark, component: CapitalAdvisoryCommissionCalculator },
    ],
  },
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
      { id: "transfer-tax", name: "NYC Transfer Tax", description: "NYC/NYS transfer tax and mansion tax", icon: Receipt, component: TransferTaxCalculator },
    ],
  },
];

const Calculators = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  
  // Initialize from URL param or default to commissions
  const [activeCategory, setActiveCategory] = useState(() => {
    const validCategory = calculatorCategories.find(c => c.id === tabParam);
    return validCategory ? tabParam! : "commissions";
  });
  const [activeCalculator, setActiveCalculator] = useState<string | null>(null);

  // Sync URL param changes to state
  useEffect(() => {
    if (tabParam) {
      const validCategory = calculatorCategories.find(c => c.id === tabParam);
      if (validCategory) {
        setActiveCategory(tabParam);
      }
    }
  }, [tabParam]);

  // Update URL when category changes
  const handleCategoryChange = (newCategory: string) => {
    setActiveCategory(newCategory);
    setSearchParams({ tab: newCategory });
  };

  const currentCategory = calculatorCategories.find(c => c.id === activeCategory);
  const CurrentCalculatorComponent = activeCalculator
    ? currentCategory?.calculators.find(c => c.id === activeCalculator)?.component
    : null;

  return (
    <div className="min-h-screen pb-24 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground mb-2">
            Calculator Suite
          </h1>
          <p className="text-muted-foreground font-light">
            Professional tools for deal analysis and commission calculations
          </p>
        </div>

        {/* Back button when calculator is open */}
        {activeCalculator && (
          <button
            onClick={() => setActiveCalculator(null)}
            className="mb-6 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 cursor-pointer"
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
            <Tabs value={activeCategory} onValueChange={handleCategoryChange} className="w-full">
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
                        "transition-all duration-200 cursor-pointer"
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
                          className="glass-card p-5 text-left group cursor-pointer hover:border-white/20 transition-all min-h-[100px]"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors flex-shrink-0">
                              <Icon className="h-5 w-5 text-foreground/70 group-hover:text-foreground transition-colors" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-light text-foreground mb-1">
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
