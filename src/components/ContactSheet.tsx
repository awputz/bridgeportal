import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Phone, Mail, Linkedin } from "lucide-react";
import { toast } from "sonner";
import { COMPANY_INFO } from "@/lib/constants";
import { supabase } from "@/integrations/supabase/client";

interface ContactSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Division = "residential" | "commercial-leasing" | "investment-sales" | "capital-advisory" | "marketing" | "billboard" | "careers" | "";

export const ContactSheet = ({ open, onOpenChange }: ContactSheetProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [division, setDivision] = useState<Division>("");
  const [formData, setFormData] = useState({
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
    // Careers fields
    positionInterest: "",
    experienceLevel: "",
    currentCompany: "",
    linkedinUrl: "",
    referralSource: "",
  });

  // Reset form when sheet closes
  useEffect(() => {
    if (!open) {
      setDivision("");
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
        positionInterest: "",
        experienceLevel: "",
        currentCompany: "",
        linkedinUrl: "",
        referralSource: "",
      });
    }
  }, [open]);

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

      toast.success("Thank you. Your inquiry has been received and will be routed to the appropriate team.");
      onOpenChange(false);
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-[600px] overflow-y-auto bg-zinc-900/95 backdrop-blur-2xl border-l border-white/20 shadow-2xl text-white"
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl md:text-2xl font-light text-white animate-fade-in">
            Connect with BRIDGE
          </SheetTitle>
          <SheetDescription className="font-light text-sm md:text-base text-white/70 animate-fade-in" style={{ animationDelay: '50ms' }}>
            Tell us who you are trying to reach and what you are working on. We will route your inquiry to the right team.
          </SheetDescription>
        </SheetHeader>

        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 pb-6 border-b border-white/10 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="group text-center">
            <div className="w-10 h-10 mx-auto rounded-full bg-white/10 flex items-center justify-center mb-2 group-hover:bg-white/20 transition-colors">
              <MapPin className="text-white/80" size={16} />
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              600 Third Ave<br />NYC, 10016
            </p>
          </div>

          <div className="group text-center">
            <div className="w-10 h-10 mx-auto rounded-full bg-white/10 flex items-center justify-center mb-2 group-hover:bg-white/20 transition-colors">
              <Phone className="text-white/80" size={16} />
            </div>
            <a href={`tel:${COMPANY_INFO.contact.phone.replace(/\D/g, '')}`} className="text-xs text-white/60 hover:text-white transition-colors">
              {COMPANY_INFO.contact.phone}
            </a>
          </div>

          <div className="group text-center">
            <div className="w-10 h-10 mx-auto rounded-full bg-white/10 flex items-center justify-center mb-2 group-hover:bg-white/20 transition-colors">
              <Mail className="text-white/80" size={16} />
            </div>
            <a href="mailto:office@bridgenyre.com" className="text-xs text-white/60 hover:text-white transition-colors break-all">
              office@bridgenyre.com
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Base Fields */}
          <div className="animate-fade-in" style={{ animationDelay: '150ms' }}>
            <Label htmlFor="fullName" className="font-light text-white/80 text-xs">Full Name *</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              required
              className="mt-1 h-11 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
            />
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <Label htmlFor="email" className="font-light text-white/80 text-xs">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
              className="mt-1 h-11 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
            />
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '250ms' }}>
            <Label htmlFor="phone" className="font-light text-white/80 text-xs">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="mt-1 h-11 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
            />
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
            <Label htmlFor="preferredContact" className="font-light text-white/80 text-xs">Preferred Contact Method</Label>
            <Select
              value={formData.preferredContact}
              onValueChange={(value) => handleInputChange("preferredContact", value)}
            >
              <SelectTrigger className="mt-1 h-11 bg-white/5 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-white/20">
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '350ms' }}>
            <Label htmlFor="division" className="font-light text-white/80 text-xs">I am looking to contact the following division *</Label>
            <Select
              value={division}
              onValueChange={(value) => setDivision(value as Division)}
              required
            >
              <SelectTrigger className="mt-1 h-11 bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Select a division" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-white/20">
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial-leasing">Commercial Leasing</SelectItem>
                <SelectItem value="investment-sales">Investment Sales</SelectItem>
                <SelectItem value="capital-advisory">Capital Advisory</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="billboard">Billboard</SelectItem>
                <SelectItem value="careers">Careers</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Conditional Fields - Residential */}
          {division === "residential" && (
            <div className="space-y-4 p-4 rounded-lg border border-white/10 bg-white/5 animate-fade-in">
              <h3 className="font-light text-sm text-white/90 mb-3">Residential Details</h3>
              <div>
                <Label className="font-light text-white/80 text-xs">Are you an Owner, Buyer, or Renter?</Label>
                <Select value={formData.userType} onValueChange={(value) => handleInputChange("userType", value)}>
                  <SelectTrigger className="mt-1 h-11 bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/20">
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="buyer">Buyer</SelectItem>
                    <SelectItem value="renter">Renter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-light text-white/80 text-xs">Property Type</Label>
                <Select value={formData.propertyType} onValueChange={(value) => handleInputChange("propertyType", value)}>
                  <SelectTrigger className="mt-1 h-11 bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/20">
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                    <SelectItem value="building">Building</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-light text-white/80 text-xs">Approximate Budget or Price Range</Label>
                <Input
                  value={formData.budgetRange}
                  onChange={(e) => handleInputChange("budgetRange", e.target.value)}
                  placeholder="e.g., $3,000-$5,000/month"
                  className="mt-1 h-11 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                />
              </div>
              <div>
                <Label className="font-light text-white/80 text-xs">Preferred Neighborhoods</Label>
                <Input
                  value={formData.neighborhoods}
                  onChange={(e) => handleInputChange("neighborhoods", e.target.value)}
                  placeholder="e.g., Tribeca, SoHo"
                  className="mt-1 h-11 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                />
              </div>
              <div>
                <Label className="font-light text-white/80 text-xs">Timing</Label>
                <Select value={formData.timing} onValueChange={(value) => handleInputChange("timing", value)}>
                  <SelectTrigger className="mt-1 h-11 bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/20">
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
            <div className="space-y-4 p-4 rounded-lg border border-white/10 bg-white/5 animate-fade-in">
              <h3 className="font-light text-sm text-white/90 mb-3">Commercial Leasing Details</h3>
              <div>
                <Label className="font-light text-white/80 text-xs">Are you a Tenant or Landlord?</Label>
                <Select value={formData.tenantLandlord} onValueChange={(value) => handleInputChange("tenantLandlord", value)}>
                  <SelectTrigger className="mt-1 h-11 bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/20">
                    <SelectItem value="tenant">Tenant</SelectItem>
                    <SelectItem value="landlord">Landlord</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-light text-white/80 text-xs">Use Type</Label>
                <Select value={formData.useType} onValueChange={(value) => handleInputChange("useType", value)}>
                  <SelectTrigger className="mt-1 h-11 bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/20">
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-light text-white/80 text-xs">Approximate Square Footage</Label>
                <Input
                  value={formData.squareFootage}
                  onChange={(e) => handleInputChange("squareFootage", e.target.value)}
                  placeholder="e.g., 5,000 SF"
                  className="mt-1 h-11 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                />
              </div>
              <div>
                <Label className="font-light text-white/80 text-xs">Target Neighborhood</Label>
                <Input
                  value={formData.targetSubmarket}
                  onChange={(e) => handleInputChange("targetSubmarket", e.target.value)}
                  placeholder="e.g., Midtown, FiDi"
                  className="mt-1 h-11 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                />
              </div>
              <div>
                <Label className="font-light text-white/80 text-xs">Desired Lease Start Date</Label>
                <Input
                  type="date"
                  value={formData.leaseStartDate}
                  onChange={(e) => handleInputChange("leaseStartDate", e.target.value)}
                  className="mt-1 h-11 bg-white/5 border-white/20 text-white"
                />
              </div>
            </div>
          )}

          {/* Conditional Fields - Investment Sales */}
          {division === "investment-sales" && (
            <div className="space-y-4 p-4 rounded-lg border border-white/10 bg-white/5 animate-fade-in">
              <h3 className="font-light text-sm text-white/90 mb-3">Investment Sales Details</h3>
              <div>
                <Label className="font-light text-white/80 text-xs">Are you an Owner, Buyer, or Broker?</Label>
                <Select value={formData.ownerBuyerBroker} onValueChange={(value) => handleInputChange("ownerBuyerBroker", value)}>
                  <SelectTrigger className="mt-1 h-11 bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/20">
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="buyer">Buyer</SelectItem>
                    <SelectItem value="broker">Broker</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-light text-white/80 text-xs">Asset Class</Label>
                <Select value={formData.assetClass} onValueChange={(value) => handleInputChange("assetClass", value)}>
                  <SelectTrigger className="mt-1 h-11 bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/20">
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
                <Label className="font-light text-white/80 text-xs">Approximate Deal Size</Label>
                <Input
                  value={formData.dealSize}
                  onChange={(e) => handleInputChange("dealSize", e.target.value)}
                  placeholder="e.g., $5M-$10M"
                  className="mt-1 h-11 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                />
              </div>
              <div>
                <Label className="font-light text-white/80 text-xs">Asset Location</Label>
                <Input
                  value={formData.assetLocation}
                  onChange={(e) => handleInputChange("assetLocation", e.target.value)}
                  placeholder="e.g., Brooklyn, UWS"
                  className="mt-1 h-11 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                />
              </div>
              <div>
                <Label className="font-light text-white/80 text-xs">Timing To Transact</Label>
                <Select value={formData.timingToTransact} onValueChange={(value) => handleInputChange("timingToTransact", value)}>
                  <SelectTrigger className="mt-1 h-11 bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/20">
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
            <div className="space-y-4 p-4 rounded-lg border border-white/10 bg-white/5 animate-fade-in">
              <h3 className="font-light text-sm text-white/90 mb-3">Capital Advisory Details</h3>
              <div>
                <Label className="font-light text-white/80 text-xs">Capital Need Type</Label>
                <Select value={formData.capitalNeedType} onValueChange={(value) => handleInputChange("capitalNeedType", value)}>
                  <SelectTrigger className="mt-1 h-11 bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/20">
                    <SelectItem value="debt">Debt</SelectItem>
                    <SelectItem value="equity">Equity</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                    <SelectItem value="not-sure">Not Sure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-light text-white/80 text-xs">Approximate Project Size</Label>
                <Input
                  value={formData.projectSize}
                  onChange={(e) => handleInputChange("projectSize", e.target.value)}
                  placeholder="e.g., $10M"
                  className="mt-1 h-11 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                />
              </div>
              <div>
                <Label className="font-light text-white/80 text-xs">Asset Type</Label>
                <Input
                  value={formData.assetType}
                  onChange={(e) => handleInputChange("assetType", e.target.value)}
                  placeholder="e.g., Multifamily, Office"
                  className="mt-1 h-11 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                />
              </div>
              <div>
                <Label className="font-light text-white/80 text-xs">Use Case</Label>
                <Select value={formData.useCase} onValueChange={(value) => handleInputChange("useCase", value)}>
                  <SelectTrigger className="mt-1 h-11 bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/20">
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
            <div className="space-y-4 p-4 rounded-lg border border-white/10 bg-white/5 animate-fade-in">
              <h3 className="font-light text-sm text-white/90 mb-3">Marketing Details</h3>
              <div>
                <Label className="font-light text-white/80 text-xs">Are you an Owner, Developer, Broker, or Brand?</Label>
                <Select value={formData.clientType} onValueChange={(value) => handleInputChange("clientType", value)}>
                  <SelectTrigger className="mt-1 h-11 bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/20">
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="broker">Broker</SelectItem>
                    <SelectItem value="brand">Brand</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-light text-white/80 text-xs">Type Of Project</Label>
                <Select value={formData.projectType} onValueChange={(value) => handleInputChange("projectType", value)}>
                  <SelectTrigger className="mt-1 h-11 bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/20">
                    <SelectItem value="property">Property</SelectItem>
                    <SelectItem value="portfolio">Portfolio</SelectItem>
                    <SelectItem value="brand">Brand</SelectItem>
                    <SelectItem value="campaign">Campaign</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-light text-white/80 text-xs">Primary Marketing Need</Label>
                <Select value={formData.marketingNeed} onValueChange={(value) => handleInputChange("marketingNeed", value)}>
                  <SelectTrigger className="mt-1 h-11 bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/20">
                    <SelectItem value="creative">Creative</SelectItem>
                    <SelectItem value="digital">Digital</SelectItem>
                    <SelectItem value="strategy">Strategy</SelectItem>
                    <SelectItem value="full-scope">Full Scope</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-light text-white/80 text-xs">Timeline And Launch Window</Label>
                <Input
                  value={formData.timeline}
                  onChange={(e) => handleInputChange("timeline", e.target.value)}
                  placeholder="e.g., Q1 2025"
                  className="mt-1 h-11 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                />
              </div>
            </div>
          )}

          {/* Conditional Fields - Billboard */}
          {division === "billboard" && (
            <div className="space-y-4 p-4 rounded-lg border border-white/10 bg-white/5 animate-fade-in">
              <h3 className="font-light text-sm text-white/90 mb-3">Billboard Details</h3>
              <div>
                <Label className="font-light text-white/80 text-xs">Client Type</Label>
                <Select value={formData.billboardClientType} onValueChange={(value) => handleInputChange("billboardClientType", value)}>
                  <SelectTrigger className="mt-1 h-11 bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/20">
                    <SelectItem value="brand">Brand / Advertiser</SelectItem>
                    <SelectItem value="agency">Agency</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="landlord">Landlord / Property Owner</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-light text-white/80 text-xs">Campaign Type</Label>
                <Select value={formData.campaignType} onValueChange={(value) => handleInputChange("campaignType", value)}>
                  <SelectTrigger className="mt-1 h-11 bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/20">
                    <SelectItem value="brand-awareness">Brand Awareness</SelectItem>
                    <SelectItem value="product-launch">Product Launch</SelectItem>
                    <SelectItem value="event-promotion">Event Promotion</SelectItem>
                    <SelectItem value="real-estate">Real Estate Marketing</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-light text-white/80 text-xs">Budget Range</Label>
                <Select value={formData.budgetRangeBillboard} onValueChange={(value) => handleInputChange("budgetRangeBillboard", value)}>
                  <SelectTrigger className="mt-1 h-11 bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/20">
                    <SelectItem value="under-10k">Under $10,000</SelectItem>
                    <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                    <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                    <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                    <SelectItem value="over-100k">Over $100,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-light text-white/80 text-xs">Campaign Timing</Label>
                <Select value={formData.campaignTiming} onValueChange={(value) => handleInputChange("campaignTiming", value)}>
                  <SelectTrigger className="mt-1 h-11 bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/20">
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

          {/* Conditional Fields - Careers */}
          {division === "careers" && (
            <div className="space-y-4 p-4 rounded-lg border border-white/10 bg-white/5 animate-fade-in">
              <h3 className="font-light text-sm text-white/90 mb-3">Career Inquiry Details</h3>
              <div>
                <Label className="font-light text-white/80 text-xs">Position of Interest</Label>
                <Select value={formData.positionInterest} onValueChange={(value) => handleInputChange("positionInterest", value)}>
                  <SelectTrigger className="mt-1 h-11 bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/20">
                    <SelectItem value="investment-sales-associate">Investment Sales Associate</SelectItem>
                    <SelectItem value="residential-agent">Residential Leasing Agent</SelectItem>
                    <SelectItem value="commercial-leasing">Commercial Leasing Associate</SelectItem>
                    <SelectItem value="capital-advisory">Capital Advisory Analyst</SelectItem>
                    <SelectItem value="marketing-coordinator">Marketing Coordinator</SelectItem>
                    <SelectItem value="operations">Operations / Admin</SelectItem>
                    <SelectItem value="general">General / Open Application</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-light text-white/80 text-xs">Experience Level</Label>
                <Select value={formData.experienceLevel} onValueChange={(value) => handleInputChange("experienceLevel", value)}>
                  <SelectTrigger className="mt-1 h-11 bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/20">
                    <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                    <SelectItem value="mid">Mid Level (2-5 years)</SelectItem>
                    <SelectItem value="senior">Senior Level (5+ years)</SelectItem>
                    <SelectItem value="executive">Executive / Leadership</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-light text-white/80 text-xs">Current or Most Recent Employer</Label>
                <Input
                  value={formData.currentCompany}
                  onChange={(e) => handleInputChange("currentCompany", e.target.value)}
                  placeholder="e.g., CBRE, Cushman & Wakefield"
                  className="mt-1 h-11 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                />
              </div>
              <div>
                <Label className="font-light text-white/80 text-xs">LinkedIn Profile URL</Label>
                <Input
                  value={formData.linkedinUrl}
                  onChange={(e) => handleInputChange("linkedinUrl", e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="mt-1 h-11 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                />
              </div>
              <div>
                <Label className="font-light text-white/80 text-xs">How Did You Hear About Us?</Label>
                <Select value={formData.referralSource} onValueChange={(value) => handleInputChange("referralSource", value)}>
                  <SelectTrigger className="mt-1 h-11 bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/20">
                    <SelectItem value="website">Bridge Website</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="referral">Employee Referral</SelectItem>
                    <SelectItem value="indeed">Indeed</SelectItem>
                    <SelectItem value="university">University / Campus Recruiting</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Message Field */}
          <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
            <Label htmlFor="message" className="font-light text-white/80 text-xs">Briefly describe what you are looking for</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              rows={4}
              className="mt-1 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
              placeholder="Tell us about your needs..."
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            size="lg" 
            className="w-full font-light bg-white text-black hover:bg-white/90 animate-fade-in" 
            style={{ animationDelay: '450ms' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Inquiry"}
          </Button>
        </form>

        {/* Social Links */}
        <div className="flex justify-center gap-4 pt-6 mt-6 border-t border-white/10 animate-fade-in" style={{ animationDelay: '500ms' }}>
          <a
            href="https://linkedin.com/company/bridge-advisory-group"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300"
          >
            <Linkedin size={18} />
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
};
