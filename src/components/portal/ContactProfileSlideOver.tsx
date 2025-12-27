import { useState } from "react";
import { format } from "date-fns";
import {
  X,
  Mail,
  Phone,
  Building2,
  MapPin,
  Tag,
  Calendar,
  Edit2,
  Trash2,
  ExternalLink,
  Linkedin,
  Clock,
  MoreHorizontal,
  Download,
  Globe,
  User2,
  Briefcase,
  Star,
  Ban,
} from "lucide-react";
import { CRMContact, useUpdateContact, useDeleteContact } from "@/hooks/useCRM";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { downloadVCard } from "@/lib/vcard";
import { ContactActivityTimeline } from "./ContactActivityTimeline";

interface ContactProfileSlideOverProps {
  contact: CRMContact | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContactDeleted?: () => void;
}

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

const preferredContactMethods = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "text", label: "Text" },
];

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    owner: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    buyer: "bg-green-500/20 text-green-400 border-green-500/30",
    tenant: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    landlord: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    investor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    attorney: "bg-red-500/20 text-red-400 border-red-500/30",
    lender: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    broker: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    prospect: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  };
  return colors[type] || colors.prospect;
};

export function ContactProfileSlideOver({
  contact,
  open,
  onOpenChange,
  onContactDeleted,
}: ContactProfileSlideOverProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editedContact, setEditedContact] = useState<Partial<CRMContact>>({});
  
  const updateContact = useUpdateContact();
  const deleteContact = useDeleteContact();

  if (!contact) return null;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getLastContactedStatus = () => {
    const dateToCheck = contact.last_contact_date || contact.updated_at;
    if (!dateToCheck) return { color: "text-muted-foreground", label: "Never contacted" };
    
    const daysSince = Math.floor(
      (Date.now() - new Date(dateToCheck).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSince < 7) {
      return { color: "text-green-400", label: `${daysSince === 0 ? 'Today' : `${daysSince}d ago`}`, bg: "bg-green-500/20" };
    } else if (daysSince < 30) {
      return { color: "text-yellow-400", label: `${daysSince}d ago`, bg: "bg-yellow-500/20" };
    } else {
      return { color: "text-red-400", label: `${daysSince}d ago`, bg: "bg-red-500/20" };
    }
  };

  const lastContacted = getLastContactedStatus();

  const handleStartEdit = () => {
    setEditedContact({
      full_name: contact.full_name,
      email: contact.email,
      phone: contact.phone,
      company: contact.company,
      contact_type: contact.contact_type,
      address: contact.address,
      notes: contact.notes,
      tags: contact.tags,
      title: contact.title,
      linkedin_url: contact.linkedin_url,
      secondary_email: contact.secondary_email,
      secondary_phone: contact.secondary_phone,
      assistant_name: contact.assistant_name,
      assistant_email: contact.assistant_email,
      assistant_phone: contact.assistant_phone,
      birthday: contact.birthday,
      preferred_contact_method: contact.preferred_contact_method,
      do_not_contact: contact.do_not_contact,
      relationship_score: contact.relationship_score,
      company_website: contact.company_website,
      portfolio_size: contact.portfolio_size,
      investor_profile: contact.investor_profile,
      street_address: contact.street_address,
      city: contact.city,
      state: contact.state,
      zip_code: contact.zip_code,
      country: contact.country,
    });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    updateContact.mutate(
      { id: contact.id, ...editedContact },
      {
        onSuccess: () => {
          setIsEditing(false);
          setEditedContact({});
        },
      }
    );
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContact({});
  };

  const handleDelete = () => {
    deleteContact.mutate(contact.id, {
      onSuccess: () => {
        onOpenChange(false);
        onContactDeleted?.();
      },
    });
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "email":
        if (contact.email) {
          window.location.href = `mailto:${contact.email}`;
        } else {
          toast.error("No email address available");
        }
        break;
      case "call":
        if (contact.phone) {
          window.location.href = `tel:${contact.phone}`;
        } else {
          toast.error("No phone number available");
        }
        break;
      case "vcard":
        downloadVCard({
          name: contact.full_name,
          email: contact.email || undefined,
          phone: contact.phone || undefined,
          title: contact.title || contact.contact_type,
          company: contact.company || undefined,
        });
        break;
      case "linkedin":
        if (contact.linkedin_url) {
          window.open(contact.linkedin_url, "_blank");
        }
        break;
    }
  };

  const renderRelationshipScore = (score: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < score / 2 ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30"
          )}
        />
      );
    }
    return <div className="flex gap-0.5">{stars}</div>;
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-0">
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-6 pb-16">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className={cn("text-xs", getTypeColor(contact.contact_type))}>
                  {contact.contact_type}
                </Badge>
                <Badge variant="outline" className={cn("text-xs", lastContacted.bg, lastContacted.color)}>
                  <Clock className="h-3 w-3 mr-1" />
                  {lastContacted.label}
                </Badge>
                {contact.do_not_contact && (
                  <Badge variant="outline" className="text-xs bg-red-500/20 text-red-400 border-red-500/30">
                    <Ban className="h-3 w-3 mr-1" />
                    DNC
                  </Badge>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleStartEdit}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Contact
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleQuickAction("vcard")}>
                    <Download className="h-4 w-4 mr-2" />
                    Download vCard
                  </DropdownMenuItem>
                  {contact.linkedin_url && (
                    <DropdownMenuItem onClick={() => handleQuickAction("linkedin")}>
                      <Linkedin className="h-4 w-4 mr-2" />
                      View LinkedIn
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Contact
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Avatar */}
            <div className="absolute -bottom-10 left-6">
              <Avatar className="h-20 w-20 border-4 border-background">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl font-medium">
                  {getInitials(contact.full_name)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Content */}
          <div className="pt-14 px-6 pb-6 space-y-6">
            {/* Name, Title, Company */}
            <div>
              {isEditing ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Full Name</Label>
                      <Input
                        value={editedContact.full_name || ""}
                        onChange={(e) => setEditedContact({ ...editedContact, full_name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={editedContact.title || ""}
                        onChange={(e) => setEditedContact({ ...editedContact, title: e.target.value })}
                        placeholder="e.g., Principal, Director"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Company</Label>
                      <Input
                        value={editedContact.company || ""}
                        onChange={(e) => setEditedContact({ ...editedContact, company: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Type</Label>
                      <Select
                        value={editedContact.contact_type}
                        onValueChange={(v) => setEditedContact({ ...editedContact, contact_type: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {contactTypes.map((t) => (
                            <SelectItem key={t.value} value={t.value}>
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold">{contact.full_name}</h2>
                  {contact.title && (
                    <p className="text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Briefcase className="h-4 w-4" />
                      {contact.title}
                    </p>
                  )}
                  {contact.company && (
                    <p className="text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Building2 className="h-4 w-4" />
                      {contact.company}
                    </p>
                  )}
                  {contact.relationship_score > 0 && (
                    <div className="mt-2">
                      {renderRelationshipScore(contact.relationship_score)}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Quick actions */}
            {!isEditing && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => handleQuickAction("email")}
                  disabled={!contact.email}
                >
                  <Mail className="h-4 w-4" />
                  Email
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => handleQuickAction("call")}
                  disabled={!contact.phone}
                >
                  <Phone className="h-4 w-4" />
                  Call
                </Button>
                {contact.linkedin_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => handleQuickAction("linkedin")}
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </Button>
                )}
              </div>
            )}

            <Separator />

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Contact Information
              </h3>
              
              {isEditing ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={editedContact.email || ""}
                        onChange={(e) => setEditedContact({ ...editedContact, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Secondary Email</Label>
                      <Input
                        type="email"
                        value={editedContact.secondary_email || ""}
                        onChange={(e) => setEditedContact({ ...editedContact, secondary_email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Phone</Label>
                      <Input
                        type="tel"
                        value={editedContact.phone || ""}
                        onChange={(e) => setEditedContact({ ...editedContact, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Secondary Phone</Label>
                      <Input
                        type="tel"
                        value={editedContact.secondary_phone || ""}
                        onChange={(e) => setEditedContact({ ...editedContact, secondary_phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>LinkedIn URL</Label>
                    <Input
                      value={editedContact.linkedin_url || ""}
                      onChange={(e) => setEditedContact({ ...editedContact, linkedin_url: e.target.value })}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div>
                    <Label>Company Website</Label>
                    <Input
                      value={editedContact.company_website || ""}
                      onChange={(e) => setEditedContact({ ...editedContact, company_website: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Birthday</Label>
                      <Input
                        type="date"
                        value={editedContact.birthday || ""}
                        onChange={(e) => setEditedContact({ ...editedContact, birthday: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Preferred Contact</Label>
                      <Select
                        value={editedContact.preferred_contact_method || "email"}
                        onValueChange={(v) => setEditedContact({ ...editedContact, preferred_contact_method: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {preferredContactMethods.map((m) => (
                            <SelectItem key={m.value} value={m.value}>
                              {m.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="do_not_contact"
                      checked={editedContact.do_not_contact || false}
                      onCheckedChange={(checked) => setEditedContact({ ...editedContact, do_not_contact: !!checked })}
                    />
                    <Label htmlFor="do_not_contact" className="text-sm">Do Not Contact</Label>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <Mail className="h-4 w-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Email</p>
                        <p>{contact.email}</p>
                      </div>
                    </a>
                  )}
                  {contact.secondary_email && (
                    <a
                      href={`mailto:${contact.secondary_email}`}
                      className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <Mail className="h-4 w-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Secondary Email</p>
                        <p>{contact.secondary_email}</p>
                      </div>
                    </a>
                  )}
                  {contact.phone && (
                    <a
                      href={`tel:${contact.phone}`}
                      className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <Phone className="h-4 w-4 text-green-400" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Phone</p>
                        <p>{contact.phone}</p>
                      </div>
                    </a>
                  )}
                  {contact.secondary_phone && (
                    <a
                      href={`tel:${contact.secondary_phone}`}
                      className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <Phone className="h-4 w-4 text-green-400" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Secondary Phone</p>
                        <p>{contact.secondary_phone}</p>
                      </div>
                    </a>
                  )}
                  {contact.linkedin_url && (
                    <a
                      href={contact.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center">
                        <Linkedin className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">LinkedIn</p>
                        <p>View Profile</p>
                      </div>
                    </a>
                  )}
                  {contact.company_website && (
                    <a
                      href={contact.company_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <Globe className="h-4 w-4 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Website</p>
                        <p className="truncate max-w-[200px]">{contact.company_website}</p>
                      </div>
                    </a>
                  )}
                  {contact.birthday && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-pink-400" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Birthday</p>
                        <p>{format(new Date(contact.birthday), "MMMM d")}</p>
                      </div>
                    </div>
                  )}
                  {(contact.street_address || contact.city || contact.address) && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-orange-400" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Address</p>
                        <p>
                          {contact.street_address || contact.address}
                          {contact.city && `, ${contact.city}`}
                          {contact.state && `, ${contact.state}`}
                          {contact.zip_code && ` ${contact.zip_code}`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Assistant Info */}
            {(contact.assistant_name || (isEditing)) && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Assistant
                  </h3>
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <Label>Assistant Name</Label>
                        <Input
                          value={editedContact.assistant_name || ""}
                          onChange={(e) => setEditedContact({ ...editedContact, assistant_name: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Assistant Email</Label>
                          <Input
                            type="email"
                            value={editedContact.assistant_email || ""}
                            onChange={(e) => setEditedContact({ ...editedContact, assistant_email: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Assistant Phone</Label>
                          <Input
                            type="tel"
                            value={editedContact.assistant_phone || ""}
                            onChange={(e) => setEditedContact({ ...editedContact, assistant_phone: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User2 className="h-4 w-4 text-muted-foreground" />
                        <span>{contact.assistant_name}</span>
                      </div>
                      {contact.assistant_email && (
                        <a href={`mailto:${contact.assistant_email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                          <Mail className="h-3 w-3" />
                          {contact.assistant_email}
                        </a>
                      )}
                      {contact.assistant_phone && (
                        <a href={`tel:${contact.assistant_phone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                          <Phone className="h-3 w-3" />
                          {contact.assistant_phone}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Investor Profile (for investor contacts) */}
            {(contact.contact_type === "investor" || contact.portfolio_size || contact.investor_profile) && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Investor Profile
                  </h3>
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <Label>Portfolio Size ($)</Label>
                        <Input
                          type="number"
                          value={editedContact.portfolio_size || ""}
                          onChange={(e) => setEditedContact({ ...editedContact, portfolio_size: parseFloat(e.target.value) || null })}
                          placeholder="Total portfolio value"
                        />
                      </div>
                      <div>
                        <Label>Investor Profile</Label>
                        <Textarea
                          value={editedContact.investor_profile || ""}
                          onChange={(e) => setEditedContact({ ...editedContact, investor_profile: e.target.value })}
                          rows={3}
                          placeholder="Investment preferences, criteria, etc."
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {contact.portfolio_size && (
                        <p className="text-sm">
                          <span className="text-muted-foreground">Portfolio Size:</span>{" "}
                          ${contact.portfolio_size.toLocaleString()}
                        </p>
                      )}
                      {contact.investor_profile && (
                        <p className="text-sm whitespace-pre-wrap">{contact.investor_profile}</p>
                      )}
                      {contact.preferred_asset_types && contact.preferred_asset_types.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {contact.preferred_asset_types.map((type) => (
                            <Badge key={type} variant="secondary" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {contact.target_markets && contact.target_markets.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {contact.target_markets.map((market) => (
                            <Badge key={market} variant="outline" className="text-xs">
                              {market}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Tags */}
            {(contact.tags?.length > 0 || isEditing) && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {contact.tags?.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        <Tag className="h-3 w-3" />
                        {tag}
                      </Badge>
                    ))}
                    {contact.tags?.length === 0 && !isEditing && (
                      <p className="text-muted-foreground text-sm">No tags</p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Notes */}
            <Separator />
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Notes
              </h3>
              {isEditing ? (
                <Textarea
                  value={editedContact.notes || ""}
                  onChange={(e) => setEditedContact({ ...editedContact, notes: e.target.value })}
                  rows={4}
                  placeholder="Add notes..."
                />
              ) : (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {contact.notes || "No notes"}
                </p>
              )}
            </div>

            {/* Activity Timeline */}
            {!isEditing && (
              <>
                <Separator />
                <ContactActivityTimeline contactId={contact.id} />
              </>
            )}

            {/* Edit Actions */}
            {isEditing && (
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1" onClick={handleCancelEdit}>
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSaveEdit}
                  disabled={updateContact.isPending}
                >
                  {updateContact.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}

            {/* Meta info */}
            {!isEditing && (
              <div className="pt-4 text-xs text-muted-foreground">
                <p>Created {format(new Date(contact.created_at), "MMM d, yyyy")}</p>
                {contact.updated_at && (
                  <p>Updated {format(new Date(contact.updated_at), "MMM d, yyyy")}</p>
                )}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contact</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {contact.full_name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}