import { useState } from "react";
import { Check, ChevronsUpDown, Home, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useCRMDeals } from "@/hooks/useCRM";

export interface PropertyData {
  id: string;
  address: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  squareFeet: string;
  dealName: string;
}

interface PropertySelectorProps {
  onSelect: (property: PropertyData) => void;
  division?: string;
}

export const PropertySelector = ({ onSelect, division }: PropertySelectorProps) => {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const { data: deals, isLoading } = useCRMDeals(division);

  const properties: PropertyData[] = (deals || [])
    .filter(deal => deal.property_address)
    .map(deal => ({
      id: deal.id,
      address: deal.property_address || "",
      price: deal.value ? `$${deal.value.toLocaleString()}` : "",
      bedrooms: "",
      bathrooms: "",
      squareFeet: deal.gross_sf?.toString() || "",
      dealName: deal.property_address || "",
    }));

  const handleSelect = (property: PropertyData) => {
    setSelectedId(property.id);
    onSelect(property);
    setOpen(false);
  };

  const selectedProperty = properties.find(p => p.id === selectedId);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Home className="h-4 w-4" />
        <span>Import from Property</span>
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto py-3"
          >
            {selectedProperty ? (
              <div className="flex flex-col items-start text-left">
                <span className="font-medium truncate max-w-[280px]">
                  {selectedProperty.address}
                </span>
                <span className="text-xs text-muted-foreground">
                  {selectedProperty.price}
                  {selectedProperty.bedrooms && ` • ${selectedProperty.bedrooms} bed`}
                  {selectedProperty.bathrooms && ` • ${selectedProperty.bathrooms} bath`}
                </span>
              </div>
            ) : (
              <span className="text-muted-foreground">
                Select a property to auto-fill details...
              </span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search properties..." />
            <CommandList>
              <CommandEmpty>
                {isLoading ? "Loading properties..." : "No properties found."}
              </CommandEmpty>
              <CommandGroup heading="Your Properties">
                {properties.map((property) => (
                  <CommandItem
                    key={property.id}
                    value={property.address}
                    onSelect={() => handleSelect(property)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedId === property.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        <span className="font-medium truncate">{property.address}</span>
                      </div>
                      <span className="text-xs text-muted-foreground ml-5">
                        {property.price}
                        {property.bedrooms && ` • ${property.bedrooms} bed`}
                        {property.bathrooms && ` • ${property.bathrooms} bath`}
                        {property.squareFeet && ` • ${property.squareFeet} sqft`}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
