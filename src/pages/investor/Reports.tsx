import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useInvestorTransactions, useInvestorAgentPerformance, useDivisionBreakdown } from "@/hooks/useInvestorData";
import { Download, FileText, Calendar, Building2, Users, DollarSign, FileSpreadsheet } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { exportToExcel, ExcelColumn } from "@/lib/excelExport";

const YEARS = ["2025", "2024", "2023", "2022", "2021"];

type ExportFormat = "csv" | "excel";

const Reports = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("csv");

  const { data: transactions } = useInvestorTransactions();
  const { data: agentPerformance } = useInvestorAgentPerformance();
  const { data: divisionData } = useDivisionBreakdown();

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  const downloadCSV = (filename: string, headers: string[], rows: string[][]) => {
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = async (reportType: string) => {
    setIsExporting(reportType);

    try {
      const timestamp = format(new Date(), "yyyy-MM-dd");
      const isExcel = exportFormat === "excel";

      switch (reportType) {
        case "transactions": {
          if (!transactions) throw new Error("No transaction data");
          const yearTransactions = transactions.filter(t => 
            t.closing_date && new Date(t.closing_date).getFullYear().toString() === selectedYear
          );
          
          if (isExcel) {
            const columns: ExcelColumn<typeof yearTransactions[0]>[] = [
              { key: "property_address", header: "Property Address" },
              { key: "borough", header: "Borough" },
              { key: "division", header: "Division" },
              { key: "deal_type", header: "Deal Type" },
              { key: "agent_name", header: "Agent" },
              { key: "sale_price", header: "Sale Price", type: "number" },
              { key: "commission", header: "Commission", type: "number" },
              { key: "closing_date", header: "Closing Date" },
            ];
            exportToExcel(yearTransactions, columns, `transactions-${selectedYear}-${timestamp}`, "Transactions");
          } else {
            downloadCSV(
              `transactions-${selectedYear}-${timestamp}.csv`,
              ["Property Address", "Borough", "Division", "Deal Type", "Agent", "Sale Price", "Commission", "Closing Date"],
              yearTransactions.map(t => [
                t.property_address,
                t.borough || "",
                t.division || "",
                t.deal_type || "",
                t.agent_name || "",
                t.sale_price?.toString() || "",
                t.commission?.toString() || "",
                t.closing_date || "",
              ])
            );
          }
          break;
        }

        case "performance": {
          if (!agentPerformance) throw new Error("No agent data");
          
          if (isExcel) {
            const columns: ExcelColumn<typeof agentPerformance[0]>[] = [
              { key: "name", header: "Agent Name" },
              { key: "deals", header: "Total Deals", type: "number" },
              { key: "volume", header: "Total Volume", type: "number" },
              { key: "commission", header: "Total Commission", type: "number" },
              { key: "avgDealSize", header: "Avg Deal Size", type: "number" },
              { key: "divisions", header: "Divisions", formatter: (v) => v?.join("; ") || "" },
            ];
            exportToExcel(agentPerformance, columns, `agent-performance-${timestamp}`, "Agent Performance");
          } else {
            downloadCSV(
              `agent-performance-${timestamp}.csv`,
              ["Agent Name", "Total Deals", "Total Volume", "Total Commission", "Avg Deal Size", "Divisions"],
              agentPerformance.map(a => [
                a.name,
                a.deals.toString(),
                a.volume.toString(),
                a.commission.toString(),
                a.avgDealSize.toString(),
                a.divisions.join("; "),
              ])
            );
          }
          break;
        }

        case "divisions": {
          if (!divisionData) throw new Error("No division data");
          
          if (isExcel) {
            const columns: ExcelColumn<typeof divisionData[0]>[] = [
              { key: "name", header: "Division" },
              { key: "volume", header: "Total Volume", type: "number" },
              { key: "count", header: "Deal Count", type: "number" },
              { key: "commission", header: "Total Commission", type: "number" },
            ];
            exportToExcel(divisionData, columns, `division-breakdown-${timestamp}`, "Division Breakdown");
          } else {
            downloadCSV(
              `division-breakdown-${timestamp}.csv`,
              ["Division", "Total Volume", "Deal Count", "Total Commission"],
              divisionData.map(d => [
                d.name,
                d.volume.toString(),
                d.count.toString(),
                d.commission.toString(),
              ])
            );
          }
          break;
        }

        case "summary": {
          const summaryTransactions = transactions?.filter(t => 
            t.closing_date && new Date(t.closing_date).getFullYear().toString() === selectedYear
          ) || [];
          const totalVolume = summaryTransactions.reduce((sum, t) => sum + (t.sale_price || 0), 0);
          const totalCommission = summaryTransactions.reduce((sum, t) => sum + (t.commission || 0), 0);
          
          const summaryData = [
            { metric: "Year", value: selectedYear },
            { metric: "Total Transactions", value: summaryTransactions.length.toString() },
            { metric: "Total Volume", value: formatCurrency(totalVolume) },
            { metric: "Total Commission", value: formatCurrency(totalCommission) },
            { metric: "Average Deal Size", value: formatCurrency(totalVolume / (summaryTransactions.length || 1)) },
            { metric: "Active Agents", value: (agentPerformance?.length || 0).toString() },
          ];
          
          if (isExcel) {
            const columns: ExcelColumn<typeof summaryData[0]>[] = [
              { key: "metric", header: "Metric" },
              { key: "value", header: "Value" },
            ];
            exportToExcel(summaryData, columns, `annual-summary-${selectedYear}-${timestamp}`, "Annual Summary");
          } else {
            downloadCSV(
              `annual-summary-${selectedYear}-${timestamp}.csv`,
              ["Metric", "Value"],
              summaryData.map(s => [s.metric, s.value])
            );
          }
          break;
        }
      }

      toast({ title: `Report exported as ${isExcel ? 'Excel' : 'CSV'}` });
    } catch (error) {
      toast({ title: "Export failed", description: "Please try again", variant: "destructive" });
    } finally {
      setIsExporting(null);
    }
  };

  const reports = [
    {
      id: "transactions",
      title: "Transaction Report",
      description: "Detailed list of all closed transactions with property details, agents, and financial data.",
      icon: Building2,
      hasYearFilter: true,
    },
    {
      id: "performance",
      title: "Agent Performance Report",
      description: "Agent leaderboard with deal counts, volume, commissions, and average deal sizes.",
      icon: Users,
      hasYearFilter: false,
    },
    {
      id: "divisions",
      title: "Division Breakdown Report",
      description: "Volume, deal count, and commission totals organized by business division.",
      icon: FileText,
      hasYearFilter: false,
    },
    {
      id: "summary",
      title: "Annual Summary Report",
      description: "High-level overview of key metrics for the selected year.",
      icon: DollarSign,
      hasYearFilter: true,
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-light text-foreground">Reports & Exports</h1>
        <p className="text-muted-foreground mt-1">Download detailed reports in CSV format</p>
      </div>

      {/* Year Filter & Format Toggle */}
      <Card className="border-border/50">
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Calendar className="h-5 w-5 text-sky-400" />
            <span className="text-sm text-muted-foreground">Select year:</span>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((year) => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-4 sm:ml-auto">
            <span className="text-sm text-muted-foreground">Format:</span>
            <ToggleGroup type="single" value={exportFormat} onValueChange={(v) => v && setExportFormat(v as ExportFormat)}>
              <ToggleGroupItem value="csv" aria-label="Export as CSV" className="gap-1.5">
                <FileText className="h-4 w-4" />
                CSV
              </ToggleGroupItem>
              <ToggleGroupItem value="excel" aria-label="Export as Excel" className="gap-1.5">
                <FileSpreadsheet className="h-4 w-4" />
                Excel
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </CardContent>
      </Card>

      {/* Report Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <Card key={report.id} className="border-border/50 hover:border-sky-400/30 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-sky-400/10">
                      <Icon className="h-5 w-5 text-sky-400" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-medium">{report.title}</CardTitle>
                      {report.hasYearFilter && (
                        <span className="text-xs text-sky-400">{selectedYear} data</span>
                      )}
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-2">{report.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => handleExport(report.id)}
                  disabled={isExporting === report.id}
                  variant="outline"
                  className="w-full gap-2"
                >
                  {isExporting === report.id ? (
                    <span>Exporting...</span>
                  ) : (
                    <>
                      {exportFormat === "excel" ? <FileSpreadsheet className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                      Download {exportFormat === "excel" ? "Excel" : "CSV"}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info Notice */}
      <Card className="bg-sky-400/5 border-sky-400/20">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground text-center">
            All reports are generated from live data and exported as CSV files for use in Excel, Google Sheets, or other spreadsheet applications.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
