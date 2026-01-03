import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  User, 
  Home, 
  Building2, 
  Store, 
  DollarSign, 
  FileText, 
  Edit2,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { 
  ExclusiveDivision, 
  ResidentialListingData,
  InvestmentSalesListingData,
  CommercialLeasingListingData,
} from "@/hooks/useExclusiveSubmissions";
import { WizardFormData } from "@/pages/portal/exclusives/ExclusiveWizard";
import { cn } from "@/lib/utils";

interface ReviewStepProps {
  division: ExclusiveDivision;
  formData: WizardFormData;
  onEdit: (step: number) => void;
}

export function ReviewStep({ division, formData, onEdit }: ReviewStepProps) {
  const getDivisionIcon = () => {
    switch (division) {
      case "residential": return Home;
      case "investment-sales": return Building2;
      case "commercial-leasing": return Store;
    }
  };

  const getDivisionLabel = () => {
    switch (division) {
      case "residential": return "Residential";
      case "investment-sales": return "Investment Sales";
      case "commercial-leasing": return "Commercial Leasing";
    }
  };

  const formatCurrency = (value?: number) => {
    if (!value) return "—";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const DivisionIcon = getDivisionIcon();
  const hasContract = !!formData.exclusive_contract_url;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          Review Your Submission
        </h2>
        <p className="text-muted-foreground mt-1">
          Please review all information before submitting for review
        </p>
      </div>

      {/* Division Badge */}
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="gap-1 px-3 py-1">
          <DivisionIcon className="h-4 w-4" />
          {getDivisionLabel()}
        </Badge>
        {formData.is_off_market && (
          <Badge variant="secondary">Off-Market</Badge>
        )}
        {formData.is_pocket_listing && (
          <Badge variant="secondary">Pocket Listing</Badge>
        )}
      </div>

      {/* Property Address */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Property Address
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onEdit(0)}>
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="font-medium">{formData.property_address || "—"}</p>
          {formData.unit_number && (
            <p className="text-sm text-muted-foreground">Unit {formData.unit_number}</p>
          )}
          {formData.addressComponents && (
            <p className="text-sm text-muted-foreground mt-1">
              {[
                formData.addressComponents.neighborhood,
                formData.addressComponents.borough,
                formData.addressComponents.city,
                formData.addressComponents.state,
                formData.addressComponents.zipCode,
              ].filter(Boolean).join(", ")}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Owner Details */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              {division === "residential" ? "Landlord" : "Owner"} Details
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onEdit(1)}>
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="font-medium">{formData.owner_name || "—"}</p>
          {formData.owner_company && (
            <p className="text-sm text-muted-foreground">{formData.owner_company}</p>
          )}
          <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
            {formData.owner_email && <span>{formData.owner_email}</span>}
            {formData.owner_phone && <span>{formData.owner_phone}</span>}
          </div>
        </CardContent>
      </Card>

      {/* Property Specs */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <DivisionIcon className="h-4 w-4 text-muted-foreground" />
              Property Specifications
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onEdit(2)}>
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {division === "residential" && (
            <ResidentialSpecs data={formData.listing_data as ResidentialListingData} />
          )}
          {division === "investment-sales" && (
            <InvestmentSpecs data={formData.listing_data as InvestmentSalesListingData} />
          )}
          {division === "commercial-leasing" && (
            <CommercialSpecs data={formData.listing_data as CommercialLeasingListingData} />
          )}
        </CardContent>
      </Card>

      {/* Financials */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              Financial Details
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onEdit(3)}>
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {division === "residential" && (
            <ResidentialFinancials data={formData.listing_data as ResidentialListingData} formatCurrency={formatCurrency} />
          )}
          {division === "investment-sales" && (
            <InvestmentFinancials data={formData.listing_data as InvestmentSalesListingData} formatCurrency={formatCurrency} />
          )}
          {division === "commercial-leasing" && (
            <CommercialFinancials data={formData.listing_data as CommercialLeasingListingData} />
          )}
        </CardContent>
      </Card>

      {/* Documents */}
      <Card className={cn(
        "border-2",
        hasContract ? "border-green-500/50" : "border-destructive"
      )}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Documents
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onEdit(4)}>
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            {hasContract ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-destructive" />
            )}
            <span className={cn(
              "font-medium",
              hasContract ? "text-green-600" : "text-destructive"
            )}>
              Exclusive Contract: {hasContract ? "Uploaded" : "Required"}
            </span>
          </div>
          
          {formData.additional_documents.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Additional Documents:</p>
              <ul className="text-sm space-y-1">
                {formData.additional_documents.map((doc, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <FileText className="h-3 w-3" />
                    {doc.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {!hasContract && (
        <div className="p-4 bg-destructive/10 border border-destructive/50 rounded-lg">
          <p className="text-sm text-destructive font-medium">
            ⚠️ You must upload the exclusive contract before submitting for review.
          </p>
        </div>
      )}
    </div>
  );
}

// Helper components for specs display
function ResidentialSpecs({ data }: { data: ResidentialListingData }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
      <div>
        <span className="text-muted-foreground">Bedrooms</span>
        <p className="font-medium">{data.bedrooms === 0 ? "Studio" : data.bedrooms || "—"}</p>
      </div>
      <div>
        <span className="text-muted-foreground">Bathrooms</span>
        <p className="font-medium">{data.bathrooms || "—"}</p>
      </div>
      <div>
        <span className="text-muted-foreground">Square Ft</span>
        <p className="font-medium">{data.square_footage?.toLocaleString() || "—"}</p>
      </div>
      <div>
        <span className="text-muted-foreground">Floor</span>
        <p className="font-medium">{data.floor || "—"}</p>
      </div>
      <div>
        <span className="text-muted-foreground">Type</span>
        <p className="font-medium">{data.is_rental ? "Rental" : "Sale"}</p>
      </div>
      <div>
        <span className="text-muted-foreground">Available</span>
        <p className="font-medium">{data.available_date || "—"}</p>
      </div>
    </div>
  );
}

function InvestmentSpecs({ data }: { data: InvestmentSalesListingData }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
      <div>
        <span className="text-muted-foreground">Building Class</span>
        <p className="font-medium">{data.building_class || "—"}</p>
      </div>
      <div>
        <span className="text-muted-foreground">Total Units</span>
        <p className="font-medium">{data.total_units || "—"}</p>
      </div>
      <div>
        <span className="text-muted-foreground">Gross SF</span>
        <p className="font-medium">{data.gross_sf?.toLocaleString() || "—"}</p>
      </div>
      <div>
        <span className="text-muted-foreground">Year Built</span>
        <p className="font-medium">{data.year_built || "—"}</p>
      </div>
      <div>
        <span className="text-muted-foreground">Zoning</span>
        <p className="font-medium">{data.zoning || "—"}</p>
      </div>
      <div>
        <span className="text-muted-foreground">Tax Class</span>
        <p className="font-medium">{data.tax_class || "—"}</p>
      </div>
    </div>
  );
}

function CommercialSpecs({ data }: { data: CommercialLeasingListingData }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
      <div>
        <span className="text-muted-foreground">Property Type</span>
        <p className="font-medium capitalize">{data.property_type || "—"}</p>
      </div>
      <div>
        <span className="text-muted-foreground">Total SF</span>
        <p className="font-medium">{data.total_sf?.toLocaleString() || "—"}</p>
      </div>
      <div>
        <span className="text-muted-foreground">Min Divisible</span>
        <p className="font-medium">{data.divisible_min_sf?.toLocaleString() || "—"}</p>
      </div>
      <div>
        <span className="text-muted-foreground">Ceiling Height</span>
        <p className="font-medium">{data.ceiling_height_ft ? `${data.ceiling_height_ft} ft` : "—"}</p>
      </div>
      <div>
        <span className="text-muted-foreground">Frontage</span>
        <p className="font-medium">{data.frontage_ft ? `${data.frontage_ft} ft` : "—"}</p>
      </div>
      <div>
        <span className="text-muted-foreground">Basement</span>
        <p className="font-medium">{data.has_basement ? "Yes" : "No"}</p>
      </div>
    </div>
  );
}

function ResidentialFinancials({ data, formatCurrency }: { data: ResidentialListingData; formatCurrency: (v?: number) => string }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
      {data.is_rental ? (
        <>
          <div>
            <span className="text-muted-foreground">Monthly Rent</span>
            <p className="font-medium">{formatCurrency(data.rent_price)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Security Deposit</span>
            <p className="font-medium">{data.security_deposit_months ? `${data.security_deposit_months} month(s)` : "—"}</p>
          </div>
        </>
      ) : (
        <div>
          <span className="text-muted-foreground">Sale Price</span>
          <p className="font-medium">{formatCurrency(data.sale_price)}</p>
        </div>
      )}
      <div>
        <span className="text-muted-foreground">Fee Structure</span>
        <p className="font-medium uppercase">{data.fee_structure || "—"}</p>
      </div>
    </div>
  );
}

function InvestmentFinancials({ data, formatCurrency }: { data: InvestmentSalesListingData; formatCurrency: (v?: number) => string }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
      <div>
        <span className="text-muted-foreground">Asking Price</span>
        <p className="font-medium">{formatCurrency(data.asking_price)}</p>
      </div>
      <div>
        <span className="text-muted-foreground">GPI</span>
        <p className="font-medium">{formatCurrency(data.gpi)}</p>
      </div>
      <div>
        <span className="text-muted-foreground">NOI</span>
        <p className="font-medium">{formatCurrency(data.noi)}</p>
      </div>
      <div>
        <span className="text-muted-foreground">Current Cap Rate</span>
        <p className="font-medium">{data.current_cap_rate ? `${data.current_cap_rate}%` : "—"}</p>
      </div>
      <div>
        <span className="text-muted-foreground">Pro Forma Cap</span>
        <p className="font-medium">{data.pro_forma_cap_rate ? `${data.pro_forma_cap_rate}%` : "—"}</p>
      </div>
      <div>
        <span className="text-muted-foreground">Annual Taxes</span>
        <p className="font-medium">{formatCurrency(data.annual_taxes)}</p>
      </div>
    </div>
  );
}

function CommercialFinancials({ data }: { data: CommercialLeasingListingData }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
      <div>
        <span className="text-muted-foreground">Asking Rent (PSF)</span>
        <p className="font-medium">{data.ppsf ? `$${data.ppsf.toFixed(2)}` : "—"}</p>
      </div>
      <div>
        <span className="text-muted-foreground">Lease Type</span>
        <p className="font-medium uppercase">{data.lease_type?.replace("_", " ") || "—"}</p>
      </div>
      <div>
        <span className="text-muted-foreground">Lease Term</span>
        <p className="font-medium">{data.lease_term_years ? `${data.lease_term_years} years` : "—"}</p>
      </div>
      <div>
        <span className="text-muted-foreground">Possession</span>
        <p className="font-medium">{data.possession_date || "—"}</p>
      </div>
    </div>
  );
}
