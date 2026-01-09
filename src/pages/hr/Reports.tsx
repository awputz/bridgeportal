import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  FileSpreadsheet,
  Users,
  UserCheck,
  TrendingUp,
  FileSignature,
  ClipboardCheck,
  Shield,
  Download,
  Calendar,
} from "lucide-react";
import { useHRAgents } from "@/hooks/hr/useHRAgents.tsx";
import { useContracts } from "@/hooks/hr/useContracts";
import { useActiveAgents } from "@/hooks/hr/useActiveAgents";
import { useProductionSummary } from "@/hooks/hr/useAgentProduction";
import { useHROffers } from "@/hooks/hr/useHROffers";
import { exportToCSV } from "@/lib/csvExport";
import { exportToExcel } from "@/lib/excelExport";
import {
  hrAgentColumns,
  hrContractColumns,
  activeAgentColumns,
  productionColumns,
  hrOfferColumns,
  hrAgentExcelColumns,
  activeAgentExcelColumns,
  productionExcelColumns,
} from "@/lib/hrExportColumns";
import { toast } from "sonner";

type DateRange = "ytd" | "last-12" | "all";
type ExportFormat = "csv" | "excel";

interface ReportCard {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  dataKey: string;
}

const reportCards: ReportCard[] = [
  {
    id: "agents",
    title: "Agent Database",
    description: "All candidates with recruitment status and contact info",
    icon: Users,
    color: "text-blue-400",
    dataKey: "agents",
  },
  {
    id: "contracts",
    title: "Contract Summary",
    description: "All contracts with status, terms, and signature dates",
    icon: FileSignature,
    color: "text-purple-400",
    dataKey: "contracts",
  },
  {
    id: "active-agents",
    title: "Active Agents",
    description: "Current employees with onboarding and production data",
    icon: UserCheck,
    color: "text-emerald-400",
    dataKey: "activeAgents",
  },
  {
    id: "production",
    title: "Production Performance",
    description: "Detailed production metrics and deal history",
    icon: TrendingUp,
    color: "text-amber-400",
    dataKey: "production",
  },
  {
    id: "offers",
    title: "Offer Analytics",
    description: "Offer history, acceptance rates, and bonuses",
    icon: ClipboardCheck,
    color: "text-cyan-400",
    dataKey: "offers",
  },
];

export default function HRReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange>("all");
  const [division, setDivision] = useState<string>("all");

  // Fetch all data
  const { data: agents, isLoading: loadingAgents } = useHRAgents();
  const { data: contracts, isLoading: loadingContracts } = useContracts();
  const { data: activeAgents, isLoading: loadingActiveAgents } = useActiveAgents();
  const { data: production, isLoading: loadingProduction } = useProductionSummary();
  const { data: offers, isLoading: loadingOffers } = useHROffers();

  const isLoading = loadingAgents || loadingContracts || loadingActiveAgents || loadingProduction || loadingOffers;

  const getRecordCount = (dataKey: string): number => {
    switch (dataKey) {
      case "agents": return agents?.length || 0;
      case "contracts": return contracts?.length || 0;
      case "activeAgents": return activeAgents?.length || 0;
      case "production": return production?.length || 0;
      case "offers": return offers?.length || 0;
      default: return 0;
    }
  };

  const handleExport = (reportId: string, format: ExportFormat) => {
    const timestamp = new Date().toISOString().split("T")[0];
    
    try {
      switch (reportId) {
        case "agents":
          if (!agents?.length) return toast.error("No agent data to export");
          if (format === "csv") {
            exportToCSV(agents, hrAgentColumns, `hr-agents-${timestamp}`);
          } else {
            exportToExcel(agents, hrAgentExcelColumns, `hr-agents-${timestamp}`, "Agents");
          }
          break;
        case "contracts":
          if (!contracts?.length) return toast.error("No contract data to export");
          if (format === "csv") {
            exportToCSV(contracts, hrContractColumns, `hr-contracts-${timestamp}`);
          } else {
            exportToExcel(contracts, hrContractColumns.map(c => ({ ...c, type: 'string' as const })), `hr-contracts-${timestamp}`, "Contracts");
          }
          break;
        case "active-agents":
          if (!activeAgents?.length) return toast.error("No active agent data to export");
          if (format === "csv") {
            exportToCSV(activeAgents, activeAgentColumns, `active-agents-${timestamp}`);
          } else {
            exportToExcel(activeAgents, activeAgentExcelColumns, `active-agents-${timestamp}`, "Active Agents");
          }
          break;
        case "production":
          if (!production?.length) return toast.error("No production data to export");
          if (format === "csv") {
            exportToCSV(production, productionColumns, `production-report-${timestamp}`);
          } else {
            exportToExcel(production, productionExcelColumns, `production-report-${timestamp}`, "Production");
          }
          break;
        case "offers":
          if (!offers?.length) return toast.error("No offer data to export");
          if (format === "csv") {
            exportToCSV(offers, hrOfferColumns, `hr-offers-${timestamp}`);
          } else {
            exportToExcel(offers, hrOfferColumns.map(c => ({ ...c, type: 'string' as const })), `hr-offers-${timestamp}`, "Offers");
          }
          break;
      }
      toast.success(`Report exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export report");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-light tracking-tight">HR Reports</h1>
          <p className="text-sm text-muted-foreground">
            Export and download HR data in CSV or Excel format
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
            <SelectTrigger className="w-[150px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ytd">Year to Date</SelectItem>
              <SelectItem value="last-12">Last 12 Months</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>

          <Select value={division} onValueChange={setDivision}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Divisions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Divisions</SelectItem>
              <SelectItem value="investment-sales">Investment Sales</SelectItem>
              <SelectItem value="commercial-leasing">Commercial Leasing</SelectItem>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="capital-advisory">Capital Advisory</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Report Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reportCards.map((report) => {
          const Icon = report.icon;
          const count = getRecordCount(report.dataKey);

          return (
            <Card key={report.id} className="group hover:border-emerald-500/30 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg bg-background border ${report.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  {isLoading ? (
                    <Skeleton className="h-5 w-16" />
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {count} records
                    </span>
                  )}
                </div>
                <CardTitle className="text-base font-medium mt-3">
                  {report.title}
                </CardTitle>
                <CardDescription className="text-xs">
                  {report.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => handleExport(report.id, "csv")}
                    disabled={isLoading || count === 0}
                  >
                    <FileText className="h-4 w-4" />
                    CSV
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => handleExport(report.id, "excel")}
                    disabled={isLoading || count === 0}
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    Excel
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Export Summary</CardTitle>
          <CardDescription>Total records available for export</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: "Candidates", count: agents?.length || 0, loading: loadingAgents },
              { label: "Contracts", count: contracts?.length || 0, loading: loadingContracts },
              { label: "Active Agents", count: activeAgents?.length || 0, loading: loadingActiveAgents },
              { label: "Production Records", count: production?.length || 0, loading: loadingProduction },
              { label: "Offers", count: offers?.length || 0, loading: loadingOffers },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-3 bg-muted/30 rounded-lg">
                {stat.loading ? (
                  <Skeleton className="h-8 w-12 mx-auto mb-1" />
                ) : (
                  <p className="text-2xl font-semibold">{stat.count}</p>
                )}
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
