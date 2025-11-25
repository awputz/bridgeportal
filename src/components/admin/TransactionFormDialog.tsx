import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCreateTransaction, useUpdateTransaction } from "@/hooks/useTransactionMutations";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import type { Transaction } from "@/hooks/useTransactions";

const formSchema = z.object({
  agent_name: z.string().min(1, "Agent name is required"),
  deal_type: z.enum(["Sale", "Lease"]),
  property_address: z.string().min(1, "Property address is required"),
  borough: z.string().optional(),
  neighborhood: z.string().optional(),
  asset_type: z.string().optional(),
  closing_date: z.string().optional(),
  sale_price: z.number().optional(),
  units: z.number().optional(),
  gross_square_feet: z.number().optional(),
  monthly_rent: z.number().optional(),
  lease_term_months: z.number().optional(),
  role: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface TransactionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction;
}

export function TransactionFormDialog({
  open,
  onOpenChange,
  transaction,
}: TransactionFormDialogProps) {
  const { data: teamMembers = [] } = useTeamMembers();
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const [dealType, setDealType] = useState<"Sale" | "Lease">("Sale");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agent_name: "",
      deal_type: "Sale",
      property_address: "",
      borough: "",
      neighborhood: "",
      asset_type: "",
      closing_date: "",
      role: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (transaction) {
      form.reset({
        agent_name: transaction.agent_name,
        deal_type: transaction.deal_type as "Sale" | "Lease",
        property_address: transaction.property_address,
        borough: transaction.borough || "",
        neighborhood: transaction.neighborhood || "",
        asset_type: transaction.asset_type || "",
        closing_date: transaction.closing_date || "",
        sale_price: transaction.sale_price || undefined,
        units: transaction.units || undefined,
        gross_square_feet: transaction.gross_square_feet || undefined,
        monthly_rent: transaction.monthly_rent || undefined,
        lease_term_months: transaction.lease_term_months || undefined,
        role: transaction.role || "",
        notes: transaction.notes || "",
      });
      setDealType(transaction.deal_type as "Sale" | "Lease");
    } else {
      form.reset({
        agent_name: "",
        deal_type: "Sale",
        property_address: "",
        borough: "",
        neighborhood: "",
        asset_type: "",
        closing_date: "",
        role: "",
        notes: "",
      });
      setDealType("Sale");
    }
  }, [transaction, open, form]);

  const onSubmit = async (data: FormData) => {
    const closingDate = data.closing_date ? new Date(data.closing_date) : null;
    const year = closingDate ? closingDate.getFullYear() : null;

    let pricePerUnit = null;
    let pricePerSf = null;
    let totalLeaseValue = null;

    if (data.deal_type === "Sale") {
      if (data.sale_price && data.units) {
        pricePerUnit = data.sale_price / data.units;
      }
      if (data.sale_price && data.gross_square_feet) {
        pricePerSf = data.sale_price / data.gross_square_feet;
      }
    } else if (data.deal_type === "Lease") {
      if (data.monthly_rent && data.lease_term_months) {
        totalLeaseValue = data.monthly_rent * data.lease_term_months;
      }
    }

    const submitData = {
      ...data,
      year,
      price_per_unit: pricePerUnit,
      price_per_sf: pricePerSf,
      total_lease_value: totalLeaseValue,
    };

    if (transaction) {
      await updateMutation.mutateAsync({
        id: transaction.id,
        data: submitData,
      });
    } else {
      await createMutation.mutateAsync(submitData);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {transaction ? "Edit Transaction" : "Add New Transaction"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium text-sm">Basic Information</h3>
              
              <FormField
                control={form.control}
                name="agent_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agent Name*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select agent" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teamMembers.map((member) => (
                          <SelectItem key={member.id} value={member.name}>
                            {member.name}
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
                name="deal_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deal Type*</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setDealType(value as "Sale" | "Lease");
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Sale">Sale</SelectItem>
                        <SelectItem value="Lease">Lease</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="property_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Address*</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="123 Main Street" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="borough"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Borough</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select borough" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Manhattan">Manhattan</SelectItem>
                          <SelectItem value="Brooklyn">Brooklyn</SelectItem>
                          <SelectItem value="Queens">Queens</SelectItem>
                          <SelectItem value="Bronx">Bronx</SelectItem>
                          <SelectItem value="Staten Island">Staten Island</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="neighborhood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Neighborhood</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Williamsburg" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-sm">Property Details</h3>

              <FormField
                control={form.control}
                name="asset_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Multifamily">Multifamily</SelectItem>
                        <SelectItem value="Mixed-Use">Mixed-Use</SelectItem>
                        <SelectItem value="Retail">Retail</SelectItem>
                        <SelectItem value="Office">Office</SelectItem>
                        <SelectItem value="Industrial">Industrial</SelectItem>
                        <SelectItem value="Land">Land</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="closing_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Closing Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-sm">Financial Details</h3>

              {dealType === "Sale" ? (
                <>
                  <FormField
                    control={form.control}
                    name="sale_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sale Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                            placeholder="5000000"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="units"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Units</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                              placeholder="10"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gross_square_feet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gross Square Feet</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                              placeholder="8000"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name="monthly_rent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monthly Rent</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                            placeholder="15000"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lease_term_months"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lease Term (months)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            placeholder="60"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-sm">Additional Information</h3>

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="seller_representation">Seller Representation</SelectItem>
                        <SelectItem value="buyer_representation">Buyer Representation</SelectItem>
                        <SelectItem value="landlord_representation">Landlord Representation</SelectItem>
                        <SelectItem value="tenant_representation">Tenant Representation</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} placeholder="Additional details..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {transaction ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
