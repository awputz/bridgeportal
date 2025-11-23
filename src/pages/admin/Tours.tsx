import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Mail, Phone, Calendar, MapPin } from "lucide-react";

export const AdminTours = () => {
  const queryClient = useQueryClient();

  const { data: tours, isLoading } = useQuery({
    queryKey: ["admin-tours"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tour_requests")
        .select(`
          *,
          properties (
            title,
            address,
            city
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("tour_requests")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tours"] });
      toast({
        title: "Status updated",
        description: "Tour request status has been updated",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "confirmed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      case "completed":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  if (isLoading) {
    return <div>Loading tour requests...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Tour Requests</h2>
        <p className="text-muted-foreground mt-2">
          Manage property tour appointments
        </p>
      </div>

      <div className="grid gap-4">
        {tours?.map((tour: any) => (
          <Card key={tour.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{tour.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {tour.properties?.title}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={getStatusColor(tour.status || "pending")}>
                  {tour.status || "pending"}
                </Badge>
                <Select
                  defaultValue={tour.status || "pending"}
                  onValueChange={(status) =>
                    updateStatusMutation.mutate({ id: tour.id, status })
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${tour.email}`} className="hover:underline">
                  {tour.email}
                </a>
              </div>
              {tour.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${tour.phone}`} className="hover:underline">
                    {tour.phone}
                  </a>
                </div>
              )}
              {tour.properties && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {tour.properties.address}, {tour.properties.city}
                  </span>
                </div>
              )}
              {tour.preferred_date && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {format(new Date(tour.preferred_date), "MMM d, yyyy")}
                    {tour.preferred_time && ` at ${tour.preferred_time}`}
                  </span>
                </div>
              )}
            </div>

            {tour.message && (
              <div className="mb-3">
                <p className="text-sm font-medium mb-1">Message:</p>
                <p className="text-sm text-muted-foreground">{tour.message}</p>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
              <span>
                Requested: {tour.created_at && format(new Date(tour.created_at), "MMM d, yyyy 'at' h:mm a")}
              </span>
              <Button variant="outline" size="sm">
                Contact Client
              </Button>
            </div>
          </Card>
        ))}

        {tours?.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No tour requests yet</p>
          </Card>
        )}
      </div>
    </div>
  );
};
