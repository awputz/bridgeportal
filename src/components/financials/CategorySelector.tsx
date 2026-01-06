import { Camera, Car, Coffee, BookOpen, Building2, Scale, Laptop, Shield, Home, Pin, Receipt, ChevronDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useExpenseCategories, type ExpenseCategory } from "@/hooks/useExpenseCategories";

const iconMap: Record<string, React.ElementType> = {
  Camera,
  Car,
  Coffee,
  BookOpen,
  Building2,
  Scale,
  Laptop,
  Shield,
  Home,
  Pin,
  Receipt,
};

interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
  subcategoryValue?: string;
  onSubcategoryChange?: (value: string) => void;
  showSubcategory?: boolean;
}

export const CategorySelector = ({
  value,
  onChange,
  subcategoryValue,
  onSubcategoryChange,
  showSubcategory = true,
}: CategorySelectorProps) => {
  const { data: categories = [], isLoading } = useExpenseCategories();

  const selectedCategory = categories.find((c) => c.name === value);
  const subcategories = selectedCategory?.subcategories || [];

  return (
    <div className="space-y-3">
      {/* Category Selector */}
      <div>
        <Select value={value} onValueChange={onChange} disabled={isLoading}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={isLoading ? "Loading..." : "Select category"}>
              {selectedCategory && (
                <div className="flex items-center gap-2">
                  {(() => {
                    const Icon = iconMap[selectedCategory.icon] || Receipt;
                    return <Icon className="h-4 w-4" />;
                  })()}
                  <span>{selectedCategory.name}</span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => {
              const Icon = iconMap[category.icon] || Receipt;
              return (
                <SelectItem key={category.id} value={category.name}>
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full ${category.color}/20 flex items-center justify-center`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span>{category.name}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        {selectedCategory?.description && (
          <p className="text-xs text-muted-foreground mt-1">{selectedCategory.description}</p>
        )}
      </div>

      {/* Subcategory Selector */}
      {showSubcategory && subcategories.length > 0 && (
        <div>
          <Select value={subcategoryValue || ""} onValueChange={onSubcategoryChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select subcategory (optional)" />
            </SelectTrigger>
            <SelectContent>
              {subcategories.map((sub) => (
                <SelectItem key={sub} value={sub}>
                  {sub}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

// Simple category badge component
export const CategoryBadge = ({ category }: { category: string }) => {
  const { data: categories = [] } = useExpenseCategories();
  const cat = categories.find((c) => c.name === category);
  const Icon = cat ? iconMap[cat.icon] || Receipt : Receipt;
  const color = cat?.color || "bg-gray-500";

  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-5 h-5 rounded-full ${color}/20 flex items-center justify-center`}>
        <Icon className="h-3 w-3" />
      </div>
      <span className="text-xs">{category}</span>
    </div>
  );
};
