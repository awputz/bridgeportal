import { useState } from "react";
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
import { toast } from "sonner";
import { COMPANY_INFO } from "@/lib/constants";
import { supabase } from "@/integrations/supabase/client";

type Division = "residential" | "commercial-leasing" | "investment-sales" | "capital-advisory" | "marketing" | "billboard" | "";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [division, setDivision] = useState<Division>("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    preferredContact: "email",
    // Residential fields
    userType: "",
    propertyType: "",
    budgetRange: "",
    neighborhoods: "",
    timing: "",
    // Commercial Leasing fields
    tenantLandlord: "",
    useType: "",
    squareFootage: "",
    targetSubmarket: "",
    leaseStartDate: "",
    // Investment Sales fields
    ownerBuyerBroker: "",
    assetClass: "",
    dealSize: "",
    assetLocation: "",
    timingToTransact: "",
    // Capital Advisory fields
    capitalNeedType: "",
    projectSize: "",
    assetType: "",
    useCase: "",
    // Marketing fields
    clientType: "",
    projectType: "",
    marketingNeed: "",
    timeline: "",
    // Billboard fields
    billboardClientType: "",
    campaignType: "",
    budgetRangeBillboard: "",
    campaignTiming: "",
    // Common
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const inquiryData = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone || null,
        inquiry_type: division || 'general',
        user_type: formData.userType || formData.tenantLandlord || formData.ownerBuyerBroker || formData.clientType || formData.billboardClientType || null,
        property_type: formData.propertyType || formData.useType || formData.assetClass || formData.projectType || formData.campaignType || null,
        budget_range: formData.budgetRange || formData.dealSize || formData.projectSize || formData.budgetRangeBillboard || null,
        neighborhoods: formData.neighborhoods || formData.targetSubmarket || formData.assetLocation || null,
        timeline: formData.timing || formData.timingToTransact || formData.timeline || formData.campaignTiming || null,
        approximate_size: formData.squareFootage || null,
        notes: formData.message || null,
        target_asset_type: formData.assetType || null,
      };

      const { error } = await supabase.functions.invoke('submit-inquiry', {
        body: inquiryData
      });

      if (error) throw error;

      toast.success("Thank you. Your inquiry has been received and will be routed to the appropriate team at Bridge Advisory Group. A member of our team will be in touch shortly.");
    
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        preferredContact: "email",
        userType: "",
        propertyType: "",
        budgetRange: "",
        neighborhoods: "",
        timing: "",
        tenantLandlord: "",
        useType: "",
        squareFootage: "",
        targetSubmarket: "",
        leaseStartDate: "",
        ownerBuyerBroker: "",
        assetClass: "",
        dealSize: "",
        assetLocation: "",
        timingToTransact: "",
        capitalNeedType: "",
        projectSize: "",
        assetType: "",
        useCase: "",
        clientType: "",
        projectType: "",
        marketingNeed: "",
        timeline: "",
        billboardClientType: "",
        campaignType: "",
        budgetRangeBillboard: "",
        campaignTiming: "",
        message: "",
      });
      setDivision("");
    } catch (error) {
      console.error("Failed to submit inquiry:", error);
      toast.error("Failed to submit inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen pt-32 md:pt-40 pb-20">
      <div className="container mx-auto px-4 md:px-6 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light mb-4 animate-fade-in">
            Contact Bridge Advisory Group
          </h1>
          <p className="text-muted-foreground font-light animate-fade-in" style={{ animationDelay: '100ms' }}>
            Tell us who you are trying to reach and what you are working on. We will route your inquiry to the right team.
          </p>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
          {/* Base Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName" className="font-light">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email" className="font-light">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="font-light">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="preferredContact" className="font-light">Preferred Contact Method</Label>
              <Select
                value={formData.preferredContact}
                onValueChange={(value) => handleInputChange("preferredContact", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="division" className="font-light">I am looking to contact the following division *</Label>
              <Select
                value={division}
                onValueChange={(value) => setDivision(value as Division)}
                required
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a division" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial-leasing">Commercial Leasing</SelectItem>
                  <SelectItem value="investment-sales">Investment Sales</SelectItem>
                  <SelectItem value="capital-advisory">Capital Advisory</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="billboard">Billboard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Conditional Fields - Residential */}
          {division === "residential" && (
            <div className="space-y-4 p-6 rounded-lg border border-white/10 bg-white/[0.02]">
              <h3 className="font-light text-lg mb-4">Residential Details</h3>
              <div>
                <Label className="font-light">Are you an Owner, Buyer, or Renter?</Label>
                <Select
                  value={formData.userType}
                  onValueChange={(value) => handleInputChange("userType", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="buyer">Buyer</SelectItem>
                    <SelectItem value="renter">Renter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-light">Property Type</Label>
                <Select
                  value={formData.propertyType}
                  onValueChange={(value) => handleInputChange("propertyType", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                    <SelectItem value="building">Building</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-light">Approximate Budget or Price Range</Label>
                <Input
                  value={formData.budgetRange}
                  onChange={(e) => handleInputChange("budgetRange", e.target.value)}
                  placeholder="e.g., $3,000-$5,000/month or $1M-$2M"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="font-light">Preferred Neighborhoods</Label>
                <Input
                  value={formData.neighborhoods}
                  onChange={(e) => handleInputChange("neighborhoods", e.target.value)}
                  placeholder="e.g., Tribeca, SoHo, West Village"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="font-light">Timing</Label>
                <Select
                  value={formData.timing}
                  onValueChange={(value) => handleInputChange("timing", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="30-60">30-60 Days</SelectItem>
                    <SelectItem value="60-120">60-120 Days</SelectItem>
                    <SelectItem value="longer">Longer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Conditional Fields - Commercial Leasing */}
          {division === "commercial-leasing" && (
            <div className="space-y-4 p-6 rounded-lg border border-white/10 bg-white/[0.02]">
              <h3 className="font-light text-lg mb-4">Commercial Leasing Details</h3>
              <div>
                <Label className="font-light">Are you a Tenant or Landlord?</Label>
                <Select
                  value={formData.tenantLandlord}
                  onValueChange={(value) => handleInputChange("tenantLandlord", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tenant">Tenant</SelectItem>
                    <SelectItem value="landlord">Landlord</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-light">Use Type</Label>
                <Select
                  value={formData.useType}
                  onValueChange={(value) => handleInputChange("useType", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-light">Approximate Square Footage</Label>
                <Input
                  value={formData.squareFootage}
                  onChange={(e) => handleInputChange("squareFootage", e.target.value)}
                  placeholder="e.g., 5,000 SF"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="font-light">Target Neighborhood or Submarket</Label>
                <Input
                  value={formData.targetSubmarket}
                  onChange={(e) => handleInputChange("targetSubmarket", e.target.value)}
                  placeholder="e.g., Midtown, FiDi"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="font-light">Desired Lease Start Date</Label>
                <Input
                  type="date"
                  value={formData.leaseStartDate}
                  onChange={(e) => handleInputChange("leaseStartDate", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {/* Conditional Fields - Investment Sales */}
          {division === "investment-sales" && (
            <div className="space-y-4 p-6 rounded-lg border border-white/10 bg-white/[0.02]">
              <h3 className="font-light text-lg mb-4">Investment Sales Details</h3>
              <div>
                <Label className="font-light">Are you an Owner, Buyer, or Broker?</Label>
                <Select
                  value={formData.ownerBuyerBroker}
                  onValueChange={(value) => handleInputChange("ownerBuyerBroker", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="buyer">Buyer</SelectItem>
                    <SelectItem value="broker">Broker</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-light">Asset Class</Label>
                <Select
                  value={formData.assetClass}
                  onValueChange={(value) => handleInputChange("assetClass", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multifamily">Multifamily</SelectItem>
                    <SelectItem value="mixed-use">Mixed Use</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="development-site">Development Site</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-light">Approximate Deal Size</Label>
                <Input
                  value={formData.dealSize}
                  onChange={(e) => handleInputChange("dealSize", e.target.value)}
                  placeholder="e.g., $5M-$10M"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="font-light">Asset Location</Label>
                <Input
                  value={formData.assetLocation}
                  onChange={(e) => handleInputChange("assetLocation", e.target.value)}
                  placeholder="e.g., Brooklyn, Upper West Side"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="font-light">Timing To Transact</Label>
                <Select
                  value={formData.timingToTransact}
                  onValueChange={(value) => handleInputChange("timingToTransact", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="1-3-months">1-3 Months</SelectItem>
                    <SelectItem value="3-6-months">3-6 Months</SelectItem>
                    <SelectItem value="6-12-months">6-12 Months</SelectItem>
                    <SelectItem value="exploratory">Exploratory</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Conditional Fields - Capital Advisory */}
          {division === "capital-advisory" && (
            <div className="space-y-4 p-6 rounded-lg border border-white/10 bg-white/[0.02]">
              <h3 className="font-light text-lg mb-4">Capital Advisory Details</h3>
              <div>
                <Label className="font-light">Capital Need Type</Label>
                <Select
                  value={formData.capitalNeedType}
                  onValueChange={(value) => handleInputChange("capitalNeedType", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debt">Debt</SelectItem>
                    <SelectItem value="equity">Equity</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                    <SelectItem value="not-sure">Not Sure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-light">Approximate Project Size</Label>
                <Input
                  value={formData.projectSize}
                  onChange={(e) => handleInputChange("projectSize", e.target.value)}
                  placeholder="e.g., $10M"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="font-light">Asset Type</Label>
                <Input
                  value={formData.assetType}
                  onChange={(e) => handleInputChange("assetType", e.target.value)}
                  placeholder="e.g., Multifamily, Office"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="font-light">Use Case</Label>
                <Select
                  value={formData.useCase}
                  onValueChange={(value) => handleInputChange("useCase", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="acquisition">Acquisition</SelectItem>
                    <SelectItem value="refinance">Refinance</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="recapitalization">Recapitalization</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Conditional Fields - Marketing */}
          {division === "marketing" && (
            <div className="space-y-4 p-6 rounded-lg border border-white/10 bg-white/[0.02]">
              <h3 className="font-light text-lg mb-4">Marketing Details</h3>
              <div>
                <Label className="font-light">Are you an Owner, Developer, Broker, or Brand?</Label>
                <Select
                  value={formData.clientType}
                  onValueChange={(value) => handleInputChange("clientType", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="broker">Broker</SelectItem>
                    <SelectItem value="brand">Brand</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-light">Type Of Project</Label>
                <Select
                  value={formData.projectType}
                  onValueChange={(value) => handleInputChange("projectType", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="property">Property</SelectItem>
                    <SelectItem value="portfolio">Portfolio</SelectItem>
                    <SelectItem value="brand">Brand</SelectItem>
                    <SelectItem value="campaign">Campaign</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-light">Primary Marketing Need</Label>
                <Select
                  value={formData.marketingNeed}
                  onValueChange={(value) => handleInputChange("marketingNeed", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="creative">Creative</SelectItem>
                    <SelectItem value="digital">Digital</SelectItem>
                    <SelectItem value="strategy">Strategy</SelectItem>
                    <SelectItem value="full-scope">Full Scope</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-light">Timeline And Launch Window</Label>
                <Input
                  value={formData.timeline}
                  onChange={(e) => handleInputChange("timeline", e.target.value)}
                  placeholder="e.g., Q1 2025"
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {/* Conditional Fields - Billboard */}
          {division === "billboard" && (
            <div className="space-y-4 p-6 rounded-lg border border-white/10 bg-white/[0.02]">
              <h3 className="font-light text-lg mb-4">Billboard Details</h3>
              <div>
                <Label className="font-light">Client Type</Label>
                <Select
                  value={formData.billboardClientType}
                  onValueChange={(value) => handleInputChange("billboardClientType", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brand">Brand / Advertiser</SelectItem>
                    <SelectItem value="agency">Agency</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="landlord">Landlord / Property Owner</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-light">Campaign Type</Label>
                <Select
                  value={formData.campaignType}
                  onValueChange={(value) => handleInputChange("campaignType", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brand-awareness">Brand Awareness</SelectItem>
                    <SelectItem value="product-launch">Product Launch</SelectItem>
                    <SelectItem value="event-promotion">Event Promotion</SelectItem>
                    <SelectItem value="real-estate">Real Estate Marketing</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-light">Budget Range</Label>
                <Select
                  value={formData.budgetRangeBillboard}
                  onValueChange={(value) => handleInputChange("budgetRangeBillboard", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-10k">Under $10,000</SelectItem>
                    <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                    <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                    <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                    <SelectItem value="over-100k">Over $100,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-light">Campaign Timing</Label>
                <Select
                  value={formData.campaignTiming}
                  onValueChange={(value) => handleInputChange("campaignTiming", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="1-month">Within 1 Month</SelectItem>
                    <SelectItem value="1-3-months">1-3 Months</SelectItem>
                    <SelectItem value="3-6-months">3-6 Months</SelectItem>
                    <SelectItem value="planning">Planning / Exploratory</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Message Field */}
          <div>
            <Label htmlFor="message" className="font-light">Briefly describe what you are looking for</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              rows={5}
              className="mt-1"
              placeholder="Tell us about your needs..."
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" size="lg" className="w-full font-light" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Inquiry"}
          </Button>
        </form>

        {/* Contact Info */}
        <div className="mt-16 text-center border-t border-white/10 pt-12">
          <p className="text-muted-foreground font-light mb-4">Or reach us directly:</p>
          <p className="font-light">{COMPANY_INFO.address.short}</p>
          <p className="font-light">
            <a href={`mailto:${COMPANY_INFO.contact.email}`} className="hover:text-foreground transition-colors">
              {COMPANY_INFO.contact.email}
            </a>
          </p>
          <p className="font-light">{COMPANY_INFO.contact.phone}</p>
        </div>
      </div>
    </div>
  );
}
