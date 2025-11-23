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
import { Mail, Phone, MapPin, DollarSign, Calendar } from "lucide-react";

export const AdminInquiries = () => {
  const queryClient = useQueryClient();

  const { data: inquiries, isLoading } = useQuery({
    queryKey: ["admin-inquiries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("inquiries")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-inquiries"] });
      toast({
        title: "Status updated",
        description: "Inquiry status has been updated",
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
      case "new":
        return "bg-blue-500";
      case "contacted":
        return "bg-yellow-500";
      case "in_progress":
        return "bg-purple-500";
      case "closed":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  if (isLoading) {
    return <div>Loading inquiries...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Inquiries</h2>
        <p className="text-muted-foreground mt-2">
          Manage and respond to customer inquiries
        </p>
      </div>

      <div className="grid gap-4">
        {inquiries?.map((inquiry) => (
          <Card key={inquiry.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{inquiry.name}</h3>
                <p className="text-sm text-muted-foreground capitalize">
                  {inquiry.user_type || "General"} Inquiry
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={getStatusColor(inquiry.status || "new")}>
                  {inquiry.status || "new"}
                </Badge>
                <Select
                  defaultValue={inquiry.status || "new"}
                  onValueChange={(status) =>
                    updateStatusMutation.mutate({ id: inquiry.id, status })
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${inquiry.email}`} className="hover:underline">
                  {inquiry.email}
                </a>
              </div>
              {inquiry.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${inquiry.phone}`} className="hover:underline">
                    {inquiry.phone}
                  </a>
                </div>
              )}
              {inquiry.neighborhoods && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{inquiry.neighborhoods}</span>
                </div>
              )}
              {inquiry.budget && (
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>{inquiry.budget}</span>
                </div>
              )}
              {inquiry.timing && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{inquiry.timing}</span>
                </div>
              )}
            </div>

            {inquiry.requirements && (
              <div className="mb-3">
                <p className="text-sm font-medium mb-1">Requirements:</p>
                <p className="text-sm text-muted-foreground">{inquiry.requirements}</p>
              </div>
            )}

            {inquiry.notes && (
              <div className="mb-3">
                <p className="text-sm font-medium mb-1">Notes:</p>
                <p className="text-sm text-muted-foreground">{inquiry.notes}</p>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
              <span>
                Created: {inquiry.created_at && format(new Date(inquiry.created_at), "MMM d, yyyy 'at' h:mm a")}
              </span>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </Card>
        ))}

        {inquiries?.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No inquiries yet</p>
          </Card>
        )}
      </div>
    </div>
  );
};
