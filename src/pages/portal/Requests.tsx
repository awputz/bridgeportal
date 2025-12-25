import { useState } from "react";
import { Send, CreditCard, Megaphone, BarChart3, HelpCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const requestTypes = [
  { value: "business-cards", label: "Business Cards", icon: CreditCard, description: "Order new business cards" },
  { value: "marketing-materials", label: "Marketing Materials", icon: Megaphone, description: "Flyers, digital ads, social content for exclusives" },
  { value: "bov-request", label: "BOV / Valuation", icon: BarChart3, description: "Request BOV from analytical research team" },
  { value: "marketing-support", label: "Marketing Support", icon: Megaphone, description: "Campaign support, email marketing, social strategy" },
  { value: "other", label: "Other Request", icon: HelpCircle, description: "Any other support needed" },
];

const Requests = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    requestType: "",
    propertyAddress: "",
    clientName: "",
    priority: "normal",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.requestType) {
      toast.error("Please select a request type");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to submit a request");
        return;
      }

      // Insert request into database
      const { error } = await supabase.from("agent_requests").insert({
        agent_id: user.id,
        request_type: formData.requestType,
        property_address: formData.propertyAddress || null,
        client_name: formData.clientName || null,
        priority: formData.priority,
        notes: formData.notes || null,
      });

      if (error) throw error;

      // Also send email notification via edge function
      try {
        await supabase.functions.invoke("submit-inquiry", {
          body: {
            name: user.email?.split("@")[0] || "Agent",
            email: user.email,
            inquiry_type: "agent_request",
            notes: `Request Type: ${formData.requestType}\nProperty: ${formData.propertyAddress || 'N/A'}\nClient: ${formData.clientName || 'N/A'}\nPriority: ${formData.priority}\n\nDetails: ${formData.notes || 'No additional details'}`,
          },
        });
      } catch (emailError) {
        console.log("Email notification skipped:", emailError);
      }

      toast.success("Request submitted successfully! Our team will be in touch.");
      
      // Reset form
      setFormData({
        requestType: "",
        propertyAddress: "",
        clientName: "",
        priority: "normal",
        notes: "",
      });
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedType = requestTypes.find(t => t.value === formData.requestType);

  return (
    <div className="min-h-screen pb-24 md:pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground mb-2">
            Agent Requests
          </h1>
          <p className="text-muted-foreground font-light">
            Request business cards, marketing support, BOV assistance, and more
          </p>
        </div>

        {/* Request Type Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          {requestTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = formData.requestType === type.value;
            return (
              <button
                key={type.value}
                onClick={() => setFormData(prev => ({ ...prev, requestType: type.value }))}
                className={`p-4 rounded-lg border text-left transition-all ${
                  isSelected
                    ? "bg-primary/20 border-primary"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                <Icon className={`h-5 w-5 mb-2 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                <p className="text-sm font-medium text-foreground">{type.label}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{type.description}</p>
              </button>
            );
          })}
        </div>

        {/* Request Form */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="font-light">
              {selectedType ? `${selectedType.label} Request` : "Submit a Request"}
            </CardTitle>
            <CardDescription>
              All requests are sent to office@bridgenyre.com and tracked in your portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!formData.requestType && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Select a request type above to continue
                </p>
              )}

              {formData.requestType && (
                <>
                  {/* Property Address - for marketing/BOV */}
                  {["marketing-materials", "bov-request"].includes(formData.requestType) && (
                    <div className="space-y-2">
                      <Label htmlFor="propertyAddress">Property Address</Label>
                      <Input
                        id="propertyAddress"
                        value={formData.propertyAddress}
                        onChange={(e) => setFormData(prev => ({ ...prev, propertyAddress: e.target.value }))}
                        placeholder="123 Main Street, New York, NY"
                      />
                    </div>
                  )}

                  {/* Client Name */}
                  {["bov-request", "marketing-materials"].includes(formData.requestType) && (
                    <div className="space-y-2">
                      <Label htmlFor="clientName">Client Name (optional)</Label>
                      <Input
                        id="clientName"
                        value={formData.clientName}
                        onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                        placeholder="Client or owner name"
                      />
                    </div>
                  )}

                  {/* Priority */}
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Notes/Details */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Details</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder={
                        formData.requestType === "business-cards"
                          ? "Name, title, phone, email as you want it printed. Quantity needed."
                          : formData.requestType === "bov-request"
                          ? "Property details, client needs, timeline, any specific requirements..."
                          : "Describe what you need..."
                      }
                      rows={4}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Request
                      </>
                    )}
                  </Button>
                </>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="glass-card border-white/10 mt-6">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">
                Need immediate assistance? Call{" "}
                <a href="tel:9173531916" className="text-primary hover:underline">
                  (917) 353-1916
                </a>{" "}
                or email{" "}
                <a href="mailto:office@bridgenyre.com" className="text-primary hover:underline">
                  office@bridgenyre.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Requests;
