import { useParams, Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ArrowLeft, User, Building, Calendar, DollarSign, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import {
  useHROffer,
  useUpdateHROffer,
  useDeleteHROffer,
  getOfferStatus,
  offerStatusColors,
  offerStatusLabels,
} from "@/hooks/hr/useHROffers";
import { divisionLabels, Division, formatProduction } from "@/hooks/hr/useHRAgents";
import { CommissionSplitInput } from "@/components/hr/CommissionSplitInput";
import { OfferStatusActions } from "@/components/hr/OfferStatusActions";
import { OfferPreview } from "@/components/hr/OfferPreview";
import { toast } from "sonner";
import { useState, useEffect } from "react";
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

export default function OfferDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: offer, isLoading } = useHROffer(id);
  const updateOffer = useUpdateHROffer();
  const deleteOffer = useDeleteHROffer();

  const [formData, setFormData] = useState({
    division: '',
    commission_split: '',
    signing_bonus: '',
    start_date: undefined as Date | undefined,
    special_terms: '',
  });

  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (offer) {
      setFormData({
        division: offer.division || '',
        commission_split: offer.commission_split || '',
        signing_bonus: offer.signing_bonus?.toString() || '',
        start_date: offer.start_date ? new Date(offer.start_date) : undefined,
        special_terms: offer.special_terms || '',
      });
    }
  }, [offer]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading offer...</div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Offer not found</h2>
        <Button asChild>
          <Link to="/hr/offers">Back to Offers</Link>
        </Button>
      </div>
    );
  }

  const status = getOfferStatus(offer);
  const isEditable = status === 'draft';
  const agent = offer.hr_agents;

  const handleSave = async () => {
    try {
      await updateOffer.mutateAsync({
        id: offer.id,
        division: formData.division,
        commission_split: formData.commission_split,
        signing_bonus: formData.signing_bonus ? parseFloat(formData.signing_bonus) : null,
        start_date: formData.start_date?.toISOString().split('T')[0],
        special_terms: formData.special_terms || null,
      });
      toast.success("Offer saved");
    } catch (error) {
      toast.error("Failed to save offer");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteOffer.mutateAsync(offer.id);
      toast.success("Offer deleted");
      navigate('/hr/offers');
    } catch (error) {
      toast.error("Failed to delete offer");
    }
  };

  // Build preview offer with current form data
  const previewOffer = {
    ...offer,
    division: formData.division,
    commission_split: formData.commission_split,
    signing_bonus: formData.signing_bonus ? parseFloat(formData.signing_bonus) : null,
    start_date: formData.start_date?.toISOString().split('T')[0],
    special_terms: formData.special_terms,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/hr/offers">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">Offer Details</h1>
          <p className="text-muted-foreground">
            {agent?.full_name || 'Unknown Agent'}
          </p>
        </div>
        <Badge className={cn("text-sm", offerStatusColors[status])}>
          {offerStatusLabels[status]}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Agent Card */}
          {agent && (
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{agent.full_name}</h3>
                  <p className="text-muted-foreground">{agent.current_brokerage}</p>
                  <div className="flex gap-4 mt-2 text-sm">
                    {agent.email && (
                      <span className="text-muted-foreground">{agent.email}</span>
                    )}
                    {agent.phone && (
                      <span className="text-muted-foreground">{agent.phone}</span>
                    )}
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/hr/agents/${agent.id}`}>
                    View Profile
                    <ExternalLink className="h-3 w-3 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {/* Compensation Package */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-400" />
              Compensation Package
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Division */}
              <div className="space-y-2">
                <Label>Division</Label>
                <Select
                  value={formData.division}
                  onValueChange={(v) => setFormData({ ...formData, division: v })}
                  disabled={!isEditable}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select division" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(divisionLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <Label>Proposed Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      disabled={!isEditable}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.start_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.start_date ? format(formData.start_date, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={formData.start_date}
                      onSelect={(date) => setFormData({ ...formData, start_date: date })}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Commission Split */}
            <div className="space-y-2">
              <Label>Commission Split</Label>
              <CommissionSplitInput
                value={formData.commission_split}
                onChange={(v) => setFormData({ ...formData, commission_split: v })}
                disabled={!isEditable}
              />
            </div>

            {/* Signing Bonus */}
            <div className="space-y-2">
              <Label>Signing Bonus</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  type="number"
                  value={formData.signing_bonus}
                  onChange={(e) => setFormData({ ...formData, signing_bonus: e.target.value })}
                  placeholder="0"
                  disabled={!isEditable}
                  className="pl-7"
                />
              </div>
            </div>

            {/* Special Terms */}
            <div className="space-y-2">
              <Label>Special Terms</Label>
              <Textarea
                value={formData.special_terms}
                onChange={(e) => setFormData({ ...formData, special_terms: e.target.value })}
                placeholder="Any additional terms or conditions..."
                rows={4}
                disabled={!isEditable}
              />
            </div>

            {isEditable && (
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} disabled={updateOffer.isPending}>
                  {updateOffer.isPending ? "Saving..." : "Save Changes"}
                </Button>
                <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
                  {showPreview ? "Hide Preview" : "Preview Offer"}
                </Button>
              </div>
            )}
          </div>

          {/* Offer Preview */}
          {showPreview && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Offer Letter Preview</h3>
              <OfferPreview offer={previewOffer} />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h3 className="font-semibold">Status</h3>
            <Badge className={cn("text-base px-3 py-1", offerStatusColors[status])}>
              {offerStatusLabels[status]}
            </Badge>

            <Separator />

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{format(new Date(offer.created_at!), 'MMM d, yyyy')}</span>
              </div>
              {offer.sent_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sent</span>
                  <span>{format(new Date(offer.sent_at), 'MMM d, yyyy')}</span>
                </div>
              )}
              {offer.signed_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Signed</span>
                  <span className="text-emerald-400">{format(new Date(offer.signed_at), 'MMM d, yyyy')}</span>
                </div>
              )}
              {offer.declined_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Declined</span>
                  <span className="text-red-400">{format(new Date(offer.declined_at), 'MMM d, yyyy')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions Card */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h3 className="font-semibold">Actions</h3>
            <OfferStatusActions offer={offer} />

            <Separator />

            <div className="space-y-2">
              <Button variant="outline" className="w-full" asChild>
                <Link to={`/hr/agents/${agent?.id}`}>
                  <User className="h-4 w-4 mr-2" />
                  View Agent Profile
                </Link>
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full text-red-400 border-red-500/30 hover:bg-red-500/10">
                    Delete Offer
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Offer</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this offer? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Agent Stats Card */}
          {agent && (
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h3 className="font-semibold">Agent Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Division</span>
                  <span>{offer.division ? divisionLabels[offer.division as Division] : '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Production</span>
                  <span>{formatProduction(agent.annual_production)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Experience</span>
                  <span>{agent.years_experience ? `${agent.years_experience} years` : '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Poachability</span>
                  <span className="text-emerald-400">{agent.poachability_score || '-'}/10</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
