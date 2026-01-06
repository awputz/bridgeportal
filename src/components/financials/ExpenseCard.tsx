import { format } from "date-fns";
import { Camera, Car, Coffee, BookOpen, Building2, Scale, Laptop, Shield, Home, Pin, Receipt, Paperclip, MoreVertical, Trash2, Pencil, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatFullCurrency } from "@/lib/formatters";
import type { Expense } from "@/hooks/useExpenses";

const iconMap: Record<string, React.ElementType> = {
  Camera,
  Car,
  Coffee,
  BookOpen,
  Building2,
  Scale,
  Laptop,
  Shield,
  Home,
  Pin,
  Receipt,
};

// Map category colors to icon colors (explicit mapping for Tailwind)
const iconColorMap: Record<string, string> = {
  "bg-blue-500": "text-blue-400",
  "bg-emerald-500": "text-emerald-400",
  "bg-amber-500": "text-amber-400",
  "bg-purple-500": "text-purple-400",
  "bg-rose-500": "text-rose-400",
  "bg-cyan-500": "text-cyan-400",
  "bg-orange-500": "text-orange-400",
  "bg-green-500": "text-green-400",
  "bg-red-500": "text-red-400",
  "bg-indigo-500": "text-indigo-400",
  "bg-pink-500": "text-pink-400",
  "bg-gray-500": "text-gray-400",
};

interface ExpenseCardProps {
  expense: Expense;
  categoryIcon?: string;
  categoryColor?: string;
  onEdit?: (expense: Expense) => void;
  onDelete?: (expense: Expense) => void;
  onViewReceipt?: (expense: Expense) => void;
}

export const ExpenseCard = ({
  expense,
  categoryIcon = "Receipt",
  categoryColor = "bg-gray-500",
  onEdit,
  onDelete,
  onViewReceipt,
}: ExpenseCardProps) => {
  const IconComponent = iconMap[categoryIcon] || Receipt;
  const iconColor = iconColorMap[categoryColor] || "text-gray-400";

  return (
    <Card className="glass-card border-border/50 hover:border-border transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Category Icon */}
          <div className={`w-10 h-10 rounded-full ${categoryColor}/20 flex items-center justify-center flex-shrink-0`}>
            <IconComponent className={`h-5 w-5 ${iconColor}`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {expense.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {expense.category}
                  {expense.subcategory && ` • ${expense.subcategory}`}
                </p>
              </div>
              <p className="text-sm font-medium text-foreground whitespace-nowrap">
                {formatFullCurrency(expense.amount)}
              </p>
            </div>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-xs text-muted-foreground">
                {format(new Date(expense.expense_date), "MMM d, yyyy")}
              </span>
              
              {expense.payment_method && (
                <Badge variant="outline" className="text-xs py-0 px-1.5">
                  {expense.payment_method.replace(/_/g, " ")}
                </Badge>
              )}
              
              {expense.is_tax_deductible && (
                <Badge variant="secondary" className="text-xs py-0 px-1.5 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                  Tax Deductible
                </Badge>
              )}
              
              {expense.receipt_url && (
                <Badge variant="secondary" className="text-xs py-0 px-1.5 bg-blue-500/10 text-blue-400 border-blue-500/20 cursor-pointer" onClick={() => onViewReceipt?.(expense)}>
                  <Paperclip className="h-3 w-3 mr-1" />
                  Receipt
                </Badge>
              )}

              {expense.mileage_distance && (
                <Badge variant="secondary" className="text-xs py-0 px-1.5">
                  {expense.mileage_distance} mi
                </Badge>
              )}
            </div>
          </div>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(expense)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              {expense.receipt_url && (
                <DropdownMenuItem onClick={() => onViewReceipt?.(expense)}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Receipt
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={() => onDelete?.(expense)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};
