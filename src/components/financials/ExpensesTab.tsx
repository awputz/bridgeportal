import { useState } from "react";
import { Plus, Search, Filter, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useExpenses, type ExpenseFilters, type Expense } from "@/hooks/useExpenses";
import { useExpenseCategories } from "@/hooks/useExpenseCategories";
import { ExpenseCard } from "./ExpenseCard";
import { format } from "date-fns";

interface ExpensesTabProps {
  onAddExpense?: () => void;
  onEditExpense?: (expense: Expense) => void;
  onDeleteExpense?: (expense: Expense) => void;
  onViewReceipt?: (expense: Expense) => void;
}

export const ExpensesTab = ({
  onAddExpense,
  onEditExpense,
  onDeleteExpense,
  onViewReceipt,
}: ExpensesTabProps) => {
  const [filters, setFilters] = useState<ExpenseFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const { data: expenses = [], isLoading } = useExpenses(filters);
  const { data: categories = [] } = useExpenseCategories();

  // Group expenses by month
  const expensesByMonth = expenses.reduce<Record<string, Expense[]>>((acc, expense) => {
    const monthKey = format(new Date(expense.expense_date), "MMMM yyyy");
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(expense);
    return acc;
  }, {});

  const getCategoryMeta = (categoryName: string) => {
    const cat = categories.find((c) => c.name === categoryName);
    return {
      icon: cat?.icon || "Receipt",
      color: cat?.color || "bg-gray-500",
    };
  };

  // Calculate monthly total
  const currentMonthTotal = expenses
    .filter((e) => {
      const date = new Date(e.expense_date);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    })
    .reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-lg font-light text-foreground">Expenses</h3>
          <p className="text-sm text-muted-foreground">
            {format(new Date(), "MMMM yyyy")}: ${currentMonthTotal.toLocaleString()}
          </p>
        </div>
        <Button onClick={onAddExpense} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Expense
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search expenses..."
            className="pl-9"
            value={filters.search || ""}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <Select
          value={filters.category || "all"}
          onValueChange={(v) => setFilters({ ...filters, category: v === "all" ? undefined : v })}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.name}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className={showFilters ? "bg-muted" : ""}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Extended Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-lg">
          <Select
            value={filters.paymentMethod || "all"}
            onValueChange={(v) => setFilters({ ...filters, paymentMethod: v === "all" ? undefined : v })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Payment Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="company_card">Company Card</SelectItem>
              <SelectItem value="personal_card">Personal Card</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="check">Check</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="date"
            placeholder="From"
            className="w-[160px]"
            value={filters.dateFrom || ""}
            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
          />
          <Input
            type="date"
            placeholder="To"
            className="w-[160px]"
            value={filters.dateTo || ""}
            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilters({})}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Expense List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : expenses.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
            <Receipt className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-1">No expenses yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Start tracking your business expenses for tax purposes
          </p>
          <Button onClick={onAddExpense} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Your First Expense
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(expensesByMonth).map(([month, monthExpenses]) => (
            <div key={month}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-muted-foreground">{month}</h4>
                <span className="text-xs text-muted-foreground">
                  ${monthExpenses.reduce((sum, e) => sum + Number(e.amount), 0).toLocaleString()}
                </span>
              </div>
              <div className="space-y-2">
                {monthExpenses.map((expense) => {
                  const { icon, color } = getCategoryMeta(expense.category);
                  return (
                    <ExpenseCard
                      key={expense.id}
                      expense={expense}
                      categoryIcon={icon}
                      categoryColor={color}
                      onEdit={onEditExpense}
                      onDelete={onDeleteExpense}
                      onViewReceipt={onViewReceipt}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
