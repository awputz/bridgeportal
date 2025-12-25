import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Trash2, Phone, Mail, Calendar, DollarSign, MapPin, User, Building2 } from "lucide-react";
import { useCRMDeal, useUpdateDeal, useDeleteDeal, useDealStages, useCRMActivities, useCreateActivity } from "@/hooks/useCRM";
import { useDivision } from "@/contexts/DivisionContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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

const DealDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { division } = useDivision();

  const { data: deal, isLoading } = useCRMDeal(id || "");
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
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pb-24 md:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <Skeleton className="h-10 w-32 mb-6" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen pb-24 md:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 text-center">
          <h1 className="text-2xl font-light text-foreground mb-4">Deal not found</h1>
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

  return (
    <div className="min-h-screen pb-24 md:pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
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
                      <Input
                        value={formData.property_address || ""}
                        onChange={(e) => setFormData({ ...formData, property_address: e.target.value })}
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
