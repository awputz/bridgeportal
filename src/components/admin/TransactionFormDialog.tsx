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
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCreateTransaction, useUpdateTransaction } from "@/hooks/useTransactionMutations";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { X, ImageIcon } from "lucide-react";
import type { Transaction } from "@/hooks/useTransactions";

const formSchema = z.object({
  agent_name: z.string().min(1, "Agent name is required"),
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
  const { toast } = useToast();
  const { data: teamMembers = [] } = useTeamMembers();
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const [division, setDivision] = useState<"Residential" | "Commercial" | "Investment Sales" | "Capital Advisory">("Investment Sales");
  const [dealType, setDealType] = useState<"Sale" | "Lease" | "Loan">("Sale");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agent_name: "",
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
        agent_name: transaction.agent_name,
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
      setImageUrl(transaction.image_url || null);
    } else {
      form.reset({
        agent_name: "",
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
      setImageUrl(null);
    }
  }, [transaction, open, form]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    setUploading(true);
    try {
      const { error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage
        .from("property-images")
        .getPublicUrl(fileName);

      setImageUrl(publicUrl.publicUrl);
      toast({ title: "Image uploaded successfully" });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImageUrl(null);
  };

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
      image_url: imageUrl,
      commission: data.commission,
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
            {/* Property Image */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm">Property Image</h3>
              
              {imageUrl ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border">
                  <img 
                    src={imageUrl} 
                    alt="Property" 
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 hover:bg-background transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col items-center justify-center py-4">
                    {uploading ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground" />
                    ) : (
                      <>
                        <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload property image</p>
                      </>
                    )}
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </label>
              )}
            </div>

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

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="division"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Division*</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          const newDivision = value as "Residential" | "Commercial" | "Investment Sales" | "Capital Advisory";
                          setDivision(newDivision);
                          // Auto-set deal type based on division
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
                      <FormLabel>Deal Type*</FormLabel>
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
                    <FormLabel>Property Address*</FormLabel>
                    <FormControl>
                      <AddressAutocomplete
                        value={field.value}
                        onChange={field.onChange}
                        onAddressSelect={(addr) => {
                          field.onChange(addr.fullAddress);
                          // Auto-populate borough if it matches NYC boroughs
                          const boroughMatch = ["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"].find(
                            b => addr.fullAddress.includes(b) || addr.city === b
                          );
                          if (boroughMatch) {
                            form.setValue("borough", boroughMatch);
                          }
                          if (addr.neighborhood) {
                            form.setValue("neighborhood", addr.neighborhood);
                          }
                        }}
                        placeholder="Start typing an address..."
                      />
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

            {/* Commission Field */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm">Commission</h3>
              
              <FormField
                control={form.control}
                name="commission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agent Commission ($)</FormLabel>
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
                        {getRoleOptions().map((option) => (
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

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Additional details about the transaction..."
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {transaction ? "Update" : "Create"} Transaction
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}