import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, DollarSign, Receipt } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { CategorySelector } from "./CategorySelector";
import { ReceiptUpload } from "./ReceiptUpload";
import { MileageCalculator } from "./MileageCalculator";
import { useExpenseCategories } from "@/hooks/useExpenseCategories";
import { useCreateExpense, useUpdateExpense, type Expense, type ExpenseFormData } from "@/hooks/useExpenses";
import { useReceiptUpload } from "@/hooks/useReceiptUpload";
import { useCRMDeals } from "@/hooks/useCRM";
import { useDivision } from "@/contexts/DivisionContext";

const IRS_MILEAGE_RATE_2025 = 0.70;

const expenseFormSchema = z.object({
  expense_date: z.date({ message: "Date is required" })
    .refine((date) => date <= new Date(), "Date cannot be in the future"),
  amount: z.number({ message: "Amount is required" })
    .positive("Amount must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  description: z.string()
    .min(3, "Description must be at least 3 characters")
    .max(500, "Description must be less than 500 characters"),
  payment_method: z.string().optional(),
  is_tax_deductible: z.boolean().default(true),
  deal_id: z.string().optional(),
  billable_to_client: z.boolean().default(false),
  mileage_from: z.string().optional(),
  mileage_to: z.string().optional(),
  mileage_distance: z.number().optional(),
  notes: z.string().max(1000).optional(),
});

type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

interface AddExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense?: Expense | null;
}

const PAYMENT_METHODS = [
  { value: "company_card", label: "Company Card" },
  { value: "personal_card", label: "Personal Card" },
  { value: "cash", label: "Cash" },
  { value: "check", label: "Check" },
  { value: "other", label: "Other" },
];

