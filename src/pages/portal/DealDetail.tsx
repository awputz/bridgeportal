import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Trash2, Phone, Mail, Calendar, DollarSign, MapPin, User, Building2, Percent, Home, FileText, Calculator, Landmark } from "lucide-react";
import { useCRMDeal, useUpdateDeal, useDeleteDeal, useDealStages, useCRMActivities, useCreateActivity, CRMDeal } from "@/hooks/useCRM";
import { useDivision } from "@/contexts/DivisionContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";
import { AerialViewButton } from "@/components/AerialViewButton";
import { Immersive3DMap } from "@/components/Immersive3DMap";
import { WeatherWidget } from "@/components/WeatherWidget";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const dealTypes = [
  { value: "sale", label: "Sale" },
  { value: "lease", label: "Lease" },
  { value: "listing", label: "Listing" },
  { value: "buyer-rep", label: "Buyer Rep" },
  { value: "tenant-rep", label: "Tenant Rep" },
];

const priorityOptions = [
  { value: "low", label: "Low", color: "bg-blue-500/20 text-blue-400" },
  { value: "medium", label: "Medium", color: "bg-yellow-500/20 text-yellow-400" },
  { value: "high", label: "High", color: "bg-red-500/20 text-red-400" },
];

const buildingClasses = [
  { value: "A", label: "Class A" },
  { value: "B", label: "Class B" },
  { value: "C", label: "Class C" },
  { value: "D", label: "Class D" },
];

const propertyTypes = [
  { value: "multifamily", label: "Multifamily" },
  { value: "mixed-use", label: "Mixed-Use" },
  { value: "office", label: "Office" },
  { value: "retail", label: "Retail" },
  { value: "industrial", label: "Industrial" },
  { value: "condo", label: "Condo" },
  { value: "co-op", label: "Co-op" },
  { value: "townhouse", label: "Townhouse" },
];

const leaseTypes = [
  { value: "gross", label: "Gross" },
  { value: "modified-gross", label: "Modified Gross" },
  { value: "triple-net", label: "Triple Net (NNN)" },
  { value: "double-net", label: "Double Net" },
];

const spaceTypes = [
  { value: "office", label: "Office" },
  { value: "retail", label: "Retail" },
  { value: "flex", label: "Flex" },
  { value: "industrial", label: "Industrial" },
  { value: "warehouse", label: "Warehouse" },
];

const financingTypes = [
  { value: "conventional", label: "Conventional" },
  { value: "agency", label: "Agency (Fannie/Freddie)" },
  { value: "bridge", label: "Bridge Loan" },
  { value: "all-cash", label: "All Cash" },
];

const DealDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { division } = useDivision();

  const { data: deal, isLoading, error } = useCRMDeal(id || "");
  const { data: stages } = useDealStages(division);
  const { data: activities } = useCRMActivities({ dealId: id, limit: 10 });
  const updateDeal = useUpdateDeal();
  const deleteDeal = useDeleteDeal();
  const createActivity = useCreateActivity();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleEdit = () => {
    if (deal) {
      setFormData({
        property_address: deal.property_address,
        deal_type: deal.deal_type,
        stage_id: deal.stage_id,
        value: deal.value,
        expected_close: deal.expected_close,
        probability: deal.probability,
        priority: deal.priority,
        notes: deal.notes,
        // Investment Sales fields
        cap_rate: deal.cap_rate,
        noi: deal.noi,
        building_class: deal.building_class,
        unit_count: deal.unit_count,
        year_built: deal.year_built,
        gross_sf: deal.gross_sf,
        asking_price: deal.asking_price,
        offer_price: deal.offer_price,
        is_1031_exchange: deal.is_1031_exchange,
        financing_type: deal.financing_type,
        lender_name: deal.lender_name,
        loan_amount: deal.loan_amount,
        due_diligence_deadline: deal.due_diligence_deadline,
        property_type: deal.property_type,
        zoning: deal.zoning,
        // Commercial Leasing fields
        tenant_legal_name: deal.tenant_legal_name,
        asking_rent_psf: deal.asking_rent_psf,
        negotiated_rent_psf: deal.negotiated_rent_psf,
        lease_type: deal.lease_type,
        lease_term_months: deal.lease_term_months,
        commencement_date: deal.commencement_date,
        expiration_date: deal.expiration_date,
        free_rent_months: deal.free_rent_months,
        escalation_rate: deal.escalation_rate,
        ti_allowance_psf: deal.ti_allowance_psf,
        security_deposit_months: deal.security_deposit_months,
        landlord_broker: deal.landlord_broker,
        use_clause: deal.use_clause,
        space_type: deal.space_type,
        // Residential fields
        bedrooms: deal.bedrooms,
        bathrooms: deal.bathrooms,
        is_rental: deal.is_rental,
        listing_price: deal.listing_price,
        monthly_rent: deal.monthly_rent,
        lease_length_months: deal.lease_length_months,
        move_in_date: deal.move_in_date,
        pets_allowed: deal.pets_allowed,
        guarantor_required: deal.guarantor_required,
        co_broke_percent: deal.co_broke_percent,
      });
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (!id) return;
    updateDeal.mutate(
      { id, ...formData },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const handleDelete = () => {
    if (!id) return;
    deleteDeal.mutate(id, {
      onSuccess: () => {
        navigate("/portal/crm");
      },
    });
  };

  const handleStageChange = (stageId: string) => {
    if (!id) return;
    updateDeal.mutate({ id, stage_id: stageId });
  };

  const handleAddActivity = async (type: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !id) return;

    createActivity.mutate({
      agent_id: user.id,
      deal_id: id,
      contact_id: deal?.contact_id || null,
      activity_type: type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} - ${deal?.property_address}`,
      description: null,
      due_date: null,
      completed_at: null,
      is_completed: false,
      division: deal?.division || 'investment-sales',
      priority: 'medium',
      reminder_at: null,
      recurring_pattern: null,
      is_all_day: false,
      category: type,
    });
  };

  const formatCurrency = (value: number | null | undefined) => {
    if (value == null) return "N/A";
    return `$${value.toLocaleString()}`;
  };

  const formatPercent = (value: number | null | undefined) => {
    if (value == null) return "N/A";
    return `${value}%`;
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 pb-24 md:pb-8">
          <Skeleton className="h-10 w-32 mb-6" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 pb-24 md:pb-8 text-center">
          <h1 className="text-2xl font-light text-foreground mb-4">Unable to load deal</h1>
          <p className="text-muted-foreground mb-4">
            There was an error loading this deal. Please try again.
          </p>
          <Link to="/portal/crm">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to CRM
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 pb-24 md:pb-8 text-center">
          <h1 className="text-2xl font-light text-foreground mb-4">Deal not found</h1>
          <p className="text-muted-foreground mb-4">
            This deal may have been deleted or you don't have permission to view it.
          </p>
          <Link to="/portal/crm">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to CRM
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const renderInvestmentSalesFields = () => (
    <Card className="glass-card border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-light">
          <Building2 className="h-5 w-5" />
          Investment Sales Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Property Type</Label>
                <Select
                  value={formData.property_type || ""}
                  onValueChange={(v) => setFormData({ ...formData, property_type: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Building Class</Label>
                <Select
                  value={formData.building_class || ""}
                  onValueChange={(v) => setFormData({ ...formData, building_class: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {buildingClasses.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Unit Count</Label>
                <Input
                  type="number"
                  value={formData.unit_count || ""}
                  onChange={(e) => setFormData({ ...formData, unit_count: parseInt(e.target.value) || null })}
                />
              </div>
              <div className="space-y-2">
                <Label>Gross SF</Label>
                <Input
                  type="number"
                  value={formData.gross_sf || ""}
                  onChange={(e) => setFormData({ ...formData, gross_sf: parseInt(e.target.value) || null })}
                />
              </div>
              <div className="space-y-2">
                <Label>Year Built</Label>
                <Input
                  type="number"
                  value={formData.year_built || ""}
                  onChange={(e) => setFormData({ ...formData, year_built: parseInt(e.target.value) || null })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Asking Price ($)</Label>
                <Input
                  type="number"
                  value={formData.asking_price || ""}
                  onChange={(e) => setFormData({ ...formData, asking_price: parseFloat(e.target.value) || null })}
                />
              </div>
              <div className="space-y-2">
                <Label>Offer Price ($)</Label>
                <Input
                  type="number"
                  value={formData.offer_price || ""}
                  onChange={(e) => setFormData({ ...formData, offer_price: parseFloat(e.target.value) || null })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>NOI ($)</Label>
                <Input
                  type="number"
                  value={formData.noi || ""}
                  onChange={(e) => setFormData({ ...formData, noi: parseFloat(e.target.value) || null })}
                />
              </div>
              <div className="space-y-2">
                <Label>Cap Rate (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.cap_rate || ""}
                  onChange={(e) => setFormData({ ...formData, cap_rate: parseFloat(e.target.value) || null })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Financing Type</Label>
                <Select
                  value={formData.financing_type || ""}
                  onValueChange={(v) => setFormData({ ...formData, financing_type: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {financingTypes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Loan Amount ($)</Label>
                <Input
                  type="number"
                  value={formData.loan_amount || ""}
                  onChange={(e) => setFormData({ ...formData, loan_amount: parseFloat(e.target.value) || null })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Lender</Label>
                <Input
                  value={formData.lender_name || ""}
                  onChange={(e) => setFormData({ ...formData, lender_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Due Diligence Deadline</Label>
                <Input
                  type="date"
                  value={formData.due_diligence_deadline || ""}
                  onChange={(e) => setFormData({ ...formData, due_diligence_deadline: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_1031_exchange"
                checked={formData.is_1031_exchange || false}
                onCheckedChange={(checked) => setFormData({ ...formData, is_1031_exchange: !!checked })}
              />
              <Label htmlFor="is_1031_exchange">1031 Exchange</Label>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-4 text-sm">
            {deal.property_type && (
              <div>
                <span className="text-muted-foreground">Type:</span>{" "}
                <span className="capitalize">{deal.property_type}</span>
              </div>
            )}
            {deal.building_class && (
              <div>
                <span className="text-muted-foreground">Class:</span> {deal.building_class}
              </div>
            )}
            {deal.unit_count && (
              <div>
                <span className="text-muted-foreground">Units:</span> {deal.unit_count}
              </div>
            )}
            {deal.gross_sf && (
              <div>
                <span className="text-muted-foreground">SF:</span> {deal.gross_sf.toLocaleString()}
              </div>
            )}
            {deal.asking_price && (
              <div>
                <span className="text-muted-foreground">Asking:</span> {formatCurrency(deal.asking_price)}
              </div>
            )}
            {deal.offer_price && (
              <div>
                <span className="text-muted-foreground">Offer:</span> {formatCurrency(deal.offer_price)}
              </div>
            )}
            {deal.noi && (
              <div>
                <span className="text-muted-foreground">NOI:</span> {formatCurrency(deal.noi)}
              </div>
            )}
            {deal.cap_rate && (
              <div>
                <span className="text-muted-foreground">Cap Rate:</span> {formatPercent(deal.cap_rate)}
              </div>
            )}
            {deal.financing_type && (
              <div>
                <span className="text-muted-foreground">Financing:</span>{" "}
                <span className="capitalize">{deal.financing_type.replace("-", " ")}</span>
              </div>
            )}
            {deal.loan_amount && (
              <div>
                <span className="text-muted-foreground">Loan:</span> {formatCurrency(deal.loan_amount)}
              </div>
            )}
            {deal.is_1031_exchange && (
              <div className="col-span-2">
                <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400">1031 Exchange</Badge>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderCommercialLeasingFields = () => (
    <Card className="glass-card border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-light">
          <FileText className="h-5 w-5" />
          Lease Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <div className="space-y-2">
              <Label>Tenant Legal Name</Label>
              <Input
                value={formData.tenant_legal_name || ""}
                onChange={(e) => setFormData({ ...formData, tenant_legal_name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Space Type</Label>
                <Select
                  value={formData.space_type || ""}
                  onValueChange={(v) => setFormData({ ...formData, space_type: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {spaceTypes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Square Footage</Label>
                <Input
                  type="number"
                  value={formData.gross_sf || ""}
                  onChange={(e) => setFormData({ ...formData, gross_sf: parseInt(e.target.value) || null })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Asking Rent ($/SF)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.asking_rent_psf || ""}
                  onChange={(e) => setFormData({ ...formData, asking_rent_psf: parseFloat(e.target.value) || null })}
                />
              </div>
              <div className="space-y-2">
                <Label>Negotiated Rent ($/SF)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.negotiated_rent_psf || ""}
                  onChange={(e) => setFormData({ ...formData, negotiated_rent_psf: parseFloat(e.target.value) || null })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Lease Type</Label>
                <Select
                  value={formData.lease_type || ""}
                  onValueChange={(v) => setFormData({ ...formData, lease_type: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {leaseTypes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Lease Term (Months)</Label>
                <Input
                  type="number"
                  value={formData.lease_term_months || ""}
                  onChange={(e) => setFormData({ ...formData, lease_term_months: parseInt(e.target.value) || null })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Commencement Date</Label>
                <Input
                  type="date"
                  value={formData.commencement_date || ""}
                  onChange={(e) => setFormData({ ...formData, commencement_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Expiration Date</Label>
                <Input
                  type="date"
                  value={formData.expiration_date || ""}
                  onChange={(e) => setFormData({ ...formData, expiration_date: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Free Rent (Mo)</Label>
                <Input
                  type="number"
                  value={formData.free_rent_months || ""}
                  onChange={(e) => setFormData({ ...formData, free_rent_months: parseInt(e.target.value) || null })}
                />
              </div>
              <div className="space-y-2">
                <Label>Escalation (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.escalation_rate || ""}
                  onChange={(e) => setFormData({ ...formData, escalation_rate: parseFloat(e.target.value) || null })}
                />
              </div>
              <div className="space-y-2">
                <Label>TI ($/SF)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.ti_allowance_psf || ""}
                  onChange={(e) => setFormData({ ...formData, ti_allowance_psf: parseFloat(e.target.value) || null })}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-4 text-sm">
            {deal.tenant_legal_name && (
              <div className="col-span-2">
                <span className="text-muted-foreground">Tenant:</span> {deal.tenant_legal_name}
              </div>
            )}
            {deal.space_type && (
              <div>
                <span className="text-muted-foreground">Space Type:</span>{" "}
                <span className="capitalize">{deal.space_type}</span>
              </div>
            )}
            {deal.gross_sf && (
              <div>
                <span className="text-muted-foreground">SF:</span> {deal.gross_sf.toLocaleString()}
              </div>
            )}
            {deal.asking_rent_psf && (
              <div>
                <span className="text-muted-foreground">Asking:</span> ${deal.asking_rent_psf}/SF
              </div>
            )}
            {deal.negotiated_rent_psf && (
              <div>
                <span className="text-muted-foreground">Negotiated:</span> ${deal.negotiated_rent_psf}/SF
              </div>
            )}
            {deal.lease_type && (
              <div>
                <span className="text-muted-foreground">Lease Type:</span>{" "}
                <span className="capitalize">{deal.lease_type.replace("-", " ")}</span>
              </div>
            )}
            {deal.lease_term_months && (
              <div>
                <span className="text-muted-foreground">Term:</span> {deal.lease_term_months} months
              </div>
            )}
            {deal.commencement_date && (
              <div>
                <span className="text-muted-foreground">Start:</span>{" "}
                {format(new Date(deal.commencement_date), "MMM d, yyyy")}
              </div>
            )}
            {deal.expiration_date && (
              <div>
                <span className="text-muted-foreground">End:</span>{" "}
                {format(new Date(deal.expiration_date), "MMM d, yyyy")}
              </div>
            )}
            {deal.ti_allowance_psf && (
              <div>
                <span className="text-muted-foreground">TI:</span> ${deal.ti_allowance_psf}/SF
              </div>
            )}
            {deal.free_rent_months && (
              <div>
                <span className="text-muted-foreground">Free Rent:</span> {deal.free_rent_months} mo
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderResidentialFields = () => (
    <Card className="glass-card border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-light">
          <Home className="h-5 w-5" />
          Residential Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_sale"
                  checked={!formData.is_rental}
                  onCheckedChange={() => setFormData({ ...formData, is_rental: false })}
                />
                <Label htmlFor="is_sale">Sale</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_rental"
                  checked={formData.is_rental || false}
                  onCheckedChange={() => setFormData({ ...formData, is_rental: true })}
                />
                <Label htmlFor="is_rental">Rental</Label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Property Type</Label>
                <Select
                  value={formData.property_type || ""}
                  onValueChange={(v) => setFormData({ ...formData, property_type: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Square Footage</Label>
                <Input
                  type="number"
                  value={formData.gross_sf || ""}
                  onChange={(e) => setFormData({ ...formData, gross_sf: parseInt(e.target.value) || null })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Bedrooms</Label>
                <Input
                  type="number"
                  value={formData.bedrooms || ""}
                  onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) || null })}
                />
              </div>
              <div className="space-y-2">
                <Label>Bathrooms</Label>
                <Input
                  type="number"
                  step="0.5"
                  value={formData.bathrooms || ""}
                  onChange={(e) => setFormData({ ...formData, bathrooms: parseFloat(e.target.value) || null })}
                />
              </div>
            </div>
            {formData.is_rental ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Monthly Rent ($)</Label>
                    <Input
                      type="number"
                      value={formData.monthly_rent || ""}
                      onChange={(e) => setFormData({ ...formData, monthly_rent: parseFloat(e.target.value) || null })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Lease Length (Mo)</Label>
                    <Input
                      type="number"
                      value={formData.lease_length_months || ""}
                      onChange={(e) => setFormData({ ...formData, lease_length_months: parseInt(e.target.value) || null })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Move-In Date</Label>
                  <Input
                    type="date"
                    value={formData.move_in_date || ""}
                    onChange={(e) => setFormData({ ...formData, move_in_date: e.target.value })}
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pets_allowed"
                      checked={formData.pets_allowed ?? true}
                      onCheckedChange={(checked) => setFormData({ ...formData, pets_allowed: !!checked })}
                    />
                    <Label htmlFor="pets_allowed">Pets Allowed</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="guarantor_required"
                      checked={formData.guarantor_required || false}
                      onCheckedChange={(checked) => setFormData({ ...formData, guarantor_required: !!checked })}
                    />
                    <Label htmlFor="guarantor_required">Guarantor Required</Label>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label>Listing Price ($)</Label>
                <Input
                  type="number"
                  value={formData.listing_price || ""}
                  onChange={(e) => setFormData({ ...formData, listing_price: parseFloat(e.target.value) || null })}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label>Co-Broke Split (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={formData.co_broke_percent || ""}
                onChange={(e) => setFormData({ ...formData, co_broke_percent: parseFloat(e.target.value) || null })}
              />
            </div>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="col-span-2">
              <Badge variant="outline" className={deal.is_rental ? "bg-purple-500/20 text-purple-400" : "bg-green-500/20 text-green-400"}>
                {deal.is_rental ? "Rental" : "Sale"}
              </Badge>
            </div>
            {deal.property_type && (
              <div>
                <span className="text-muted-foreground">Type:</span>{" "}
                <span className="capitalize">{deal.property_type}</span>
              </div>
            )}
            {deal.gross_sf && (
              <div>
                <span className="text-muted-foreground">SF:</span> {deal.gross_sf.toLocaleString()}
              </div>
            )}
            {deal.bedrooms != null && (
              <div>
                <span className="text-muted-foreground">Beds:</span> {deal.bedrooms}
              </div>
            )}
            {deal.bathrooms != null && (
              <div>
                <span className="text-muted-foreground">Baths:</span> {deal.bathrooms}
              </div>
            )}
            {deal.is_rental ? (
              <>
                {deal.monthly_rent && (
                  <div>
                    <span className="text-muted-foreground">Rent:</span> {formatCurrency(deal.monthly_rent)}/mo
                  </div>
                )}
                {deal.lease_length_months && (
                  <div>
                    <span className="text-muted-foreground">Lease:</span> {deal.lease_length_months} months
                  </div>
                )}
                {deal.move_in_date && (
                  <div>
                    <span className="text-muted-foreground">Move-In:</span>{" "}
                    {format(new Date(deal.move_in_date), "MMM d, yyyy")}
                  </div>
                )}
                <div className="col-span-2 flex gap-2">
                  {deal.pets_allowed && <Badge variant="outline" className="text-xs">Pets OK</Badge>}
                  {deal.guarantor_required && <Badge variant="outline" className="text-xs">Guarantor Req</Badge>}
                </div>
              </>
            ) : (
              <>
                {deal.listing_price && (
                  <div>
                    <span className="text-muted-foreground">Price:</span> {formatCurrency(deal.listing_price)}
                  </div>
                )}
              </>
            )}
            {deal.co_broke_percent && (
              <div>
                <span className="text-muted-foreground">Co-Broke:</span> {deal.co_broke_percent}%
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 pb-24 md:pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/portal/crm">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-light text-foreground">
                {deal.property_address}
              </h1>
              <p className="text-muted-foreground">
                {dealTypes.find(t => t.value === deal.deal_type)?.label || deal.deal_type}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button onClick={handleSave} disabled={updateDeal.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleEdit}>Edit</Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="glass-panel-strong">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Deal</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this deal? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Deal Info Card */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="font-light">Deal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label>Property Address</Label>
                      <AddressAutocomplete
                        value={formData.property_address || ""}
                        onChange={(v) => setFormData({ ...formData, property_address: v })}
                        onAddressSelect={(addr) => setFormData({ ...formData, property_address: addr.fullAddress })}
                        placeholder="Enter address"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Deal Type</Label>
                        <Select
                          value={formData.deal_type || ""}
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
                        <Label>Value</Label>
                        <Input
                          type="number"
                          value={formData.value || ""}
                          onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || null })}
                          placeholder="$0"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Expected Close</Label>
                        <Input
                          type="date"
                          value={formData.expected_close || ""}
                          onChange={(e) => setFormData({ ...formData, expected_close: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Probability (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={formData.probability || ""}
                          onChange={(e) => setFormData({ ...formData, probability: parseInt(e.target.value) || 50 })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select
                        value={formData.priority || "medium"}
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
                    <div className="space-y-2">
                      <Label>Notes</Label>
                      <Textarea
                        value={formData.notes || ""}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={4}
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <span className="text-foreground">{deal.property_address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                      <span className="text-foreground">
                        {deal.value ? `$${deal.value.toLocaleString()}` : "No value set"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <span className="text-foreground">
                        {deal.expected_close
                          ? `Expected close: ${format(new Date(deal.expected_close), "MMM d, yyyy")}`
                          : "No close date set"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={priorityOptions.find(p => p.value === deal.priority)?.color || ""}>
                        {deal.priority || "medium"} priority
                      </Badge>
                      <span className="text-muted-foreground">
                        {deal.probability}% probability
                      </span>
                    </div>
                    {deal.notes && (
                      <div className="pt-4 border-t border-white/10">
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{deal.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Division-Specific Fields */}
            {deal.division === "investment-sales" && renderInvestmentSalesFields()}
            {deal.division === "commercial-leasing" && renderCommercialLeasingFields()}
            {deal.division === "residential" && renderResidentialFields()}

            {/* Activity Timeline */}
            <Card className="glass-card border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-light">Activity Timeline</CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleAddActivity("call")}>
                    <Phone className="h-4 w-4 mr-1" />
                    Log Call
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleAddActivity("email")}>
                    <Mail className="h-4 w-4 mr-1" />
                    Log Email
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {activities && activities.length > 0 ? (
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex gap-3 pb-4 border-b border-white/5 last:border-0">
                        <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                          {activity.activity_type === "call" && <Phone className="h-4 w-4" />}
                          {activity.activity_type === "email" && <Mail className="h-4 w-4" />}
                          {!["call", "email"].includes(activity.activity_type) && <Calendar className="h-4 w-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground truncate">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(activity.created_at), "MMM d, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                        {activity.is_completed && (
                          <Badge variant="outline" className="text-green-400 border-green-400/50">Completed</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No activities yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Property Location & Weather */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="font-light text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location & Weather
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Weather for property location */}
                <WeatherWidget 
                  address={deal.property_address} 
                  latitude={deal.latitude || undefined}
                  longitude={deal.longitude || undefined}
                  compact 
                />
                
                {/* Aerial View Button */}
                <AerialViewButton 
                  address={deal.property_address}
                  latitude={deal.latitude || undefined}
                  longitude={deal.longitude || undefined}
                  className="w-full"
                />
                
                {/* 3D Map */}
                {(deal.latitude && deal.longitude) && (
                  <Immersive3DMap
                    latitude={deal.latitude}
                    longitude={deal.longitude}
                    address={deal.property_address}
                    className="mt-2"
                  />
                )}
              </CardContent>
            </Card>

            {/* Stage */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="font-light text-sm">Stage</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={deal.stage_id || ""}
                  onValueChange={handleStageChange}
                >
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <div className="flex items-center gap-2">
                      {deal.stage && (
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: deal.stage.color }}
                        />
                      )}
                      <SelectValue placeholder="Select stage" />
                    </div>
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
              </CardContent>
            </Card>

            {/* Contact */}
            {deal.contact && (
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="font-light text-sm">Contact</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link
                    to={`/portal/crm/contacts/${deal.contact.id}`}
                    className="flex items-center gap-3 p-3 -m-3 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {deal.contact.full_name}
                      </p>
                      {deal.contact.company && (
                        <p className="text-xs text-muted-foreground truncate">
                          {deal.contact.company}
                        </p>
                      )}
                    </div>
                  </Link>
                  <div className="flex gap-2 mt-3">
                    {deal.contact.phone && (
                      <a href={`tel:${deal.contact.phone}`}>
                        <Button size="sm" variant="outline" className="gap-1">
                          <Phone className="h-3 w-3" />
                          Call
                        </Button>
                      </a>
                    )}
                    {deal.contact.email && (
                      <a href={`mailto:${deal.contact.email}`}>
                        <Button size="sm" variant="outline" className="gap-1">
                          <Mail className="h-3 w-3" />
                          Email
                        </Button>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Deal Metadata */}
            <Card className="glass-card border-white/10">
              <CardContent className="pt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span className="text-foreground">
                    {format(new Date(deal.created_at), "MMM d, yyyy")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated</span>
                  <span className="text-foreground">
                    {format(new Date(deal.updated_at), "MMM d, yyyy")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Division</span>
                  <span className="text-foreground capitalize">{deal.division}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealDetail;