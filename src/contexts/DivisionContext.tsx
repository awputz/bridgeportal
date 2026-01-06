import { createContext, useContext, useState, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { toast } from "sonner";

export type Division = "investment-sales" | "commercial-leasing" | "residential";

interface DivisionContextType {
  division: Division;
  setDivision: (division: Division) => void;
  divisionName: string;
  divisionConfig: DivisionConfig;
  isAdmin: boolean;
  isLoading: boolean;
}

interface DivisionConfig {
  name: string;
  shortName: string;
  color: string;
  contactTypes: string[];
  dealTypes: string[];
  activityTypes: string[];
  defaultTools: string[];
  defaultCalculators: string[];
  aiPrompts: string[];
}

const divisionConfigs: Record<Division, DivisionConfig> = {
  "investment-sales": {
    name: "Investment Sales",
    shortName: "IS",
    color: "#8b5cf6",
    contactTypes: ["owner", "buyer", "investor", "attorney", "lender", "broker"],
    dealTypes: ["sale", "acquisition"],
    activityTypes: ["call", "meeting", "tour", "proposal", "follow-up", "note"],
    defaultTools: ["PropertyShark", "ACRIS", "CoStar"],
    defaultCalculators: ["cap-rate", "cash-flow", "1031-exchange"],
    aiPrompts: [
      "Analyze this investment property",
      "Draft an OM summary",
      "Calculate returns for this deal",
      "Write a buyer outreach email",
    ],
  },
  "commercial-leasing": {
    name: "Commercial Leasing",
    shortName: "CL",
    color: "#3b82f6",
    contactTypes: ["tenant", "landlord", "attorney", "broker"],
    dealTypes: ["lease", "sublease", "renewal"],
    activityTypes: ["call", "email", "meeting", "tour", "showing", "proposal"],
    defaultTools: ["CoStar", "ZOLA", "DOB NOW"],
    defaultCalculators: ["lease-calc", "net-effective", "ti-calculator"],
    aiPrompts: [
      "Compare these lease options",
      "Draft a tenant proposal",
      "Analyze rent escalations",
      "Write a tour follow-up email",
    ],
  },
  "residential": {
    name: "Residential",
    shortName: "RES",
    color: "#22c55e",
    contactTypes: ["buyer", "tenant", "landlord", "broker"],
    dealTypes: ["sale", "lease"],
    activityTypes: ["call", "email", "showing", "follow-up", "note"],
    defaultTools: ["StreetEasy", "HPD Online"],
    defaultCalculators: ["rent-vs-buy", "rent-affordability", "net-effective-residential"],
    aiPrompts: [
      "Write a listing description",
      "Analyze rent affordability",
      "Draft showing confirmation email",
      "Compare neighborhoods",
    ],
  },
};

const DivisionContext = createContext<DivisionContextType | undefined>(undefined);

export const DivisionProvider = ({ children }: { children: ReactNode }) => {
  const { data: role, isLoading: roleLoading } = useUserRole();
  const isAdmin = role === "admin";

  // Fetch user's assigned division from database
  const { data: userDivision, isLoading: divisionLoading } = useQuery({
    queryKey: ["userDivision"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from("user_roles")
        .select("assigned_division")
        .eq("user_id", user.id)
        .maybeSingle();

      return data?.assigned_division as Division | null;
    },
    enabled: !isAdmin && !roleLoading,
  });

  // Admin's selected division (stored in localStorage for UX only)
  const [adminSelectedDivision, setAdminSelectedDivision] = useState<Division>(() => {
    const stored = localStorage.getItem("admin-division-preference");
    return (stored as Division) || "investment-sales";
  });

  // Determine actual division to use
  const division: Division = isAdmin ? adminSelectedDivision : (userDivision || "investment-sales");

  const setDivision = (newDivision: Division) => {
    if (isAdmin) {
      setAdminSelectedDivision(newDivision);
      localStorage.setItem("admin-division-preference", newDivision);
    } else {
      toast.error("Only administrators can change division assignments");
    }
  };

  const divisionName = divisionConfigs[division].name;
  const divisionConfig = divisionConfigs[division];
  const isLoading = roleLoading || (!isAdmin && divisionLoading);

  return (
    <DivisionContext.Provider value={{ division, setDivision, divisionName, divisionConfig, isAdmin, isLoading }}>
      {children}
    </DivisionContext.Provider>
  );
};

export const useDivision = () => {
  const context = useContext(DivisionContext);
  if (!context) {
    throw new Error("useDivision must be used within a DivisionProvider");
  }
  return context;
};

export { divisionConfigs };