export const AddExpenseModal = ({ open, onOpenChange, expense }: AddExpenseModalProps) => {
  const { division } = useDivision();
  const { data: categories = [] } = useExpenseCategories();
  const { data: deals = [] } = useCRMDeals(division);
  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();
  const { uploadReceipt, isUploading, progress } = useReceiptUpload();

  const [receipt, setReceipt] = useState<{ url: string; filename: string; path: string } | null>(null);
  const [showMileage, setShowMileage] = useState(false);

  const isEditing = !!expense;

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      expense_date: new Date(),
      amount: 0,
      category: "",
      subcategory: "",
      description: "",
      payment_method: "",
      is_tax_deductible: true,
      deal_id: "",
      billable_to_client: false,
      mileage_from: "",
      mileage_to: "",
      mileage_distance: undefined,
      notes: "",
    },
  });

  // Watch category changes to show/hide mileage calculator
  const selectedCategory = form.watch("category");
  const selectedSubcategory = form.watch("subcategory");

  useEffect(() => {
    const isMileage = 
      selectedCategory === "Transportation & Mileage" && 
      selectedSubcategory?.toLowerCase().includes("mileage");
    setShowMileage(isMileage);
  }, [selectedCategory, selectedSubcategory]);

  // Reset form when modal opens/closes or expense changes
  useEffect(() => {
    if (open) {
      if (expense) {
        form.reset({
          expense_date: new Date(expense.expense_date),
          amount: expense.amount,
          category: expense.category,
          subcategory: expense.subcategory || "",
          description: expense.description,
          payment_method: expense.payment_method || "",
          is_tax_deductible: expense.is_tax_deductible,
          deal_id: expense.deal_id || "",
          billable_to_client: expense.billable_to_client,
          mileage_from: expense.mileage_from || "",
          mileage_to: expense.mileage_to || "",
          mileage_distance: expense.mileage_distance || undefined,
          notes: expense.notes || "",
        });
        if (expense.receipt_url && expense.receipt_filename) {
          setReceipt({
            url: expense.receipt_url,
            filename: expense.receipt_filename,
            path: expense.receipt_url,
          });
        }
      } else {
        form.reset({
          expense_date: new Date(),
          amount: 0,
          category: "",
          subcategory: "",
          description: "",
          payment_method: "",
          is_tax_deductible: true,
          deal_id: "",
          billable_to_client: false,
          mileage_from: "",
          mileage_to: "",
          mileage_distance: undefined,
          notes: "",
        });
        setReceipt(null);
      }
    }
  }, [open, expense, form]);

  // Get subcategories for selected category
  const subcategories = categories.find((c) => c.name === selectedCategory)?.subcategories || [];

  const handleMileageAmountChange = useCallback((amount: number) => {
    form.setValue("amount", amount);
  }, [form]);

  const handleUpload = async (file: File) => {
    const result = await uploadReceipt(file);
    return result;
  };

  const onSubmit = async (values: ExpenseFormValues) => {
    try {
      const formData: ExpenseFormData = {
        expense_date: format(values.expense_date, "yyyy-MM-dd"),
        amount: values.amount,
        category: values.category,
        subcategory: values.subcategory,
        description: values.description,
        payment_method: values.payment_method || undefined,
        is_tax_deductible: values.is_tax_deductible,
        deal_id: values.deal_id || undefined,
        billable_to_client: values.billable_to_client,
        mileage_from: values.mileage_from || undefined,
        mileage_to: values.mileage_to || undefined,
        mileage_distance: values.mileage_distance,
        mileage_rate: showMileage ? IRS_MILEAGE_RATE_2025 : undefined,
        notes: values.notes || undefined,
        receipt_url: receipt?.url,
        receipt_filename: receipt?.filename,
      };

      if (isEditing && expense) {
        await updateExpense.mutateAsync({ id: expense.id, data: formData });
        toast.success("Expense updated successfully");
      } else {
        await createExpense.mutateAsync(formData);
        toast.success("Expense added successfully");
      }

      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to save expense");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            {isEditing ? "Edit Expense" : "Add Expense"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Date and Amount Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expense_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : "Pick a date"}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          className="pl-9"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          disabled={showMileage}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Category and Subcategory */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <CategorySelector
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        form.setValue("subcategory", "");
                      }}
                      subcategoryValue={form.watch("subcategory")}
                      onSubcategoryChange={(v) => form.setValue("subcategory", v)}
                      showSubcategory={false}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {subcategories.length > 0 && (
                <FormField
                  control={form.control}
                  name="subcategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subcategory</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subcategory" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subcategories.map((sub) => (
                            <SelectItem key={sub} value={sub}>
                              {sub}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Mileage Calculator (conditional) */}
            {showMileage && (
              <MileageCalculator
                fromAddress={form.watch("mileage_from") || ""}
                toAddress={form.watch("mileage_to") || ""}
                distance={form.watch("mileage_distance")}
                onFromAddressChange={(v) => form.setValue("mileage_from", v)}
                onToAddressChange={(v) => form.setValue("mileage_to", v)}
                onDistanceChange={(v) => form.setValue("mileage_distance", v)}
                onAmountChange={handleMileageAmountChange}
              />
            )}

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What was this expense for?"
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Payment Method and Deal Association */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="payment_method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PAYMENT_METHODS.map((method) => (
                          <SelectItem key={method.value} value={method.value}>
                            {method.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deal_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Related Deal</FormLabel>
                    <Select 
                      value={field.value || "__none__"} 
                      onValueChange={(v) => field.onChange(v === "__none__" ? "" : v)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="None" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="__none__">None</SelectItem>
                        {deals.map((deal) => (
                          <SelectItem key={deal.id} value={deal.id}>
                            {deal.property_address}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap gap-6">
              <FormField
                control={form.control}
                name="is_tax_deductible"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-0.5">
                      <FormLabel className="cursor-pointer">Tax Deductible</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="billable_to_client"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-0.5">
                      <FormLabel className="cursor-pointer">Billable to Client</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Receipt Upload */}
            <div className="space-y-2">
              <FormLabel>Receipt</FormLabel>
              <ReceiptUpload
                value={receipt}
                onChange={setReceipt}
                onUpload={handleUpload}
                isUploading={isUploading}
                progress={progress}
              />
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional notes (optional)"
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createExpense.isPending || updateExpense.isPending}
              >
                {createExpense.isPending || updateExpense.isPending
                  ? "Saving..."
                  : isEditing
                  ? "Update Expense"
                  : "Add Expense"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
