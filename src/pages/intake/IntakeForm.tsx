import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle2, Building2, Home, Briefcase, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useIntakeLinkByCode, useCreateIntakeSubmission } from "@/hooks/useIntake";
import { cn } from "@/lib/utils";

const baseSchema = z.object({
  client_name: z.string().min(2, "Name is required"),
  client_email: z.string().email("Valid email required"),
  client_phone: z.string().optional(),
  client_company: z.string().optional(),
  notes: z.string().optional(),
});

const divisions = [
  { id: "investment-sales", name: "Investment Sales", icon: Building2, description: "Commercial property acquisitions" },
  { id: "commercial-leasing", name: "Commercial Leasing", icon: Briefcase, description: "Office, retail, and industrial spaces" },
  { id: "residential", name: "Residential", icon: Home, description: "Rentals and home purchases" },
];

export default function IntakeForm() {
  const { linkCode } = useParams<{ linkCode: string }>();
  const navigate = useNavigate();
  const [selectedDivision, setSelectedDivision] = useState<string | null>(null);
  const [step, setStep] = useState<"division" | "info" | "criteria" | "success">("division");
  const [criteria, setCriteria] = useState<Record<string, unknown>>({});

  const { data: link, isLoading: linkLoading, error: linkError } = useIntakeLinkByCode(linkCode || "");
  const createSubmission = useCreateIntakeSubmission();

  const form = useForm({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      client_name: "",
      client_email: "",
      client_phone: "",
      client_company: "",
      notes: "",
    },
  });

  // If link has a locked division, use it
  const effectiveDivision = link?.division || selectedDivision;

  const handleDivisionSelect = (div: string) => {
    setSelectedDivision(div);
    setStep("info");
  };

  const handleInfoSubmit = () => {
    form.trigger(["client_name", "client_email"]).then((valid) => {
      if (valid) setStep("criteria");
    });
  };

  const handleFinalSubmit = async () => {
    const values = form.getValues();
    
    try {
      await createSubmission.mutateAsync({
        link_id: link?.id,
        agent_id: link!.agent_id,
        division: effectiveDivision!,
        client_name: values.client_name,
        client_email: values.client_email,
        client_phone: values.client_phone || undefined,
        client_company: values.client_company || undefined,
        criteria,
        notes: values.notes || undefined,
      });
      setStep("success");
    } catch (error) {
      // Error handled by mutation
    }
  };

  if (linkLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (linkError || !link) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-destructive">Link Not Found</CardTitle>
            <CardDescription>
              This intake link is invalid, expired, or no longer active.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <CardTitle>Thank You!</CardTitle>
            <CardDescription>
              Your information has been submitted successfully. An agent will be in touch with you shortly.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <img 
            src="/lovable-uploads/20d12fb8-7a61-4b15-bf8f-cdd401ddb12d.png" 
            alt="Bridge" 
            className="h-14 mx-auto mb-6"
          />
          <h1 className="text-3xl font-semibold tracking-tight">{link.name}</h1>
          <p className="text-muted-foreground mt-2 text-base">Tell us what you're looking for</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {["division", "info", "criteria"].map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 shadow-sm",
                step === s
                  ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                  : ["info", "criteria"].indexOf(step) > i || (link.division && i === 0)
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
              )}>
                {i + 1}
              </div>
              {i < 2 && <div className="w-12 h-0.5 bg-border rounded-full" />}
            </div>
          ))}
        </div>

        {/* Division Selection */}
        {step === "division" && !link.division && (
          <Card className="shadow-lg border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">What are you interested in?</CardTitle>
              <CardDescription className="text-base">Select the type of service you're looking for</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {divisions.map((div) => {
                const Icon = div.icon;
                return (
                  <button
                    key={div.id}
                    onClick={() => handleDivisionSelect(div.id)}
                    className="w-full p-5 rounded-xl border border-border hover:border-primary hover:bg-accent/50 hover:shadow-md transition-all duration-200 flex items-center gap-5 text-left group"
                  >
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-105 transition-all duration-200">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-base">{div.name}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{div.description}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                  </button>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* If division is locked, skip to info */}
        {step === "division" && link.division && (
          <div className="text-center">
            <Button onClick={() => setStep("info")} size="lg">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Client Info */}
        {step === "info" && (
          <Card className="shadow-lg border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Your Information</CardTitle>
              <CardDescription className="text-base">How can we reach you?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2.5">
                  <Label htmlFor="client_name" className="text-sm font-medium">Full Name *</Label>
                  <Input 
                    id="client_name" 
                    {...form.register("client_name")} 
                    placeholder="John Smith"
                    className="h-11"
                  />
                  {form.formState.errors.client_name && (
                    <p className="text-sm text-destructive">{form.formState.errors.client_name.message}</p>
                  )}
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="client_email" className="text-sm font-medium">Email *</Label>
                  <Input 
                    id="client_email" 
                    type="email"
                    {...form.register("client_email")} 
                    placeholder="john@example.com"
                    className="h-11"
                  />
                  {form.formState.errors.client_email && (
                    <p className="text-sm text-destructive">{form.formState.errors.client_email.message}</p>
                  )}
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2.5">
                  <Label htmlFor="client_phone" className="text-sm font-medium">Phone</Label>
                  <Input 
                    id="client_phone" 
                    {...form.register("client_phone")} 
                    placeholder="(555) 123-4567"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="client_company" className="text-sm font-medium">Company</Label>
                  <Input 
                    id="client_company" 
                    {...form.register("client_company")} 
                    placeholder="Company name"
                    className="h-11"
                  />
                </div>
              </div>
              <div className="flex justify-between pt-6 border-t border-border/50">
                {!link.division && (
                  <Button variant="outline" onClick={() => setStep("division")} size="lg">
                    Back
                  </Button>
                )}
                <Button onClick={handleInfoSubmit} className="ml-auto" size="lg">
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Criteria Form */}
        {step === "criteria" && (
          <Card className="shadow-lg border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">
                {effectiveDivision === "investment-sales" && "Investment Criteria"}
                {effectiveDivision === "commercial-leasing" && "Space Requirements"}
                {effectiveDivision === "residential" && "Home Search Criteria"}
              </CardTitle>
              <CardDescription className="text-base">Help us understand what you're looking for</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {effectiveDivision === "investment-sales" && (
                <InvestmentSalesCriteria criteria={criteria} setCriteria={setCriteria} />
              )}
              {effectiveDivision === "commercial-leasing" && (
                <CommercialLeasingCriteria criteria={criteria} setCriteria={setCriteria} />
              )}
              {effectiveDivision === "residential" && (
                <ResidentialCriteria criteria={criteria} setCriteria={setCriteria} />
              )}

              <div className="space-y-2.5">
                <Label htmlFor="notes" className="text-sm font-medium">Additional Notes</Label>
                <Textarea 
                  id="notes" 
                  {...form.register("notes")} 
                  placeholder="Any other details or preferences..."
                  rows={4}
                  className="resize-none"
                />
              </div>

              <div className="flex justify-between pt-6 border-t border-border/50">
                <Button variant="outline" onClick={() => setStep("info")} size="lg">
                  Back
                </Button>
                <Button 
                  onClick={handleFinalSubmit} 
                  disabled={createSubmission.isPending}
                  size="lg"
                >
                  {createSubmission.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Investment Sales Criteria
function InvestmentSalesCriteria({ 
  criteria, 
  setCriteria 
}: { 
  criteria: Record<string, unknown>; 
  setCriteria: (c: Record<string, unknown>) => void;
}) {
  const update = (key: string, value: unknown) => {
    setCriteria({ ...criteria, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Budget Range</Label>
          <Select onValueChange={(v) => update("budget_range", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="under-5m">Under $5M</SelectItem>
              <SelectItem value="5m-10m">$5M - $10M</SelectItem>
              <SelectItem value="10m-25m">$10M - $25M</SelectItem>
              <SelectItem value="25m-50m">$25M - $50M</SelectItem>
              <SelectItem value="50m-100m">$50M - $100M</SelectItem>
              <SelectItem value="over-100m">$100M+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Target Cap Rate</Label>
          <Select onValueChange={(v) => update("target_cap_rate", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select cap rate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3-4">3% - 4%</SelectItem>
              <SelectItem value="4-5">4% - 5%</SelectItem>
              <SelectItem value="5-6">5% - 6%</SelectItem>
              <SelectItem value="6-7">6% - 7%</SelectItem>
              <SelectItem value="7-plus">7%+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Property Types (select all that apply)</Label>
        <div className="grid grid-cols-2 gap-2">
          {["Multifamily", "Mixed-Use", "Office", "Retail", "Industrial", "Development Site"].map((type) => (
            <label key={type} className="flex items-center gap-2 p-2 rounded border border-border hover:bg-accent/50 cursor-pointer">
              <Checkbox 
                onCheckedChange={(checked) => {
                  const types = (criteria.property_types as string[]) || [];
                  if (checked) {
                    update("property_types", [...types, type]);
                  } else {
                    update("property_types", types.filter((t) => t !== type));
                  }
                }}
              />
              <span className="text-sm">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Target Boroughs/Areas</Label>
        <div className="grid grid-cols-3 gap-2">
          {["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island", "Westchester"].map((area) => (
            <label key={area} className="flex items-center gap-2 p-2 rounded border border-border hover:bg-accent/50 cursor-pointer">
              <Checkbox 
                onCheckedChange={(checked) => {
                  const areas = (criteria.target_areas as string[]) || [];
                  if (checked) {
                    update("target_areas", [...areas, area]);
                  } else {
                    update("target_areas", areas.filter((a) => a !== area));
                  }
                }}
              />
              <span className="text-sm">{area}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Minimum Units</Label>
          <Input 
            type="number" 
            placeholder="e.g., 10"
            onChange={(e) => update("min_units", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Timeline</Label>
          <Select onValueChange={(v) => update("timeline", v)}>
            <SelectTrigger>
              <SelectValue placeholder="When looking to close?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asap">ASAP</SelectItem>
              <SelectItem value="1-3-months">1-3 Months</SelectItem>
              <SelectItem value="3-6-months">3-6 Months</SelectItem>
              <SelectItem value="6-12-months">6-12 Months</SelectItem>
              <SelectItem value="exploring">Just Exploring</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>1031 Exchange?</Label>
        <RadioGroup onValueChange={(v) => update("is_1031", v)}>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <RadioGroupItem value="yes" />
              <span>Yes</span>
            </label>
            <label className="flex items-center gap-2">
              <RadioGroupItem value="no" />
              <span>No</span>
            </label>
            <label className="flex items-center gap-2">
              <RadioGroupItem value="maybe" />
              <span>Maybe</span>
            </label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}

// Commercial Leasing Criteria
function CommercialLeasingCriteria({ 
  criteria, 
  setCriteria 
}: { 
  criteria: Record<string, unknown>; 
  setCriteria: (c: Record<string, unknown>) => void;
}) {
  const update = (key: string, value: unknown) => {
    setCriteria({ ...criteria, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Space Type</Label>
        <Select onValueChange={(v) => update("space_type", v)}>
          <SelectTrigger>
            <SelectValue placeholder="What type of space?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="office">Office</SelectItem>
            <SelectItem value="retail">Retail</SelectItem>
            <SelectItem value="flex">Flex/Creative</SelectItem>
            <SelectItem value="medical">Medical</SelectItem>
            <SelectItem value="restaurant">Restaurant</SelectItem>
            <SelectItem value="industrial">Industrial/Warehouse</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Minimum SF</Label>
          <Input 
            type="number" 
            placeholder="e.g., 1000"
            onChange={(e) => update("min_sf", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Maximum SF</Label>
          <Input 
            type="number" 
            placeholder="e.g., 5000"
            onChange={(e) => update("max_sf", e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Budget (per SF/year)</Label>
          <Select onValueChange={(v) => update("budget_psf", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="under-50">Under $50 PSF</SelectItem>
              <SelectItem value="50-75">$50 - $75 PSF</SelectItem>
              <SelectItem value="75-100">$75 - $100 PSF</SelectItem>
              <SelectItem value="100-150">$100 - $150 PSF</SelectItem>
              <SelectItem value="150-plus">$150+ PSF</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Lease Term</Label>
          <Select onValueChange={(v) => update("lease_term", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Preferred term" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-3">1-3 Years</SelectItem>
              <SelectItem value="3-5">3-5 Years</SelectItem>
              <SelectItem value="5-10">5-10 Years</SelectItem>
              <SelectItem value="10-plus">10+ Years</SelectItem>
              <SelectItem value="flexible">Flexible</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Preferred Neighborhoods</Label>
        <Textarea 
          placeholder="e.g., Midtown, FiDi, Tribeca..."
          onChange={(e) => update("neighborhoods", e.target.value)}
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label>Timeline</Label>
        <Select onValueChange={(v) => update("timeline", v)}>
          <SelectTrigger>
            <SelectValue placeholder="When do you need space?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="immediate">Immediately</SelectItem>
            <SelectItem value="1-3-months">1-3 Months</SelectItem>
            <SelectItem value="3-6-months">3-6 Months</SelectItem>
            <SelectItem value="6-plus-months">6+ Months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Special Requirements</Label>
        <div className="grid grid-cols-2 gap-2">
          {["Ground Floor", "Outdoor Space", "High Ceilings", "Signage", "Venting/Exhaust", "Loading Dock"].map((req) => (
            <label key={req} className="flex items-center gap-2 p-2 rounded border border-border hover:bg-accent/50 cursor-pointer">
              <Checkbox 
                onCheckedChange={(checked) => {
                  const reqs = (criteria.special_requirements as string[]) || [];
                  if (checked) {
                    update("special_requirements", [...reqs, req]);
                  } else {
                    update("special_requirements", reqs.filter((r) => r !== req));
                  }
                }}
              />
              <span className="text-sm">{req}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

// Residential Criteria
function ResidentialCriteria({ 
  criteria, 
  setCriteria 
}: { 
  criteria: Record<string, unknown>; 
  setCriteria: (c: Record<string, unknown>) => void;
}) {
  const update = (key: string, value: unknown) => {
    setCriteria({ ...criteria, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Are you looking to...</Label>
        <RadioGroup onValueChange={(v) => update("intent", v)}>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <RadioGroupItem value="rent" />
              <span>Rent</span>
            </label>
            <label className="flex items-center gap-2">
              <RadioGroupItem value="buy" />
              <span>Buy</span>
            </label>
            <label className="flex items-center gap-2">
              <RadioGroupItem value="both" />
              <span>Either</span>
            </label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Budget</Label>
          <Select onValueChange={(v) => update("budget", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              {criteria.intent === "buy" ? (
                <>
                  <SelectItem value="under-500k">Under $500K</SelectItem>
                  <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                  <SelectItem value="1m-2m">$1M - $2M</SelectItem>
                  <SelectItem value="2m-5m">$2M - $5M</SelectItem>
                  <SelectItem value="5m-plus">$5M+</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="under-2500">Under $2,500/mo</SelectItem>
                  <SelectItem value="2500-4000">$2,500 - $4,000/mo</SelectItem>
                  <SelectItem value="4000-6000">$4,000 - $6,000/mo</SelectItem>
                  <SelectItem value="6000-10000">$6,000 - $10,000/mo</SelectItem>
                  <SelectItem value="10000-plus">$10,000+/mo</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Move-in Date</Label>
          <Select onValueChange={(v) => update("move_in", v)}>
            <SelectTrigger>
              <SelectValue placeholder="When?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asap">ASAP</SelectItem>
              <SelectItem value="1-month">Within 1 Month</SelectItem>
              <SelectItem value="1-3-months">1-3 Months</SelectItem>
              <SelectItem value="3-plus-months">3+ Months</SelectItem>
              <SelectItem value="flexible">Flexible</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Bedrooms</Label>
          <Select onValueChange={(v) => update("bedrooms", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="studio">Studio</SelectItem>
              <SelectItem value="1">1 Bedroom</SelectItem>
              <SelectItem value="2">2 Bedrooms</SelectItem>
              <SelectItem value="3">3 Bedrooms</SelectItem>
              <SelectItem value="4-plus">4+ Bedrooms</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Bathrooms</Label>
          <Select onValueChange={(v) => update("bathrooms", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Bathroom</SelectItem>
              <SelectItem value="1.5">1.5 Bathrooms</SelectItem>
              <SelectItem value="2">2 Bathrooms</SelectItem>
              <SelectItem value="2.5-plus">2.5+ Bathrooms</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Preferred Neighborhoods</Label>
        <Textarea 
          placeholder="e.g., Upper East Side, Williamsburg, Park Slope..."
          onChange={(e) => update("neighborhoods", e.target.value)}
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label>Must-Have Amenities</Label>
        <div className="grid grid-cols-2 gap-2">
          {["Doorman", "Laundry In-Unit", "Dishwasher", "Outdoor Space", "Gym", "Pet Friendly", "Parking", "Central AC"].map((amenity) => (
            <label key={amenity} className="flex items-center gap-2 p-2 rounded border border-border hover:bg-accent/50 cursor-pointer">
              <Checkbox 
                onCheckedChange={(checked) => {
                  const amenities = (criteria.amenities as string[]) || [];
                  if (checked) {
                    update("amenities", [...amenities, amenity]);
                  } else {
                    update("amenities", amenities.filter((a) => a !== amenity));
                  }
                }}
              />
              <span className="text-sm">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Do you have pets?</Label>
        <RadioGroup onValueChange={(v) => update("has_pets", v)}>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <RadioGroupItem value="no" />
              <span>No</span>
            </label>
            <label className="flex items-center gap-2">
              <RadioGroupItem value="dog" />
              <span>Dog</span>
            </label>
            <label className="flex items-center gap-2">
              <RadioGroupItem value="cat" />
              <span>Cat</span>
            </label>
            <label className="flex items-center gap-2">
              <RadioGroupItem value="both" />
              <span>Both</span>
            </label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
