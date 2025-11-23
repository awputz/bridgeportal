import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { PropertyFormDialog } from "@/components/admin/PropertyFormDialog";
import type { Tables } from "@/integrations/supabase/types";

type Property = Tables<"properties">;

export const AdminProperties = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | undefined>();
  const { data: properties, isLoading } = useQuery({
    queryKey: ["admin-properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const formatPrice = (price: number, type: string) => {
    if (type === "rent") {
      return `$${price.toLocaleString()}/mo`;
    }
    return `$${price.toLocaleString()}`;
  };

  if (isLoading) {
    return <div>Loading properties...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Properties</h2>
          <p className="text-muted-foreground mt-2">
            Manage your property listings
          </p>
        </div>
        <Button onClick={() => {
          setSelectedProperty(undefined);
          setIsDialogOpen(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties?.map((property) => (
          <Card key={property.id} className="overflow-hidden">
            <div className="aspect-[16/9] overflow-hidden">
              <img
                src={property.images?.[0] || "/placeholder.svg"}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold line-clamp-1">{property.title}</h3>
                <Badge
                  variant={property.status === "active" ? "default" : "secondary"}
                >
                  {property.status}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-1">
                {property.address}, {property.city}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">
                  {formatPrice(property.price, property.listing_type || "rent")}
                </span>
                <span className="text-sm text-muted-foreground">
                  {property.bedrooms} bed • {property.bathrooms} bath
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link to={`/listings/${property.id}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    setSelectedProperty(property);
                    setIsDialogOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {properties?.length === 0 && (
          <Card className="p-12 text-center col-span-full">
            <p className="text-muted-foreground mb-4">No properties yet</p>
            <Button onClick={() => {
              setSelectedProperty(undefined);
              setIsDialogOpen(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Property
            </Button>
          </Card>
        )}
      </div>

      <PropertyFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        property={selectedProperty}
      />
    </div>
  );
};
