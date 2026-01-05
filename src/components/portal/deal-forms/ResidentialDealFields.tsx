import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, DollarSign, Calendar, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResidentialData {
  bedrooms?: string;
  bathrooms?: string;
  is_rental?: boolean;
  listing_price?: string;
  monthly_rent?: string;
  lease_length_months?: string;
  move_in_date?: string;
  pets_allowed?: boolean;
  guarantor_required?: boolean;
  co_broke_percent?: string;
  gross_sf?: string;
  property_type?: string;
  deal_category?: string;
  referral_source?: string;
}

interface ResidentialDealFieldsProps {
  data: ResidentialData;
  onChange: (data: Partial<ResidentialData>) => void;
}

const propertyTypes = [
  { value: "condo", label: "Condo" },
  { value: "co-op", label: "Co-op" },
  { value: "condop", label: "Condop" },
  { value: "townhouse", label: "Townhouse" },
  { value: "single-family", label: "Single Family" },
  { value: "multi-family", label: "Multi-Family (1-4)" },
  { value: "apartment", label: "Apartment" },
  { value: "loft", label: "Loft" },
  { value: "studio", label: "Studio" },
];

const bedroomOptions = [
  { value: "0", label: "Studio" },
  { value: "1", label: "1 Bed" },
  { value: "2", label: "2 Bed" },
  { value: "3", label: "3 Bed" },
  { value: "4", label: "4 Bed" },
  { value: "5", label: "5+ Bed" },
];

const bathroomOptions = [
  { value: "1", label: "1 Bath" },
  { value: "1.5", label: "1.5 Bath" },
  { value: "2", label: "2 Bath" },
  { value: "2.5", label: "2.5 Bath" },
  { value: "3", label: "3 Bath" },
  { value: "3.5", label: "3.5 Bath" },
  { value: "4", label: "4+ Bath" },
];

const leaseLengths = [
  { value: "6", label: "6 Months" },
  { value: "12", label: "1 Year" },
  { value: "18", label: "18 Months" },
  { value: "24", label: "2 Years" },
  { value: "36", label: "3 Years" },
];

export const ResidentialDealFields = ({ data, onChange }: ResidentialDealFieldsProps) => {
  const isRental = data.is_rental ?? (data.deal_category === "rental");

  const handleTransactionChange = (rental: boolean) => {
    onChange({ 
      is_rental: rental, 
      deal_category: rental ? "rental" : "sale" 
    });
  };

  return (
    <div className="space-y-6">
      {/* Transaction Type */}
      <Card className="glass-card border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-light">
            <Home className="h-4 w-4" />
            Transaction Type
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => handleTransactionChange(false)}
              className={cn(
                "flex-1 py-3 px-4 rounded-lg border-2 transition-all text-center font-medium",
                !isRental 
                  ? "border-pink-500 bg-pink-500/10 text-pink-400" 
                  : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20"
              )}
            >
              Sale
            </button>
            <button
              type="button"
              onClick={() => handleTransactionChange(true)}
              className={cn(
                "flex-1 py-3 px-4 rounded-lg border-2 transition-all text-center font-medium",
                isRental 
                  ? "border-green-500 bg-green-500/10 text-green-400" 
                  : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20"
              )}
            >
              Rental
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Property Details */}
      <Card className="glass-card border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-light">
            <Home className="h-4 w-4" />
            Property Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Property Type</Label>
              <Select
                value={data.property_type || ""}
                onValueChange={(v) => onChange({ property_type: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gross_sf">Square Footage</Label>
              <Input
                id="gross_sf"
                type="number"
                value={data.gross_sf || ""}
                onChange={(e) => onChange({ gross_sf: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Bedrooms</Label>
              <Select
                value={data.bedrooms || ""}
                onValueChange={(v) => onChange({ bedrooms: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {bedroomOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Bathrooms</Label>
              <Select
                value={data.bathrooms || ""}
                onValueChange={(v) => onChange({ bathrooms: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {bathroomOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card className="glass-card border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-light">
            <DollarSign className="h-4 w-4" />
            {isRental ? "Rental Terms" : "Sale Price"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isRental ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthly_rent">Monthly Rent ($)</Label>
                  <Input
                    id="monthly_rent"
                    type="number"
                    value={data.monthly_rent || ""}
                    onChange={(e) => onChange({ monthly_rent: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Lease Length</Label>
                  <Select
                    value={data.lease_length_months || ""}
                    onValueChange={(v) => onChange({ lease_length_months: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {leaseLengths.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="move_in_date">Move-In Date</Label>
                <Input
                  id="move_in_date"
                  type="date"
                  value={data.move_in_date || ""}
                  onChange={(e) => onChange({ move_in_date: e.target.value })}
                />
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="listing_price">Listing Price ($)</Label>
              <Input
                id="listing_price"
                type="number"
                value={data.listing_price || ""}
                onChange={(e) => onChange({ listing_price: e.target.value })}
                placeholder="0"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Requirements (for rentals) */}
      {isRental && (
        <Card className="glass-card border-white/10">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-light">
              <Users className="h-4 w-4" />
              Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pets_allowed"
                  checked={data.pets_allowed ?? true}
                  onCheckedChange={(checked) => onChange({ pets_allowed: checked as boolean })}
                />
                <Label htmlFor="pets_allowed" className="font-normal">Pets Allowed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="guarantor_required"
                  checked={data.guarantor_required ?? false}
                  onCheckedChange={(checked) => onChange({ guarantor_required: checked as boolean })}
                />
                <Label htmlFor="guarantor_required" className="font-normal">Guarantor Required</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Co-Broke & Referral */}
      <Card className="glass-card border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-light">
            <Calendar className="h-4 w-4" />
            Commission & Referral
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="co_broke_percent">Co-Broke Split (%)</Label>
              <Input
                id="co_broke_percent"
                type="number"
                step="0.1"
                value={data.co_broke_percent || ""}
                onChange={(e) => onChange({ co_broke_percent: e.target.value })}
                placeholder="50"
              />
              <p className="text-xs text-muted-foreground">Percentage of commission shared with co-broker</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="referral_source">Referral Source</Label>
              <Input
                id="referral_source"
                value={data.referral_source || ""}
                onChange={(e) => onChange({ referral_source: e.target.value })}
                placeholder="Who referred this deal?"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResidentialDealFields;
