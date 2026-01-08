import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Trash2, Phone, Mail, Building2, MapPin, Tag, Calendar } from "lucide-react";
import { isValidUUID } from "@/lib/errorHandler";
import { useCRMContact, useUpdateContact, useDeleteContact, useCRMDeals, useCRMActivities, useCreateActivity } from "@/hooks/useCRM";
import { RelatedEventsCard } from "@/components/calendar/RelatedEventsCard";
import { useLinkedEventsForContact } from "@/hooks/useLinkedCalendarEvents";
import { QueryErrorState } from "@/components/ui/QueryErrorState";
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

const contactTypes = [
  { value: "owner", label: "Owner" },
  { value: "buyer", label: "Buyer" },
  { value: "tenant", label: "Tenant" },
  { value: "landlord", label: "Landlord" },
  { value: "investor", label: "Investor" },
  { value: "attorney", label: "Attorney" },
  { value: "lender", label: "Lender" },
  { value: "broker", label: "Broker" },
  { value: "prospect", label: "Prospect" },
  { value: "other", label: "Other" },
];

const sourceOptions = [
  { value: "referral", label: "Referral" },
  { value: "cold-call", label: "Cold Call" },
  { value: "website", label: "Website" },
  { value: "open-house", label: "Open House" },
  { value: "networking", label: "Networking" },
  { value: "repeat-client", label: "Repeat Client" },
  { value: "marketing", label: "Marketing" },
  { value: "other", label: "Other" },
];

const ContactDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { division } = useDivision();

  // Validate UUID before making query
  useEffect(() => {
    if (id && !isValidUUID(id)) {
      toast.error("Invalid contact ID format");
      navigate("/portal/contacts");
    }
  }, [id, navigate]);

  const { data: contact, isLoading, error, refetch } = useCRMContact(id || "");
  const { data: allDeals } = useCRMDeals(division);
  const { data: activities } = useCRMActivities({ contactId: id, limit: 10 });
  const { data: linkedEvents, isLoading: isLoadingEvents } = useLinkedEventsForContact(id);
  const updateContact = useUpdateContact();
  const deleteContact = useDeleteContact();
  const createActivity = useCreateActivity();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Filter deals for this contact
  const contactDeals = allDeals?.filter(d => d.contact_id === id) || [];

  const handleEdit = () => {
    if (contact) {
      setFormData({
        full_name: contact.full_name,
        email: contact.email,
        phone: contact.phone,
        company: contact.company,
        contact_type: contact.contact_type,
        source: contact.source,
        address: contact.address,
        notes: contact.notes,
      });
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (!id) return;
    updateContact.mutate(
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
    deleteContact.mutate(id, {
      onSuccess: () => {
        navigate("/portal/crm");
      },
    });
  };

  const handleAddActivity = async (type: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !id) return;

    createActivity.mutate({
      agent_id: user.id,
      contact_id: id,
      deal_id: null,
      activity_type: type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} - ${contact?.full_name}`,
      description: null,
      due_date: null,
      completed_at: null,
      is_completed: false,
      division: contact?.division || 'investment-sales',
      priority: 'medium',
      reminder_at: null,
      recurring_pattern: null,
      is_all_day: false,
      category: type,
    });
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto page-content py-8 md:py-12">
          <Skeleton className="h-10 w-32 mb-6" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto page-content py-8 md:py-12">
          <QueryErrorState
            error={error}
            onRetry={() => refetch()}
            title="Unable to load contact"
          />
          <div className="flex justify-center mt-4">
            <Link to="/portal/contacts">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Contacts
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto page-content py-8 md:py-12 text-center">
          <h1 className="text-2xl font-light text-foreground mb-4">Contact not found</h1>
          <p className="text-muted-foreground mb-4">
            This contact may have been deleted or you don't have permission to view it.
          </p>
          <Link to="/portal/contacts">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Contacts
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto page-content py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center justify-between section-gap">
          <div className="flex items-center gap-4">
            <Link to="/portal/crm">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-light text-foreground">
                {contact.full_name}
              </h1>
              <p className="text-muted-foreground">
                {contact.company || contactTypes.find(t => t.value === contact.contact_type)?.label}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button onClick={handleSave} disabled={updateContact.isPending}>
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
                      <AlertDialogTitle>Delete Contact</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this contact? This will not delete associated deals.
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

        <div className="grid grid-gap lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 section-gap-sm">
            {/* Contact Info Card */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="font-light">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="list-gap-md">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label>Full Name *</Label>
                      <Input
                        value={formData.full_name || ""}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-grid">
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={formData.email || ""}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          type="tel"
                          value={formData.phone || ""}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="form-grid">
                      <div className="space-y-2">
                        <Label>Company</Label>
                        <Input
                          value={formData.company || ""}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select
                          value={formData.contact_type || "prospect"}
                          onValueChange={(v) => setFormData({ ...formData, contact_type: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {contactTypes.map((t) => (
                              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="form-grid">
                      <div className="space-y-2">
                        <Label>Source</Label>
                        <Select
                          value={formData.source || ""}
                          onValueChange={(v) => setFormData({ ...formData, source: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select source" />
                          </SelectTrigger>
                          <SelectContent>
                            {sourceOptions.map((s) => (
                              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Address</Label>
                        <Input
                          value={formData.address || ""}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                      </div>
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
                  <div className="list-gap-md">
                    {contact.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <a href={`mailto:${contact.email}`} className="text-foreground hover:underline">
                          {contact.email}
                        </a>
                      </div>
                    )}
                    {contact.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <a href={`tel:${contact.phone}`} className="text-foreground hover:underline">
                          {contact.phone}
                        </a>
                      </div>
                    )}
                    {contact.company && (
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                        <span className="text-foreground">{contact.company}</span>
                      </div>
                    )}
                    {contact.address && (
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <span className="text-foreground">{contact.address}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Tag className="h-5 w-5 text-muted-foreground" />
                      <Badge variant="outline">
                        {contactTypes.find(t => t.value === contact.contact_type)?.label || contact.contact_type}
                      </Badge>
                      {contact.source && (
                        <Badge variant="secondary">
                          {sourceOptions.find(s => s.value === contact.source)?.label || contact.source}
                        </Badge>
                      )}
                    </div>
                    {contact.notes && (
                      <div className="pt-4 border-t border-white/10">
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{contact.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Deals */}
            <Card className="glass-card border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-light">Associated Deals</CardTitle>
                <Link to={`/portal/crm/deals/new?contact=${id}`}>
                  <Button size="sm">New Deal</Button>
                </Link>
              </CardHeader>
              <CardContent>
                {contactDeals.length > 0 ? (
                  <div className="list-gap-sm">
                    {contactDeals.map((deal) => (
                      <Link
                        key={deal.id}
                        to={`/portal/crm/deals/${deal.id}`}
                        className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div>
                          <p className="text-sm font-light text-foreground">{deal.property_address}</p>
                          <p className="text-xs text-muted-foreground">
                            {deal.stage?.name} • {deal.value ? `$${deal.value.toLocaleString()}` : "No value"}
                          </p>
                        </div>
                        {deal.stage && (
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: deal.stage.color }}
                          />
                        )}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No deals yet</p>
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
                  <div className="list-gap-md">
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
          <div className="section-gap-sm">
            {/* Meeting History */}
            <RelatedEventsCard
              title="Meeting History"
              events={linkedEvents || []}
              isLoading={isLoadingEvents}
              emptyMessage="No meetings linked to this contact"
              onScheduleClick={() => navigate("/portal/calendar")}
            />

            {/* Quick Actions */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="font-light text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="list-gap-xs">
                {contact.phone && (
                  <a href={`tel:${contact.phone}`} className="block">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Phone className="h-4 w-4" />
                      Call
                    </Button>
                  </a>
                )}
                {contact.email && (
                  <a href={`mailto:${contact.email}`} className="block">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Button>
                  </a>
                )}
                <Link to={`/portal/crm/deals/new?contact=${id}`}>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Building2 className="h-4 w-4" />
                    Create Deal
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Contact Metadata */}
            <Card className="glass-card border-white/10">
              <CardContent className="pt-6 list-gap-sm text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span className="text-foreground">
                    {format(new Date(contact.created_at), "MMM d, yyyy")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated</span>
                  <span className="text-foreground">
                    {format(new Date(contact.updated_at), "MMM d, yyyy")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Division</span>
                  <span className="text-foreground capitalize">{contact.division}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deals</span>
                  <span className="text-foreground">{contactDeals.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetail;
