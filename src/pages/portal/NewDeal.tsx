import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useCreateDeal, useDealStages, useCRMContacts } from "@/hooks/useCRM";
import { useDivision } from "@/contexts/DivisionContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
    value: "",
    commission: "",
    expected_close: "",
    probability: "50",
    priority: "medium",
    notes: "",
  });

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

    createDeal.mutate(
      {
        agent_id: user.id,
        property_address: formData.property_address,
        deal_type: formData.deal_type,
        stage_id: stageId,
        contact_id: formData.contact_id || null,
        value: formData.value ? parseFloat(formData.value) : null,
        commission: formData.commission ? parseFloat(formData.commission) : null,
        expected_close: formData.expected_close || null,
        probability: parseInt(formData.probability) || 50,
        priority: formData.priority,
        notes: formData.notes || null,
        division,
      },
      {
        onSuccess: (data) => {
          navigate(`/portal/crm/deals/${data.id}`);
        },
      }
    );
  };

  return (
    <div className="min-h-screen pb-24 md:pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
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
            <p className="text-muted-foreground">Create a new deal in your pipeline</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="font-light">Deal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Property Address */}
              <div className="space-y-2">
                <Label htmlFor="property_address">Property Address *</Label>
                <Input
                  id="property_address"
                  value={formData.property_address}
                  onChange={(e) => setFormData({ ...formData, property_address: e.target.value })}
                  placeholder="123 Main Street, New York, NY"
                  required
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

              {/* Contact */}
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

              {/* Value & Commission */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="value">Deal Value ($)</Label>
                  <Input
                    id="value"
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commission">Your Commission ($)</Label>
                  <Input
                    id="commission"
                    type="number"
                    value={formData.commission}
                    onChange={(e) => setFormData({ ...formData, commission: e.target.value })}
                    placeholder="Actual amount earned"
                  />
                  <p className="text-xs text-muted-foreground">Enter your actual commission</p>
                </div>
              </div>

              {/* Expected Close */}
              <div className="space-y-2">
                <Label htmlFor="expected_close">Expected Close Date</Label>
                <Input
                  id="expected_close"
                  type="date"
                  value={formData.expected_close}
                  onChange={(e) => setFormData({ ...formData, expected_close: e.target.value })}
                />
              </div>

              {/* Probability & Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="probability">Probability (%)</Label>
                  <Input
                    id="probability"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.probability}
                    onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
                  />
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
                  rows={4}
                  placeholder="Add any notes about this deal..."
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <Link to="/portal/crm">
                  <Button type="button" variant="ghost">Cancel</Button>
                </Link>
                <Button type="submit" disabled={createDeal.isPending}>
                  {createDeal.isPending ? "Creating..." : "Create Deal"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default NewDeal;
