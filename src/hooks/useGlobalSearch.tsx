import { useMemo } from "react";
import { useCRMContacts, useCRMDeals } from "@/hooks/useCRM";
import { useAgentTemplates } from "@/hooks/useAgentTemplates";
import { useDivision } from "@/contexts/DivisionContext";

export interface SearchResult {
  id: string;
  type: "contact" | "deal" | "template" | "page";
  title: string;
  subtitle?: string;
  path: string;
  division?: string;
}

// Fuzzy match scoring - simple substring match with position weighting
const fuzzyScore = (query: string, target: string): number => {
  const lowerQuery = query.toLowerCase();
  const lowerTarget = target.toLowerCase();
  
  if (lowerTarget === lowerQuery) return 100;
  if (lowerTarget.startsWith(lowerQuery)) return 80;
  if (lowerTarget.includes(lowerQuery)) return 60;
  
  // Check if all characters exist in order
  let queryIndex = 0;
  let score = 0;
  for (let i = 0; i < lowerTarget.length && queryIndex < lowerQuery.length; i++) {
    if (lowerTarget[i] === lowerQuery[queryIndex]) {
      score += 10;
      queryIndex++;
    }
  }
  return queryIndex === lowerQuery.length ? score : 0;
};

const portalPages = [
  { id: "dashboard", title: "Dashboard", path: "/portal" },
  { id: "crm", title: "CRM", path: "/portal/crm" },
  { id: "contacts", title: "Contacts", path: "/portal/contacts" },
  { id: "tasks", title: "Tasks", path: "/portal/tasks" },
  { id: "notes", title: "Notes", path: "/portal/notes" },
  { id: "mail", title: "Mail", path: "/portal/mail" },
  { id: "calendar", title: "Calendar", path: "/portal/calendar" },
  { id: "drive", title: "Drive", path: "/portal/drive" },
  { id: "ai", title: "AI Assistant", path: "/portal/ai" },
  { id: "templates", title: "Templates", path: "/portal/templates" },
  { id: "generators", title: "Generators", path: "/portal/generators" },
  { id: "calculators", title: "Calculators", path: "/portal/calculators" },
  { id: "tools", title: "External Tools", path: "/portal/tools" },
  { id: "resources", title: "Resources", path: "/portal/resources" },
  { id: "requests", title: "Requests", path: "/portal/requests" },
  { id: "my-transactions", title: "My Transactions", path: "/portal/my-transactions" },
  { id: "my-commissions", title: "My Earnings", path: "/portal/my-commissions" },
  { id: "profile", title: "Profile", path: "/portal/profile" },
  { id: "directory", title: "Directory", path: "/portal/directory" },
  { id: "company", title: "Company Hub", path: "/portal/company" },
  { id: "announcements", title: "Announcements", path: "/portal/announcements" },
];

export const useGlobalSearch = (query: string, options?: { limit?: number }) => {
  const { division } = useDivision();
  const { data: contacts } = useCRMContacts(division);
  const { data: deals } = useCRMDeals(division);
  const { data: templates } = useAgentTemplates(division);
  
  const limit = options?.limit ?? 10;

  const results = useMemo(() => {
    if (!query || query.length < 2) return [];

    const allResults: (SearchResult & { score: number })[] = [];

    // Search contacts
    contacts?.forEach(contact => {
      const nameScore = fuzzyScore(query, contact.full_name);
      const companyScore = contact.company ? fuzzyScore(query, contact.company) : 0;
      const emailScore = contact.email ? fuzzyScore(query, contact.email) : 0;
      const maxScore = Math.max(nameScore, companyScore, emailScore);
      
      if (maxScore > 0) {
        allResults.push({
          id: contact.id,
          type: "contact",
          title: contact.full_name,
          subtitle: contact.company || contact.email || undefined,
          path: `/portal/crm/contacts/${contact.id}`,
          division: contact.division,
          score: maxScore,
        });
      }
    });

    // Search deals
    deals?.forEach(deal => {
      const addressScore = fuzzyScore(query, deal.property_address);
      const contactScore = deal.contact?.full_name ? fuzzyScore(query, deal.contact.full_name) : 0;
      const maxScore = Math.max(addressScore, contactScore);
      
      if (maxScore > 0) {
        allResults.push({
          id: deal.id,
          type: "deal",
          title: deal.property_address,
          subtitle: deal.contact?.full_name || deal.deal_type,
          path: `/portal/crm/deals/${deal.id}`,
          division: deal.division,
          score: maxScore,
        });
      }
    });

    // Search templates
    templates?.forEach(template => {
      const nameScore = fuzzyScore(query, template.name);
      
      if (nameScore > 0) {
        allResults.push({
          id: template.id,
          type: "template",
          title: template.name,
          subtitle: template.division,
          path: template.file_url,
          division: template.division,
          score: nameScore,
        });
      }
    });

    // Search pages
    portalPages.forEach(page => {
      const score = fuzzyScore(query, page.title);
      
      if (score > 0) {
        allResults.push({
          id: page.id,
          type: "page",
          title: page.title,
          path: page.path,
          score,
        });
      }
    });

    // Sort by score and limit
    return allResults
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ score, ...rest }) => rest);
  }, [query, contacts, deals, templates, limit]);

  return { results };
};
