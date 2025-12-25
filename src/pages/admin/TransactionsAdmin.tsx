import { useState, useMemo } from "react";
import { Pencil, Trash2, Plus, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useTransactions, Transaction } from "@/hooks/useTransactions";
import { useDeleteTransaction } from "@/hooks/useTransactionMutations";
import { TransactionFormDialog } from "@/components/admin/TransactionFormDialog";
import { DataTablePagination } from "@/components/admin/DataTablePagination";
import { usePagination } from "@/hooks/usePagination";

type SortDirection = "asc" | "desc" | null;

export default function TransactionsAdmin() {
  const { data: transactions = [], isLoading } = useTransactions();
  const deleteMutation = useDeleteTransaction();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>();
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  
  // Sorting state
  const [sortKey, setSortKey] = useState<string | null>("closing_date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortKey(null);
        setSortDirection(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions.filter((transaction) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        transaction.agent_name.toLowerCase().includes(searchLower) ||
        transaction.property_address.toLowerCase().includes(searchLower) ||
        transaction.borough?.toLowerCase().includes(searchLower) ||
        transaction.deal_type.toLowerCase().includes(searchLower) ||
        transaction.division?.toLowerCase().includes(searchLower)
      );
    });

    if (sortKey && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any = a[sortKey as keyof Transaction];
        let bValue: any = b[sortKey as keyof Transaction];

        // Handle value sorting specially
        if (sortKey === "value") {
          aValue = a.deal_type === "Sale" || a.deal_type === "Loan" ? a.sale_price : a.total_lease_value;
          bValue = b.deal_type === "Sale" || b.deal_type === "Loan" ? b.sale_price : b.total_lease_value;
        }

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        let comparison = 0;
        if (typeof aValue === "number" && typeof bValue === "number") {
          comparison = aValue - bValue;
        } else if (typeof aValue === "string" && typeof bValue === "string") {
          comparison = aValue.localeCompare(bValue);
        } else {
          comparison = String(aValue).localeCompare(String(bValue));
        }

        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return filtered;
  }, [transactions, searchQuery, sortKey, sortDirection]);

  const {
    paginatedData,
    currentPage,
    totalPages,
    pageSize,
    totalItems,
    handlePageChange,
    handlePageSizeChange,
  } = usePagination(filteredAndSortedTransactions, 10);

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedTransaction(undefined);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setTransactionToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (transactionToDelete) {
      await deleteMutation.mutateAsync(transactionToDelete);
      setIsDeleteDialogOpen(false);
      setTransactionToDelete(null);
    }
  };

  const formatCurrency = (value: number | null) => {
    if (!value) return "—";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date: string | null) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRoleBadge = (role: string | null) => {
    if (!role) return null;
    const labels: Record<string, string> = {
      seller_representation: "Seller Rep",
      buyer_representation: "Buyer Rep",
      landlord_representation: "Landlord Rep",
      tenant_representation: "Tenant Rep",
      broker: "Broker",
      advisor: "Advisor",
    };
    return labels[role] || role;
  };

  const SortHeader = ({ 
    children, 
    sortKeyName 
  }: { 
    children: React.ReactNode; 
    sortKeyName: string;
  }) => (
    <TableHead 
      className="cursor-pointer select-none hover:bg-muted/50"
      onClick={() => handleSort(sortKeyName)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortKey === sortKeyName && sortDirection === "asc" ? (
          <ArrowUp className="h-4 w-4" />
        ) : sortKey === sortKeyName && sortDirection === "desc" ? (
          <ArrowDown className="h-4 w-4" />
        ) : (
          <ArrowUpDown className="h-4 w-4 opacity-50" />
        )}
      </div>
    </TableHead>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Closed Deals</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage transaction history
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Deal
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Search by agent, address, or borough..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <SortHeader sortKeyName="closing_date">Date</SortHeader>
              <SortHeader sortKeyName="agent_name">Agent</SortHeader>
              <SortHeader sortKeyName="division">Division</SortHeader>
              <SortHeader sortKeyName="deal_type">Type</SortHeader>
              <SortHeader sortKeyName="property_address">Address</SortHeader>
              <SortHeader sortKeyName="borough">Borough</SortHeader>
              <SortHeader sortKeyName="value">Value</SortHeader>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  Loading transactions...
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  {searchQuery ? "No transactions found matching your search" : "No transactions yet"}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="whitespace-nowrap">
                    {formatDate(transaction.closing_date)}
                  </TableCell>
                  <TableCell className="font-medium">{transaction.agent_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {transaction.division || "—"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={transaction.deal_type === "Sale" ? "default" : transaction.deal_type === "Loan" ? "secondary" : "outline"}>
                      {transaction.deal_type}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {transaction.property_address}
                  </TableCell>
                  <TableCell>{transaction.borough || "—"}</TableCell>
                  <TableCell className="font-medium">
                    {transaction.deal_type === "Sale" || transaction.deal_type === "Loan"
                      ? formatCurrency(transaction.sale_price)
                      : formatCurrency(transaction.total_lease_value)}
                  </TableCell>
                  <TableCell>
                    {transaction.role && (
                      <Badge variant="outline">{getRoleBadge(transaction.role)}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(transaction)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(transaction.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        {totalItems > 0 && (
          <DataTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </div>

      <TransactionFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        transaction={selectedTransaction}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this transaction? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
