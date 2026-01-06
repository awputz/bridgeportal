import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ExpenseCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string | null;
  subcategories: string[] | null;
  is_tax_deductible_default: boolean;
  irs_category: string | null;
  display_order: number;
  is_active: boolean;
}

export const useExpenseCategories = () => {
  return useQuery({
    queryKey: ["expense-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("expense_categories")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as ExpenseCategory[];
    },
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes - categories rarely change
  });
};

// Helper to get icon component name from category
export const getCategoryIcon = (iconName: string) => {
  const iconMap: Record<string, string> = {
    Camera: "Camera",
    Car: "Car",
    Coffee: "Coffee",
    BookOpen: "BookOpen",
    Building2: "Building2",
    Scale: "Scale",
    Laptop: "Laptop",
    Shield: "Shield",
    Home: "Home",
    Pin: "Pin",
  };
  return iconMap[iconName] || "Receipt";
};
