import { useState } from "react";
import { format } from "date-fns";
import { Receipt, DollarSign, Users, FileCheck, Download, Eye, Search, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAgentExpenseSummary,
  useAllAgentExpenses,
  useAdminExpenseStats,
  type ExpenseWithAgent,
} from "@/hooks/useExpensesAdmin";
import { useReceiptUpload } from "@/hooks/useReceiptUpload";
import { exportExpensesToCSV, generateTaxSummary } from "@/lib/expenseExport";
import { toast } from "@/hooks/use-toast";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function AgentExpensesAdmin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedAgent, setSelectedAgent] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);
  const [viewingReceipt, setViewingReceipt] = useState<ExpenseWithAgent | null>(null);

  const { data: summaries, isLoading: summariesLoading } = useAgentExpenseSummary();
  const { data: allExpenses, isLoading: expensesLoading } = useAllAgentExpenses();
  const stats = useAdminExpenseStats();
  const { getSignedUrl } = useReceiptUpload();

  // Filter summaries
  const filteredSummaries = summaries?.filter((s) => {
    const matchesSearch =
      s.agent_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.agent_email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Get unique categories for filter
  const categories = [...new Set(allExpenses?.map((e) => e.category) || [])];

  // Get expenses for selected agent
  const agentExpenses = allExpenses?.filter((e) => e.agent_id === selectedAgent?.id) || [];
  const filteredAgentExpenses =
    selectedCategory === "all"
      ? agentExpenses
      : agentExpenses.filter((e) => e.category === selectedCategory);

  const handleViewReceipt = async (expense: ExpenseWithAgent) => {
    if (!expense.receipt_url) return;
    try {
      const signedUrl = await getSignedUrl(expense.receipt_url);
      if (signedUrl) {
        window.open(signedUrl, "_blank");
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to load receipt",
        variant: "destructive",
      });
    }
  };

  const handleExportAgent = (agentId: string, agentName: string) => {
    const expenses = allExpenses?.filter((e) => e.agent_id === agentId) || [];
    exportExpensesToCSV(expenses, `expenses-${agentName.replace(/\s+/g, "-").toLowerCase()}.csv`);
    toast({
      title: "Export Complete",
      description: `Exported ${expenses.length} expenses for ${agentName}`,
    });
  };

  const handleExportAll = () => {
    if (!allExpenses?.length) return;
    exportExpensesToCSV(allExpenses, `all-agent-expenses-${format(new Date(), "yyyy-MM-dd")}.csv`);
    toast({
      title: "Export Complete",
      description: `Exported ${allExpenses.length} total expenses`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Agent Expenses</h1>
          <p className="text-muted-foreground">
            View and export expense reports for all agents
          </p>
        </div>
        <Button onClick={handleExportAll} disabled={!allExpenses?.length} className="gap-2">
          <Download className="h-4 w-4" />
          Export All
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total YTD Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{formatCurrency(stats.totalYTD)}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">{formatCurrency(stats.totalThisMonth)}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tax Deductible YTD
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{formatCurrency(stats.taxDeductibleYTD)}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Agents with Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-500" />
              <span className="text-2xl font-bold">{stats.uniqueAgents}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Expense Summary</CardTitle>
          <CardDescription>Click on an agent to view their detailed expenses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by agent name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Summary Table */}
          {summariesLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : !filteredSummaries?.length ? (
            <div className="text-center py-12 text-muted-foreground">
              <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No agent expenses found</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead className="text-right">Total Expenses</TableHead>
                    <TableHead className="text-right">This Month</TableHead>
                    <TableHead className="text-right">Tax Deductible</TableHead>
                    <TableHead className="text-right"># Expenses</TableHead>
                    <TableHead>Last Expense</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSummaries.map((summary) => (
                    <TableRow
                      key={summary.agent_id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() =>
                        setSelectedAgent({
                          id: summary.agent_id,
                          name: summary.agent_name,
                          email: summary.agent_email,
                        })
                      }
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{summary.agent_name}</p>
                          <p className="text-sm text-muted-foreground">{summary.agent_email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(summary.total_expenses)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(summary.this_month_expenses)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(summary.tax_deductible_total)}
                      </TableCell>
                      <TableCell className="text-right">{summary.expense_count}</TableCell>
                      <TableCell>
                        {summary.last_expense_date
                          ? format(new Date(summary.last_expense_date), "MMM d, yyyy")
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExportAgent(summary.agent_id, summary.agent_name);
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Agent Detail Dialog */}
      <Dialog open={!!selectedAgent} onOpenChange={() => setSelectedAgent(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div>
                <span>{selectedAgent?.name}'s Expenses</span>
                <p className="text-sm font-normal text-muted-foreground mt-1">
                  {selectedAgent?.email}
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col sm:flex-row gap-3 pb-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2 ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (selectedAgent) {
                    generateTaxSummary(agentExpenses, new Date().getFullYear(), {
                      name: selectedAgent.name,
                      email: selectedAgent.email,
                    });
                  }
                }}
              >
                Tax Summary
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (selectedAgent) {
                    handleExportAgent(selectedAgent.id, selectedAgent.name);
                  }
                }}
              >
                <Download className="h-4 w-4 mr-1" />
                CSV
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {expensesLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : !filteredAgentExpenses.length ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No expenses found</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Receipt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAgentExpenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell className="whitespace-nowrap">
                          {format(new Date(expense.expense_date), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <div>
                            <Badge variant="outline" className="text-xs">
                              {expense.category}
                            </Badge>
                            {expense.subcategory && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {expense.subcategory}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {expense.description}
                        </TableCell>
                        <TableCell className="text-right font-medium whitespace-nowrap">
                          {formatCurrency(expense.amount)}
                          {expense.is_tax_deductible && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              Tax
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {expense.receipt_url ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewReceipt(expense)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          ) : (
                            <span className="text-muted-foreground text-xs">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          {/* Totals Footer */}
          <div className="pt-4 border-t mt-4 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Showing {filteredAgentExpenses.length} expenses
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-xl font-bold">
                {formatCurrency(filteredAgentExpenses.reduce((sum, e) => sum + e.amount, 0))}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
