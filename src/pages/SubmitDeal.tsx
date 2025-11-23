import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const SubmitDeal = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    property_address: "",
    asset_type: "",
    approximate_size: "",
    current_situation: "",
    timing: "",
    notes: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("inquiries").insert([{
        ...formData,
        inquiry_type: "investment_sales",
        user_type: "owner"
      }]);

      if (error) throw error;

      toast({
        title: "Submission received",
        description: "Our team will contact you within 24 hours"
      });
      
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Please try again or contact us directly",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 px-6 lg:px-8 pb-20">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Submit a Deal</h1>
          <p className="text-lg text-muted-foreground">
            Share your property information for a confidential evaluation
          </p>
        </div>

        <Card className="p-8 border border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input 
                  id="name" 
                  required 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input 
                  id="email" 
                  type="email" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                />
              </div>
              <div>
                <Label htmlFor="asset_type">Asset Type *</Label>
                <Select 
                  value={formData.asset_type} 
                  onValueChange={(value) => setFormData({...formData, asset_type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multifamily">Multifamily</SelectItem>
                    <SelectItem value="mixed-use">Mixed-Use</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="property_address">Property Address *</Label>
              <Input 
                id="property_address" 
                required 
                value={formData.property_address}
                onChange={(e) => setFormData({...formData, property_address: e.target.value})} 
              />
            </div>

            <div>
              <Label htmlFor="approximate_size">Units and Approximate Size</Label>
              <Input 
                id="approximate_size" 
                placeholder="e.g., 20 units, 15,000 SF" 
                value={formData.approximate_size}
                onChange={(e) => setFormData({...formData, approximate_size: e.target.value})} 
              />
            </div>

            <div>
              <Label htmlFor="current_situation">Current Situation</Label>
              <Textarea 
                id="current_situation" 
                placeholder="e.g., Refinance test, partnership change, full sale"
                value={formData.current_situation}
                onChange={(e) => setFormData({...formData, current_situation: e.target.value})} 
              />
            </div>

            <div>
              <Label htmlFor="timing">Desired Timing</Label>
              <Input 
                id="timing" 
                placeholder="e.g., 3-6 months" 
                value={formData.timing}
                onChange={(e) => setFormData({...formData, timing: e.target.value})} 
              />
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea 
                id="notes" 
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})} 
              />
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Deal"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default SubmitDeal;