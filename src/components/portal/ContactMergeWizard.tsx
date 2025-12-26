import { useState, useMemo } from "react";
import {
  GitMerge,
  Check,
  X,
  ChevronRight,
  AlertTriangle,
  User,
  Mail,
  Phone,
  Building2,
  Tag,
} from "lucide-react";
import { CRMContact, useUpdateContact, useDeleteContact } from "@/hooks/useCRM";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ContactMergeWizardProps {
  contacts: CRMContact[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMergeComplete?: () => void;
}

interface MergeField {
  key: keyof CRMContact;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const mergeFields: MergeField[] = [
  { key: "full_name", label: "Name", icon: User },
  { key: "email", label: "Email", icon: Mail },
  { key: "phone", label: "Phone", icon: Phone },
  { key: "company", label: "Company", icon: Building2 },
  { key: "address", label: "Address", icon: Building2 },
  { key: "contact_type", label: "Type", icon: Tag },
  { key: "notes", label: "Notes", icon: Tag },
];

// Detect potential duplicates based on email or similar names
export function findDuplicateContacts(contacts: CRMContact[]): CRMContact[][] {
  const duplicateGroups: CRMContact[][] = [];
  const processed = new Set<string>();

  for (let i = 0; i < contacts.length; i++) {
    if (processed.has(contacts[i].id)) continue;

    const group: CRMContact[] = [contacts[i]];
    processed.add(contacts[i].id);

    for (let j = i + 1; j < contacts.length; j++) {
      if (processed.has(contacts[j].id)) continue;

      // Check for exact email match
      if (
        contacts[i].email &&
        contacts[j].email &&
        contacts[i].email.toLowerCase() === contacts[j].email.toLowerCase()
      ) {
        group.push(contacts[j]);
        processed.add(contacts[j].id);
        continue;
      }

      // Check for similar names (Levenshtein distance or simple similarity)
      const nameA = contacts[i].full_name.toLowerCase().trim();
      const nameB = contacts[j].full_name.toLowerCase().trim();

      if (areSimilarNames(nameA, nameB)) {
        group.push(contacts[j]);
        processed.add(contacts[j].id);
      }
    }

    if (group.length > 1) {
      duplicateGroups.push(group);
    }
  }

  return duplicateGroups;
}

function areSimilarNames(a: string, b: string): boolean {
  // Exact match
  if (a === b) return true;

  // One contains the other
  if (a.includes(b) || b.includes(a)) return true;

  // Same words in different order
  const wordsA = a.split(/\s+/).sort();
  const wordsB = b.split(/\s+/).sort();
  if (wordsA.join(" ") === wordsB.join(" ")) return true;

  // Simple similarity check (shared words)
  const sharedWords = wordsA.filter((w) => wordsB.includes(w));
  if (sharedWords.length >= 1 && wordsA.length <= 3 && wordsB.length <= 3) {
    return sharedWords.length >= Math.min(wordsA.length, wordsB.length) / 2;
  }

  return false;
}

export function ContactMergeWizard({
  contacts,
  open,
  onOpenChange,
  onMergeComplete,
}: ContactMergeWizardProps) {
  const [step, setStep] = useState<"select" | "confirm">("select");
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>({});
  const [primaryContactId, setPrimaryContactId] = useState<string>(contacts[0]?.id || "");

  const updateContact = useUpdateContact();
  const deleteContact = useDeleteContact();

  // Initialize selected values with primary contact's data
  useMemo(() => {
    if (contacts.length > 0 && primaryContactId) {
      const primary = contacts.find((c) => c.id === primaryContactId);
      if (primary) {
        const initial: Record<string, string> = {};
        mergeFields.forEach((field) => {
          const value = primary[field.key];
          if (value) {
            initial[field.key] = typeof value === "object" ? JSON.stringify(value) : String(value);
          }
        });
        setSelectedValues(initial);
      }
    }
  }, [contacts, primaryContactId]);

  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const getFieldValue = (contact: CRMContact, key: keyof CRMContact): string => {
    const value = contact[key];
    if (!value) return "";
    if (Array.isArray(value)) return value.join(", ");
    return String(value);
  };

  const handleSelectValue = (field: keyof CRMContact, value: string) => {
    setSelectedValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleMerge = async () => {
    // Find the primary contact and merge data into it
    const primary = contacts.find((c) => c.id === primaryContactId);
    if (!primary) return;

    // Build merged contact data
    const mergedData: Partial<CRMContact> = {
      id: primaryContactId,
    };

    mergeFields.forEach((field) => {
      if (selectedValues[field.key]) {
        (mergedData as any)[field.key] = selectedValues[field.key];
      }
    });

    // Merge tags from all contacts
    const allTags = new Set<string>();
    contacts.forEach((c) => {
      c.tags?.forEach((tag) => allTags.add(tag));
    });
    mergedData.tags = Array.from(allTags);

    try {
      // Update primary contact with merged data
      await updateContact.mutateAsync(mergedData as any);

      // Delete other contacts
      const otherContacts = contacts.filter((c) => c.id !== primaryContactId);
      for (const contact of otherContacts) {
        await deleteContact.mutateAsync(contact.id);
      }

      toast.success(`Merged ${contacts.length} contacts`);
      onMergeComplete?.();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to merge contacts");
    }
  };

  if (contacts.length < 2) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitMerge className="h-5 w-5 text-primary" />
            Merge Duplicate Contacts
          </DialogTitle>
          <DialogDescription>
            {step === "select"
              ? "Select which information to keep from each contact"
              : "Review and confirm the merged contact"}
          </DialogDescription>
        </DialogHeader>

        {step === "select" && (
          <div className="space-y-6 py-4">
            {/* Contact headers */}
            <div className="grid grid-cols-[100px_1fr_1fr] gap-4 items-center">
              <div className="text-xs font-medium text-muted-foreground uppercase">Field</div>
              {contacts.map((contact) => (
                <div key={contact.id} className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">
                      {getInitials(contact.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{contact.full_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{contact.email || "No email"}</p>
                  </div>
                  {contact.id === primaryContactId && (
                    <Badge variant="outline" className="text-xs bg-primary/10 text-primary">
                      Primary
                    </Badge>
                  )}
                </div>
              ))}
            </div>

            <Separator />

            {/* Field selection */}
            {mergeFields.map((field) => {
              const values = contacts.map((c) => getFieldValue(c, field.key));
              const uniqueValues = [...new Set(values.filter(Boolean))];

              if (uniqueValues.length === 0) return null;

              const Icon = field.icon;

              return (
                <div key={field.key} className="grid grid-cols-[100px_1fr_1fr] gap-4 items-start">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
                    <Icon className="h-4 w-4" />
                    {field.label}
                  </div>
                  {contacts.map((contact) => {
                    const value = getFieldValue(contact, field.key);
                    const isSelected = selectedValues[field.key] === value;

                    return (
                      <button
                        key={contact.id}
                        onClick={() => value && handleSelectValue(field.key, value)}
                        disabled={!value}
                        className={cn(
                          "p-3 rounded-lg border text-left text-sm transition-all",
                          value ? "hover:border-primary cursor-pointer" : "opacity-50 cursor-not-allowed",
                          isSelected
                            ? "border-primary bg-primary/10"
                            : "border-border"
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className={cn("break-words", !value && "text-muted-foreground")}>
                            {value || "Empty"}
                          </span>
                          {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })}

            {/* Primary contact selection */}
            <Separator />
            <div className="space-y-3">
              <Label className="text-sm font-medium">Keep as primary contact</Label>
              <RadioGroup value={primaryContactId} onValueChange={setPrimaryContactId}>
                <div className="grid grid-cols-2 gap-3">
                  {contacts.map((contact) => (
                    <div key={contact.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={contact.id} id={contact.id} />
                      <Label htmlFor={contact.id} className="text-sm cursor-pointer">
                        {contact.full_name}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
              <p className="text-xs text-muted-foreground">
                Other contacts will be deleted after merging
              </p>
            </div>
          </div>
        )}

        {step === "confirm" && (
          <div className="space-y-4 py-4">
            <div className="glass-card p-4 space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/20 text-primary text-lg">
                    {getInitials(selectedValues.full_name || contacts[0].full_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedValues.full_name || contacts[0].full_name}</h3>
                  <p className="text-sm text-muted-foreground">Merged contact</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                {mergeFields.map((field) => {
                  const value = selectedValues[field.key];
                  if (!value) return null;

                  const Icon = field.icon;
                  return (
                    <div key={field.key} className="flex items-start gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">{field.label}</p>
                        <p>{value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-500">This action cannot be undone</p>
                <p className="text-muted-foreground">
                  {contacts.length - 1} contact{contacts.length - 1 > 1 ? "s" : ""} will be deleted
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4">
          {step === "select" ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={() => setStep("confirm")}>
                Review Merge
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setStep("select")}>
                Back
              </Button>
              <Button
                onClick={handleMerge}
                disabled={updateContact.isPending || deleteContact.isPending}
              >
                {updateContact.isPending || deleteContact.isPending ? "Merging..." : "Merge Contacts"}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
