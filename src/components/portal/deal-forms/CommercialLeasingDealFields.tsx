import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, DollarSign, Calendar, FileText } from "lucide-react";

interface CommercialLeasingData {
  tenant_legal_name?: string;
  asking_rent_psf?: string;
  negotiated_rent_psf?: string;
  lease_type?: string;
  lease_term_months?: string;
  commencement_date?: string;
  expiration_date?: string;
  free_rent_months?: string;
  escalation_rate?: string;
  ti_allowance_psf?: string;
  security_deposit_months?: string;
  landlord_broker?: string;
  use_clause?: string;
  space_type?: string;
  gross_sf?: string;
}

interface CommercialLeasingDealFieldsProps {
  data: CommercialLeasingData;
  onChange: (data: Partial<CommercialLeasingData>) => void;
}

const leaseTypes = [
  { value: "gross", label: "Gross" },
  { value: "modified-gross", label: "Modified Gross" },
  { value: "triple-net", label: "Triple Net (NNN)" },
  { value: "double-net", label: "Double Net" },
  { value: "percentage", label: "Percentage Lease" },
];

const spaceTypes = [
  { value: "office", label: "Office" },
  { value: "retail", label: "Retail" },
  { value: "flex", label: "Flex" },
  { value: "industrial", label: "Industrial" },
  { value: "warehouse", label: "Warehouse" },
  { value: "medical", label: "Medical" },
  { value: "restaurant", label: "Restaurant" },
  { value: "showroom", label: "Showroom" },
];

export const CommercialLeasingDealFields = ({ data, onChange }: CommercialLeasingDealFieldsProps) => {
  // Calculate total lease value
  const calculateLeaseValue = () => {
    const rent = parseFloat(data.negotiated_rent_psf || data.asking_rent_psf || "0");
    const sf = parseInt(data.gross_sf || "0");
    const months = parseInt(data.lease_term_months || "0");
    if (rent && sf && months) return Math.round((rent * sf * months) / 12);
    return null;
  };

  const totalLeaseValue = calculateLeaseValue();

  return (
    <div className="space-y-6">
      {/* Tenant & Space Details */}
      <Card className="glass-card border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-light">
            <Building2 className="h-4 w-4" />
            Tenant & Space Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tenant_legal_name">Tenant Legal Name</Label>
            <Input
              id="tenant_legal_name"
              value={data.tenant_legal_name || ""}
              onChange={(e) => onChange({ tenant_legal_name: e.target.value })}
              placeholder="Legal entity name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Space Type</Label>
              <Select
                value={data.space_type || ""}
                onValueChange={(v) => onChange({ space_type: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {spaceTypes.map((type) => (
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
        </CardContent>
      </Card>

      {/* Rent & Terms */}
      <Card className="glass-card border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-light">
            <DollarSign className="h-4 w-4" />
            Rent & Terms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="asking_rent_psf">Asking Rent ($/SF)</Label>
              <Input
                id="asking_rent_psf"
                type="number"
                step="0.01"
                value={data.asking_rent_psf || ""}
                onChange={(e) => onChange({ asking_rent_psf: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="negotiated_rent_psf">Negotiated Rent ($/SF)</Label>
              <Input
                id="negotiated_rent_psf"
                type="number"
                step="0.01"
                value={data.negotiated_rent_psf || ""}
                onChange={(e) => onChange({ negotiated_rent_psf: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Lease Type</Label>
              <Select
                value={data.lease_type || ""}
                onValueChange={(v) => onChange({ lease_type: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {leaseTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lease_term_months">Lease Term (Months)</Label>
              <Input
                id="lease_term_months"
                type="number"
                value={data.lease_term_months || ""}
                onChange={(e) => onChange({ lease_term_months: e.target.value })}
                placeholder="60"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="escalation_rate">Annual Escalation (%)</Label>
              <Input
                id="escalation_rate"
                type="number"
                step="0.1"
                value={data.escalation_rate || ""}
                onChange={(e) => onChange({ escalation_rate: e.target.value })}
                placeholder="3.0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="free_rent_months">Free Rent (Months)</Label>
              <Input
                id="free_rent_months"
                type="number"
                value={data.free_rent_months || ""}
                onChange={(e) => onChange({ free_rent_months: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>

          {/* Calculated Total */}
          {totalLeaseValue && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="text-sm text-muted-foreground">
                Total Lease Value: <strong className="text-foreground">${totalLeaseValue.toLocaleString()}</strong>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dates & Timeline */}
      <Card className="glass-card border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-light">
            <Calendar className="h-4 w-4" />
            Dates & Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="commencement_date">Commencement Date</Label>
              <Input
                id="commencement_date"
                type="date"
                value={data.commencement_date || ""}
                onChange={(e) => onChange({ commencement_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiration_date">Expiration Date</Label>
              <Input
                id="expiration_date"
                type="date"
                value={data.expiration_date || ""}
                onChange={(e) => onChange({ expiration_date: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Concessions & Other */}
      <Card className="glass-card border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-light">
            <FileText className="h-4 w-4" />
            Concessions & Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ti_allowance_psf">TI Allowance ($/SF)</Label>
              <Input
                id="ti_allowance_psf"
                type="number"
                step="0.01"
                value={data.ti_allowance_psf || ""}
                onChange={(e) => onChange({ ti_allowance_psf: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="security_deposit_months">Security Deposit (Months)</Label>
              <Input
                id="security_deposit_months"
                type="number"
                value={data.security_deposit_months || ""}
                onChange={(e) => onChange({ security_deposit_months: e.target.value })}
                placeholder="2"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="landlord_broker">Landlord Broker</Label>
            <Input
              id="landlord_broker"
              value={data.landlord_broker || ""}
              onChange={(e) => onChange({ landlord_broker: e.target.value })}
              placeholder="Broker name / company"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="use_clause">Use Clause</Label>
            <Textarea
              id="use_clause"
              value={data.use_clause || ""}
              onChange={(e) => onChange({ use_clause: e.target.value })}
              placeholder="Permitted use for the space..."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommercialLeasingDealFields;
