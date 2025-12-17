import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { COMPANY_INFO } from "@/lib/constants";

export interface CompanyAddress {
  street: string;
  floors: string;
  city: string;
  state: string;
  zip: string;
  full: string;
  short: string;
}

export interface CompanyContact {
  email: string;
  phone: string;
}

export interface CompanyDescription {
  full: string;
  short: string;
  home: string;
}

export interface CompanyCompliance {
  license: string;
  equalHousing: boolean;
}

export interface BridgeSettings {
  company_name: string;
  company_tagline: string;
  company_address: CompanyAddress;
  company_contact: CompanyContact;
  company_description: CompanyDescription;
  company_compliance: CompanyCompliance;
  clients_count: number;
}

// Fallback to constants if database is unavailable
const FALLBACK_SETTINGS: BridgeSettings = {
  company_name: COMPANY_INFO.name,
  company_tagline: COMPANY_INFO.tagline,
  company_address: COMPANY_INFO.address,
  company_contact: COMPANY_INFO.contact,
  company_description: COMPANY_INFO.description,
  company_compliance: COMPANY_INFO.compliance,
  clients_count: 100,
};

export const useBridgeSettings = () => {
  return useQuery({
    queryKey: ["bridge-settings"],
    queryFn: async (): Promise<BridgeSettings> => {
      const { data, error } = await supabase
        .from("bridge_settings")
        .select("key, value");

      if (error) {
        console.warn("Failed to fetch bridge settings, using fallback:", error);
        return FALLBACK_SETTINGS;
      }

      if (!data || data.length === 0) {
        return FALLBACK_SETTINGS;
      }

      // Convert array of {key, value} to object
      const settings: Record<string, unknown> = {};
      data.forEach((row) => {
        settings[row.key] = row.value;
      });

      return {
        company_name: (settings.company_name as string) || FALLBACK_SETTINGS.company_name,
        company_tagline: (settings.company_tagline as string) || FALLBACK_SETTINGS.company_tagline,
        company_address: (settings.company_address as CompanyAddress) || FALLBACK_SETTINGS.company_address,
        company_contact: (settings.company_contact as CompanyContact) || FALLBACK_SETTINGS.company_contact,
        company_description: (settings.company_description as CompanyDescription) || FALLBACK_SETTINGS.company_description,
        company_compliance: (settings.company_compliance as CompanyCompliance) || FALLBACK_SETTINGS.company_compliance,
        clients_count: Number(settings.clients_count) || FALLBACK_SETTINGS.clients_count,
      };
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

// Helper hook for specific setting
export const useBridgeSetting = <K extends keyof BridgeSettings>(key: K) => {
  const { data, ...rest } = useBridgeSettings();
  return {
    ...rest,
    data: data?.[key],
  };
};
