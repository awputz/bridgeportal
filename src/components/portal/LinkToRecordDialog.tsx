import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, User, Search, Link2, Check, MapPin } from "lucide-react";
import { useCRMContacts, useCRMDeals } from "@/hooks/useCRM";
import { useLinkEmailToDeal, useLinkEmailToContact } from "@/hooks/useEmailLinks";
import { useDivision } from "@/contexts/DivisionContext";
import { cn } from "@/lib/utils";

interface LinkToRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  emailId: string;
  threadId: string;
  emailSubject?: string;
  emailFrom?: string;
  linkedDealIds?: string[];
  linkedContactIds?: string[];
}

export function LinkToRecordDialog({
  open,
  onOpenChange,
  emailId,
  threadId,
  emailSubject,
  emailFrom,
  linkedDealIds = [],
  linkedContactIds = [],
}: LinkToRecordDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"deals" | "contacts">("deals");
  const { division } = useDivision();

  const { data: deals, isLoading: isLoadingDeals } = useCRMDeals(division);
  const { data: contacts, isLoading: isLoadingContacts } = useCRMContacts(division);
  const { mutate: linkToDeal, isPending: isLinkingDeal } = useLinkEmailToDeal();
  const { mutate: linkToContact, isPending: isLinkingContact } = useLinkEmailToContact();

  const isLoadingCRM = isLoadingDeals || isLoadingContacts;

  const filteredDeals = (deals || []).filter((deal) =>
    deal.property_address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.neighborhood?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredContacts = (contacts || []).filter((contact) =>
    contact.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLinkDeal = (dealId: string) => {
    linkToDeal(
      { emailId, threadId, dealId, emailSubject, emailFrom },
      { onSuccess: () => onOpenChange(false) }
    );
  };

  const handleLinkContact = (contactId: string) => {
    linkToContact(
      { emailId, threadId, contactId, emailSubject, emailFrom },
      { onSuccess: () => onOpenChange(false) }
    );
  };

  const formatCurrency = (value: number | null) => {
    if (!value) return null;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Link Email to Record
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search deals or contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "deals" | "contacts")}>
            <TabsList className="w-full">
              <TabsTrigger value="deals" className="flex-1 gap-2">
                <Building2 className="h-4 w-4" />
                Deals ({filteredDeals.length})
              </TabsTrigger>
              <TabsTrigger value="contacts" className="flex-1 gap-2">
                <User className="h-4 w-4" />
                Contacts ({filteredContacts.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="deals" className="mt-3">
              <ScrollArea className="h-[300px]">
                {isLoadingCRM ? (
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : filteredDeals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Building2 className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No deals found</p>
                  </div>
                ) : (
                  <div className="space-y-1 pr-2">
                    {filteredDeals.map((deal) => {
                      const isLinked = linkedDealIds.includes(deal.id);
                      return (
                        <button
                          key={deal.id}
                          onClick={() => !isLinked && handleLinkDeal(deal.id)}
                          disabled={isLinked || isLinkingDeal}
                          className={cn(
                            "w-full p-3 rounded-lg text-left transition-colors",
                            isLinked
                              ? "bg-primary/10 cursor-default"
                              : "hover:bg-muted/50"
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                                <span className="text-sm font-medium truncate">
                                  {deal.property_address}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                {deal.neighborhood && <span>{deal.neighborhood}</span>}
                                {deal.value && (
                                  <Badge variant="secondary" className="text-xs">
                                    {formatCurrency(deal.value)}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {isLinked && (
                              <Check className="h-4 w-4 text-primary flex-shrink-0" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="contacts" className="mt-3">
              <ScrollArea className="h-[300px]">
                {isLoadingCRM ? (
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : filteredContacts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <User className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No contacts found</p>
                  </div>
                ) : (
                  <div className="space-y-1 pr-2">
                    {filteredContacts.map((contact) => {
                      const isLinked = linkedContactIds.includes(contact.id);
                      return (
                        <button
                          key={contact.id}
                          onClick={() => !isLinked && handleLinkContact(contact.id)}
                          disabled={isLinked || isLinkingContact}
                          className={cn(
                            "w-full p-3 rounded-lg text-left transition-colors",
                            isLinked
                              ? "bg-primary/10 cursor-default"
                              : "hover:bg-muted/50"
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                  <span className="text-xs font-medium">
                                    {contact.full_name?.charAt(0).toUpperCase() || "?"}
                                  </span>
                                </div>
                                <span className="text-sm font-medium truncate">
                                  {contact.full_name}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground ml-8">
                                {contact.company && <span>{contact.company}</span>}
                                {contact.email && !contact.company && <span>{contact.email}</span>}
                              </div>
                            </div>
                            {isLinked && (
                              <Check className="h-4 w-4 text-primary flex-shrink-0" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
