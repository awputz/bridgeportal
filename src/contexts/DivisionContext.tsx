import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Division = "investment-sales" | "commercial-leasing" | "residential";

interface DivisionContextType {
  division: Division;
  setDivision: (division: Division) => void;
  divisionName: string;
  divisionConfig: DivisionConfig;
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
  const [division, setDivisionState] = useState<Division>(() => {
    const stored = localStorage.getItem("bridge-division");
    return (stored as Division) || "investment-sales";
  });

  const setDivision = (newDivision: Division) => {
    setDivisionState(newDivision);
    localStorage.setItem("bridge-division", newDivision);
  };

  useEffect(() => {
    const stored = localStorage.getItem("bridge-division");
    if (stored && stored !== division) {
      setDivisionState(stored as Division);
    }
  }, []);

  const divisionName = divisionConfigs[division].name;
  const divisionConfig = divisionConfigs[division];

  return (
    <DivisionContext.Provider value={{ division, setDivision, divisionName, divisionConfig }}>
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
