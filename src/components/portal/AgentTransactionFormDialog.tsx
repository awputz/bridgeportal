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
import { useUpdateTransaction } from "@/hooks/useTransactionMutations";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign } from "lucide-react";

const formSchema = z.object({
  division: z.enum(["Residential", "Commercial", "Investment Sales", "Capital Advisory"]),
  deal_type: z.enum(["Sale", "Lease", "Loan"]),
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
  commission: z.number().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface AgentTransactionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: any;
}

export function AgentTransactionFormDialog({
  open,
  onOpenChange,
  transaction,
}: AgentTransactionFormDialogProps) {
  const updateMutation = useUpdateTransaction();
  const [division, setDivision] = useState<"Residential" | "Commercial" | "Investment Sales" | "Capital Advisory">("Investment Sales");
  const [dealType, setDealType] = useState<"Sale" | "Lease" | "Loan">("Sale");
  const [agentName, setAgentName] = useState<string>("");

  // Get current user's name for new transactions
  useEffect(() => {
    const fetchAgentName = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();
        
        if (profile?.full_name) {
          setAgentName(profile.full_name);
        }
      }
    };
    fetchAgentName();
  }, []);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      division: "Investment Sales",
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
      const txDivision = (transaction.division || "Investment Sales") as "Residential" | "Commercial" | "Investment Sales" | "Capital Advisory";
      const txDealType = (transaction.deal_type || "Sale") as "Sale" | "Lease" | "Loan";
      
      form.reset({
        division: txDivision,
        deal_type: txDealType,
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
        commission: transaction.commission || undefined,
      });
      setDivision(txDivision);
      setDealType(txDealType);
      setAgentName(transaction.agent_name);
    } else {
      form.reset({
        division: "Investment Sales",
        deal_type: "Sale",
        property_address: "",
        borough: "",
        neighborhood: "",
        asset_type: "",
        closing_date: "",
        role: "",
        notes: "",
      });
      setDivision("Investment Sales");
      setDealType("Sale");
    }
  }, [transaction, open, form]);

  // Get available deal types based on division
  const getDealTypeOptions = () => {
    if (division === "Capital Advisory") {
      return [{ value: "Loan", label: "Loan / Financing" }];
    }
    if (division === "Residential") {
      return [
        { value: "Lease", label: "Lease" },
        { value: "Sale", label: "Sale" },
      ];
    }
    return [
      { value: "Sale", label: "Sale" },
      { value: "Lease", label: "Lease" },
    ];
  };

  // Get available role options based on division
  const getRoleOptions = () => {
    if (division === "Capital Advisory") {
      return [
        { value: "broker", label: "Broker" },
        { value: "advisor", label: "Advisor" },
      ];
    }
    if (dealType === "Lease") {
      return [
        { value: "landlord_representation", label: "Landlord Representation" },
        { value: "tenant_representation", label: "Tenant Representation" },
      ];
    }
    return [
      { value: "seller_representation", label: "Seller Representation" },
      { value: "buyer_representation", label: "Buyer Representation" },
    ];
  };

  const onSubmit = async (data: FormData) => {
    if (!transaction) return;

    const closingDate = data.closing_date ? new Date(data.closing_date) : null;
    const year = closingDate ? closingDate.getFullYear() : null;

    let pricePerUnit = null;
    let pricePerSf = null;
    let totalLeaseValue = null;

    if (data.deal_type === "Sale" || data.deal_type === "Loan") {
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
      commission: data.commission,
    };

    await updateMutation.mutateAsync({
      id: transaction.id,
      data: submitData,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Edit Transaction
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Agent Name (Read-only) */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Agent</label>
              <div className="p-3 bg-muted/50 rounded-md text-foreground">
                {agentName || "Loading..."}
              </div>
            </div>

            {/* Commission Field - Highlighted */}
            <div className="p-4 rounded-lg border-2 border-emerald-500/30 bg-emerald-500/5">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="h-5 w-5 text-emerald-400" />
                <h3 className="font-medium text-emerald-400">Commission</h3>
              </div>
              
              <FormField
                control={form.control}
                name="commission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Commission ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        placeholder="Enter your commission amount"
                        className="text-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-sm">Transaction Details</h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="division"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Division</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          const newDivision = value as "Residential" | "Commercial" | "Investment Sales" | "Capital Advisory";
                          setDivision(newDivision);
                          if (newDivision === "Capital Advisory") {
                            form.setValue("deal_type", "Loan");
                            setDealType("Loan");
                          } else if (newDivision === "Residential") {
                            form.setValue("deal_type", "Lease");
                            setDealType("Lease");
                          } else {
                            form.setValue("deal_type", "Sale");
                            setDealType("Sale");
                          }
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Residential">Residential</SelectItem>
                          <SelectItem value="Commercial">Commercial</SelectItem>
                          <SelectItem value="Investment Sales">Investment Sales</SelectItem>
                          <SelectItem value="Capital Advisory">Capital Advisory</SelectItem>
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
                      <FormLabel>Deal Type</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setDealType(value as "Sale" | "Lease" | "Loan");
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getDealTypeOptions().map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="property_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Address</FormLabel>
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

              {(dealType === "Sale" || dealType === "Loan") ? (
                <>
                  <FormField
                    control={form.control}
                    name="sale_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{dealType === "Loan" ? "Loan Amount" : "Sale Price"}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                            placeholder={dealType === "Loan" ? "26850000" : "5000000"}
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
                            placeholder="3500"
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
                            placeholder="12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Additional details..."
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
