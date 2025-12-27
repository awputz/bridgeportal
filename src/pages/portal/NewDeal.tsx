import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useCreateDeal, useDealStages, useCRMContacts } from "@/hooks/useCRM";
import { useDivision } from "@/contexts/DivisionContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AddressAutocomplete, AddressComponents } from "@/components/ui/AddressAutocomplete";
import { InvestmentSalesDealFields } from "@/components/portal/deal-forms/InvestmentSalesDealFields";
import { CommercialLeasingDealFields } from "@/components/portal/deal-forms/CommercialLeasingDealFields";
import { ResidentialDealFields } from "@/components/portal/deal-forms/ResidentialDealFields";

// Division-specific data types
interface InvestmentSalesData {
  cap_rate?: string;
  noi?: string;
  building_class?: string;
  unit_count?: string;
  year_built?: string;
  gross_sf?: string;
  asking_price?: string;
  offer_price?: string;
  is_1031_exchange?: boolean;
  financing_type?: string;
  lender_name?: string;
  loan_amount?: string;
  due_diligence_deadline?: string;
  property_type?: string;
  zoning?: string;
}

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
}

const dealTypes = [
  { value: "sale", label: "Sale" },
  { value: "lease", label: "Lease" },
  { value: "listing", label: "Listing" },
  { value: "buyer-rep", label: "Buyer Rep" },
  { value: "tenant-rep", label: "Tenant Rep" },
];

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const NewDeal = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { division } = useDivision();

  const preselectedContactId = searchParams.get("contact");

  const { data: stages } = useDealStages(division);
  const { data: contacts } = useCRMContacts(division);
  const createDeal = useCreateDeal();

  const [formData, setFormData] = useState({
    property_address: "",
    deal_type: "sale",
    stage_id: "",
    contact_id: preselectedContactId || "",
    priority: "medium",
    notes: "",
    neighborhood: "",
    borough: "",
    latitude: null as number | null,
    longitude: null as number | null,
  });

  // Division-specific data
  const [investmentData, setInvestmentData] = useState<InvestmentSalesData>({});
  const [commercialData, setCommercialData] = useState<CommercialLeasingData>({});
  const [residentialData, setResidentialData] = useState<ResidentialData>({});

  const handleAddressSelect = (components: AddressComponents) => {
    setFormData({
      ...formData,
      property_address: components.fullAddress,
      neighborhood: components.neighborhood || "",
      borough: components.borough || "",
      latitude: components.latitude || null,
      longitude: components.longitude || null,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in to create a deal");
      return;
    }

    if (!formData.property_address.trim()) {
      toast.error("Property address is required");
      return;
    }

    // Get the first stage as default if none selected
    const stageId = formData.stage_id || (stages && stages.length > 0 ? stages[0].id : null);

    // Build deal payload based on division
    let dealPayload: any = {
      agent_id: user.id,
      property_address: formData.property_address,
      deal_type: formData.deal_type,
      stage_id: stageId,
      contact_id: formData.contact_id || null,
      priority: formData.priority,
      notes: formData.notes || null,
      division,
      neighborhood: formData.neighborhood || null,
      borough: formData.borough || null,
      latitude: formData.latitude,
      longitude: formData.longitude,
      probability: 50,
    };

    // Add division-specific fields
    if (division === "investment-sales") {
      dealPayload = {
        ...dealPayload,
        value: investmentData.asking_price || null,
        commission: null,
        expected_close: investmentData.due_diligence_deadline || null,
        cap_rate: investmentData.cap_rate || null,
        noi: investmentData.noi || null,
        building_class: investmentData.building_class || null,
        unit_count: investmentData.unit_count || null,
        year_built: investmentData.year_built || null,
        gross_sf: investmentData.gross_sf || null,
        asking_price: investmentData.asking_price || null,
        offer_price: investmentData.offer_price || null,
        property_type: investmentData.property_type || null,
        zoning: investmentData.zoning || null,
        is_1031_exchange: investmentData.is_1031_exchange || false,
        financing_type: investmentData.financing_type || null,
        lender_name: investmentData.lender_name || null,
        loan_amount: investmentData.loan_amount || null,
        due_diligence_deadline: investmentData.due_diligence_deadline || null,
      };
    } else if (division === "commercial-leasing") {
      const rentPsf = parseFloat(String(commercialData.asking_rent_psf || 0));
      const sqFt = parseFloat(String(commercialData.gross_sf || 0));
      const termMonths = parseFloat(String(commercialData.lease_term_months || 0));
      const leaseValue = rentPsf * sqFt * (termMonths / 12);
      dealPayload = {
        ...dealPayload,
        value: leaseValue || null,
        commission: null,
        expected_close: commercialData.commencement_date || null,
        tenant_legal_name: commercialData.tenant_legal_name || null,
        asking_rent_psf: commercialData.asking_rent_psf || null,
        negotiated_rent_psf: commercialData.negotiated_rent_psf || null,
        lease_type: commercialData.lease_type || null,
        lease_term_months: commercialData.lease_term_months || null,
        commencement_date: commercialData.commencement_date || null,
        expiration_date: commercialData.expiration_date || null,
        free_rent_months: commercialData.free_rent_months || null,
        escalation_rate: commercialData.escalation_rate || null,
        ti_allowance_psf: commercialData.ti_allowance_psf || null,
        security_deposit_months: commercialData.security_deposit_months || null,
        use_clause: commercialData.use_clause || null,
        space_type: commercialData.space_type || null,
        gross_sf: commercialData.gross_sf || null,
      };
    } else if (division === "residential") {
      const isRental = residentialData.is_rental || false;
      dealPayload = {
        ...dealPayload,
        value: isRental ? residentialData.monthly_rent : residentialData.listing_price,
        commission: null,
        expected_close: residentialData.move_in_date || null,
        bedrooms: residentialData.bedrooms || null,
        bathrooms: residentialData.bathrooms || null,
        is_rental: isRental,
        listing_price: residentialData.listing_price || null,
        monthly_rent: residentialData.monthly_rent || null,
        lease_length_months: residentialData.lease_length_months || null,
        move_in_date: residentialData.move_in_date || null,
        pets_allowed: residentialData.pets_allowed ?? true,
        guarantor_required: residentialData.guarantor_required || false,
        co_broke_percent: residentialData.co_broke_percent || null,
        property_type: residentialData.property_type || null,
        gross_sf: residentialData.gross_sf || null,
      };
    }

    createDeal.mutate(dealPayload, {
      onSuccess: (data) => {
        navigate(`/portal/crm/deals/${data.id}`);
      },
    });
  };

  return (
    <div className="min-h-screen pb-24 md:pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/portal/crm">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-light text-foreground">
              New Deal
            </h1>
            <p className="text-muted-foreground">Create a new {division.replace("-", " ")} deal</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info Card */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="font-light">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Property Address */}
              <div className="space-y-2">
                <Label htmlFor="property_address">Property Address *</Label>
                <AddressAutocomplete
                  value={formData.property_address}
                  onChange={(v) => setFormData({ ...formData, property_address: v })}
                  onAddressSelect={handleAddressSelect}
                  placeholder="Start typing an address..."
                />
              </div>

              {/* Deal Type & Stage */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Deal Type</Label>
                  <Select
                    value={formData.deal_type}
                    onValueChange={(v) => setFormData({ ...formData, deal_type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dealTypes.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Stage</Label>
                  <Select
                    value={formData.stage_id}
                    onValueChange={(v) => setFormData({ ...formData, stage_id: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {stages?.map((stage) => (
                        <SelectItem key={stage.id} value={stage.id}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: stage.color }}
                            />
                            {stage.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Contact & Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Associated Contact</Label>
                  <Select
                    value={formData.contact_id}
                    onValueChange={(v) => setFormData({ ...formData, contact_id: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a contact (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {contacts?.map((contact) => (
                        <SelectItem key={contact.id} value={contact.id}>
                          {contact.full_name}
                          {contact.company && ` (${contact.company})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(v) => setFormData({ ...formData, priority: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((p) => (
                        <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="Add any notes about this deal..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Division-Specific Fields */}
          {division === "investment-sales" && (
            <InvestmentSalesDealFields
              data={investmentData}
              onChange={setInvestmentData}
            />
          )}

          {division === "commercial-leasing" && (
            <CommercialLeasingDealFields
              data={commercialData}
              onChange={setCommercialData}
            />
          )}

          {division === "residential" && (
            <ResidentialDealFields
              data={residentialData}
              onChange={setResidentialData}
            />
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Link to="/portal/crm">
              <Button type="button" variant="ghost">Cancel</Button>
            </Link>
            <Button type="submit" disabled={createDeal.isPending}>
              {createDeal.isPending ? "Creating..." : "Create Deal"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewDeal;