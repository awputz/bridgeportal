import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PropertyForm, PropertyFormValues } from "./PropertyForm";
import type { Tables } from "@/integrations/supabase/types";

type Property = Tables<"properties">;

interface PropertyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property?: Property;
}

export function PropertyFormDialog({ open, onOpenChange, property }: PropertyFormDialogProps) {
  const queryClient = useQueryClient();
  const isEdit = !!property;

  const mutation = useMutation({
    mutationFn: async (values: PropertyFormValues) => {
      const propertyData = {
        title: values.title,
        address: values.address,
        city: values.city,
        state: values.state.toUpperCase(),
        zip_code: values.zip_code || null,
        price: values.price,
        bedrooms: values.bedrooms || null,
        bathrooms: values.bathrooms || null,
        square_feet: values.square_feet || null,
        year_built: values.year_built || null,
        listing_type: values.listing_type,
        property_type: values.property_type,
        status: values.status,
        description: values.description || null,
        featured: values.featured,
        images: values.images 
          ? values.images.split(',').map(url => url.trim()).filter(Boolean)
          : null,
        amenities: values.amenities 
          ? values.amenities.split(',').map(a => a.trim()).filter(Boolean)
          : null,
      };

      if (isEdit) {
        const { error } = await supabase
          .from("properties")
          .update(propertyData)
          .eq("id", property.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("properties")
          .insert(propertyData);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
      toast({
        title: "Success",
        description: `Property ${isEdit ? "updated" : "created"} successfully`,
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${isEdit ? "update" : "create"} property: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const defaultValues: Partial<PropertyFormValues> = property
    ? {
        title: property.title,
        address: property.address,
        city: property.city,
        state: property.state,
        zip_code: property.zip_code || "",
        price: property.price,
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        square_feet: property.square_feet || 0,
        year_built: property.year_built || undefined,
        listing_type: (property.listing_type as "rent" | "sale") || "rent",
        property_type: property.property_type || "",
        status: (property.status as "active" | "inactive" | "pending") || "active",
        description: property.description || "",
        featured: property.featured || false,
        images: property.images?.join(", ") || "",
        amenities: property.amenities?.join(", ") || "",
      }
    : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Property" : "Add New Property"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the property details below."
              : "Fill in the details to create a new property listing."}
          </DialogDescription>
        </DialogHeader>
        <PropertyForm
          defaultValues={defaultValues}
          onSubmit={(values) => mutation.mutateAsync(values)}
          isSubmitting={mutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
