import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, FileText, Search, X } from "lucide-react";
import { useCRMContacts } from "@/hooks/useCRM";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AddRecipientsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignId: string | null;
  onSuccess?: () => void;
}

export function AddRecipientsDialog({
  open,
  onOpenChange,
  campaignId,
  onSuccess,
}: AddRecipientsDialogProps) {
  const [tab, setTab] = useState<'crm' | 'manual'>('crm');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [manualEmails, setManualEmails] = useState('');
  const [validatedEmails, setValidatedEmails] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const { data: contacts, isLoading: isLoadingContacts } = useCRMContacts();

  const filteredContacts = contacts?.filter(contact => {
    if (!contact.email) return false;
    const query = searchQuery.toLowerCase();
    return (
      contact.full_name.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query) ||
      contact.company?.toLowerCase().includes(query)
    );
  }) || [];

  const handleToggleContact = (contactId: string) => {
    setSelectedContacts(prev => {
      const next = new Set(prev);
      if (next.has(contactId)) {
        next.delete(contactId);
      } else {
        next.add(contactId);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedContacts.size === filteredContacts.length) {
      setSelectedContacts(new Set());
    } else {
      setSelectedContacts(new Set(filteredContacts.map(c => c.id)));
    }
  };

  const validateEmails = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emails = manualEmails
      .split(/[,\n\s]+/)
      .map(e => e.trim().toLowerCase())
      .filter(e => e && emailRegex.test(e));
    
    // Remove duplicates
    const uniqueEmails = [...new Set(emails)];
    setValidatedEmails(uniqueEmails);
  };

  const removeValidatedEmail = (email: string) => {
    setValidatedEmails(prev => prev.filter(e => e !== email));
  };

  const handleAdd = async () => {
    if (!campaignId) return;
    
    setIsAdding(true);
    
    try {
      let recipients: { email: string; name?: string; contact_id?: string }[] = [];

      if (tab === 'crm') {
        recipients = contacts
          ?.filter(c => selectedContacts.has(c.id) && c.email)
          .map(c => ({
            email: c.email!,
            name: c.full_name,
            contact_id: c.id,
          })) || [];
      } else {
        recipients = validatedEmails.map(email => ({ email }));
      }

      if (recipients.length === 0) return;

      // Insert recipients
      const { error: insertError } = await supabase
        .from('email_campaign_recipients')
        .insert(
          recipients.map(r => ({
            campaign_id: campaignId,
            email: r.email,
            name: r.name || null,
            contact_id: r.contact_id || null,
            status: 'pending',
          }))
        );

      if (insertError) throw insertError;

      // Update campaign recipient count
      const { error: updateError } = await supabase
        .from('email_campaigns')
        .update({ 
          total_recipients: recipients.length,
          updated_at: new Date().toISOString(),
        })
        .eq('id', campaignId);

      if (updateError) throw updateError;

      toast.success(`Added ${recipients.length} recipient(s)`);
      onOpenChange(false);
      onSuccess?.();
      
      // Reset state
      setSelectedContacts(new Set());
      setManualEmails('');
      setValidatedEmails([]);
    } catch (error) {
      console.error('Add recipients error:', error);
      toast.error('Failed to add recipients');
    } finally {
      setIsAdding(false);
    }
  };

  const recipientCount = tab === 'crm' ? selectedContacts.size : validatedEmails.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Recipients</DialogTitle>
          <DialogDescription>
            Import contacts from your CRM or enter email addresses manually
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v) => setTab(v as 'crm' | 'manual')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="crm" className="gap-2">
              <Users className="h-4 w-4" />
              From CRM
            </TabsTrigger>
            <TabsTrigger value="manual" className="gap-2">
              <FileText className="h-4 w-4" />
              Manual Entry
            </TabsTrigger>
          </TabsList>

          <TabsContent value="crm" className="mt-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Select All */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={filteredContacts.length > 0 && selectedContacts.size === filteredContacts.length}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm">Select all</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {selectedContacts.size} selected
              </span>
            </div>

            {/* Contact List */}
            <ScrollArea className="h-[280px] border rounded-lg">
              {isLoadingContacts ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : filteredContacts.length > 0 ? (
                <div className="p-2 space-y-1">
                  {filteredContacts.map(contact => (
                    <div
                      key={contact.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleToggleContact(contact.id)}
                    >
                      <Checkbox checked={selectedContacts.has(contact.id)} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{contact.full_name}</p>
                        <p className="text-xs text-muted-foreground truncate">{contact.email}</p>
                      </div>
                      {contact.company && (
                        <Badge variant="outline" className="text-xs">
                          {contact.company}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Users className="h-10 w-10 text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {searchQuery ? 'No contacts found' : 'No contacts with email'}
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="manual" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emails">Email Addresses</Label>
              <Textarea
                id="emails"
                value={manualEmails}
                onChange={e => setManualEmails(e.target.value)}
                placeholder="Enter email addresses, separated by commas or new lines..."
                rows={5}
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Separate multiple emails with commas or new lines
                </p>
                <Button size="sm" variant="secondary" onClick={validateEmails}>
                  Validate
                </Button>
              </div>
            </div>

            {/* Validated Emails */}
            {validatedEmails.length > 0 && (
              <div className="space-y-2">
                <Label>{validatedEmails.length} valid email(s)</Label>
                <div className="flex flex-wrap gap-2 max-h-[150px] overflow-auto p-2 border rounded-lg">
                  {validatedEmails.map(email => (
                    <Badge key={email} variant="secondary" className="gap-1">
                      {email}
                      <button
                        onClick={() => removeValidatedEmail(email)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isAdding}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={recipientCount === 0 || isAdding}>
            {isAdding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              `Add ${recipientCount} Recipient${recipientCount !== 1 ? 's' : ''}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
