import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Building2, User, X, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LinkedRecord {
  type: "deal" | "contact";
  id: string;
  label: string;
  sublabel?: string;
}

interface LinkToRecordPickerProps {
  linkedDealId?: string | null;
  linkedContactId?: string | null;
  onLinkDeal: (dealId: string) => void;
  onLinkContact: (contactId: string) => void;
  onUnlink: () => void;
}

export function LinkToRecordPicker({
  linkedDealId,
  linkedContactId,
  onLinkDeal,
  onLinkContact,
  onUnlink,
}: LinkToRecordPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"deals" | "contacts">("deals");

  // Fetch deals for search
  const { data: deals } = useQuery({
    queryKey: ["crm-deals-search", searchQuery],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      let query = supabase
        .from("crm_deals")
        .select("id, property_address, deal_type, value")
        .eq("agent_id", user.id)
        .eq("is_active", true)
        .order("updated_at", { ascending: false })
        .limit(20);

      if (searchQuery) {
        query = query.ilike("property_address", `%${searchQuery}%`);
      }

      const { data } = await query;
      return data || [];
    },
  });

  // Fetch contacts for search
  const { data: contacts } = useQuery({
    queryKey: ["crm-contacts-search", searchQuery],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      let query = supabase
        .from("crm_contacts")
        .select("id, full_name, company, email")
        .eq("agent_id", user.id)
        .eq("is_active", true)
        .order("updated_at", { ascending: false })
        .limit(20);

      if (searchQuery) {
        query = query.or(`full_name.ilike.%${searchQuery}%,company.ilike.%${searchQuery}%`);
      }

      const { data } = await query;
      return data || [];
    },
  });

  // Fetch linked record details
  const { data: linkedDeal } = useQuery({
    queryKey: ["linked-deal", linkedDealId],
    queryFn: async () => {
      if (!linkedDealId) return null;
      const { data } = await supabase
        .from("crm_deals")
        .select("id, property_address, deal_type")
        .eq("id", linkedDealId)
        .single();
      return data;
    },
    enabled: !!linkedDealId,
  });

  const { data: linkedContact } = useQuery({
    queryKey: ["linked-contact", linkedContactId],
    queryFn: async () => {
      if (!linkedContactId) return null;
      const { data } = await supabase
        .from("crm_contacts")
        .select("id, full_name, company")
        .eq("id", linkedContactId)
        .single();
      return data;
    },
    enabled: !!linkedContactId,
  });

  const currentLinkedRecord: LinkedRecord | null = useMemo(() => {
    if (linkedDeal) {
      return {
        type: "deal",
        id: linkedDeal.id,
        label: linkedDeal.property_address,
        sublabel: linkedDeal.deal_type,
      };
    }
    if (linkedContact) {
      return {
        type: "contact",
        id: linkedContact.id,
        label: linkedContact.full_name,
        sublabel: linkedContact.company || undefined,
      };
    }
    return null;
  }, [linkedDeal, linkedContact]);

  const formatCurrency = (value: number | null) => {
    if (!value) return "";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Link2 className="h-4 w-4" />
        Link to BRIDGE Record
      </div>

      {currentLinkedRecord ? (
        <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
          {currentLinkedRecord.type === "deal" ? (
            <Building2 className="h-4 w-4 text-muted-foreground" />
          ) : (
            <User className="h-4 w-4 text-muted-foreground" />
          )}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{currentLinkedRecord.label}</div>
            {currentLinkedRecord.sublabel && (
              <div className="text-xs text-muted-foreground">{currentLinkedRecord.sublabel}</div>
            )}
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onUnlink}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "deals" | "contacts")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="deals">Deals</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
          </TabsList>

          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab === "deals" ? "Search deals..." : "Search contacts..."}
              className="pl-9"
            />
          </div>

          <TabsContent value="deals" className="mt-2">
            <ScrollArea className="h-48">
              <div className="space-y-1">
                {deals?.map((deal) => (
                  <button
                    key={deal.id}
                    type="button"
                    onClick={() => onLinkDeal(deal.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-2 rounded-md text-left",
                      "hover:bg-accent transition-colors"
                    )}
                  >
                    <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{deal.property_address}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="secondary" className="text-xs">
                          {deal.deal_type}
                        </Badge>
                        {deal.value && <span>{formatCurrency(deal.value)}</span>}
                      </div>
                    </div>
                  </button>
                ))}
                {deals?.length === 0 && (
                  <div className="text-center text-sm text-muted-foreground py-4">
                    No deals found
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="contacts" className="mt-2">
            <ScrollArea className="h-48">
              <div className="space-y-1">
                {contacts?.map((contact) => (
                  <button
                    key={contact.id}
                    type="button"
                    onClick={() => onLinkContact(contact.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-2 rounded-md text-left",
                      "hover:bg-accent transition-colors"
                    )}
                  >
                    <User className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{contact.full_name}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {contact.company || contact.email}
                      </div>
                    </div>
                  </button>
                ))}
                {contacts?.length === 0 && (
                  <div className="text-center text-sm text-muted-foreground py-4">
                    No contacts found
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
