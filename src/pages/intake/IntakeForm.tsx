import { useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle2, Building2, Home, Briefcase, ArrowRight, ArrowLeft, Clock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useIntakeLinkByCode, useCreateIntakeSubmission } from "@/hooks/useIntake";
import { cn } from "@/lib/utils";

const baseSchema = z.object({
  client_name: z.string().min(2, "Name is required").max(100, "Name is too long"),
  client_email: z.string().email("Valid email required").max(255, "Email is too long"),
  client_phone: z.string().max(30, "Phone is too long").optional(),
  client_company: z.string().max(100, "Company name is too long").optional(),
  notes: z.string().max(1000, "Notes must be under 1000 characters").optional(),
});

const divisions = [
  { id: "investment-sales", name: "Investment Sales", icon: Building2, description: "Commercial property acquisitions" },
  { id: "commercial-leasing", name: "Commercial Leasing", icon: Briefcase, description: "Office, retail, and industrial spaces" },
  { id: "residential", name: "Residential", icon: Home, description: "Rentals and home purchases" },
];

const stepLabels = ["Sector", "Contact", "Criteria"];

export default function IntakeForm() {
  const { linkCode } = useParams<{ linkCode: string }>();
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
        client_name: values.client_name.trim(),
        client_email: values.client_email.trim().toLowerCase(),
        client_phone: values.client_phone?.trim() || undefined,
        client_company: values.client_company?.trim() || undefined,
        criteria,
        notes: values.notes?.trim() || undefined,
      });
      setStep("success");
    } catch {
      // Error handled by mutation
    }
  };

  const getCurrentStepIndex = () => {
    if (step === "division") return 0;
    if (step === "info") return 1;
    return 2;
  };

  if (linkLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading form...</p>
        </div>
      </div>
    );
  }

  if (linkError || !link) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <CardTitle className="text-destructive">Link Not Found</CardTitle>
            <CardDescription className="text-base">
              This intake link is invalid, expired, or no longer active.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
        <Card className="max-w-md w-full shadow-lg">
          <CardHeader className="text-center space-y-6 pb-8">
            <div className="mx-auto w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl">Thank You!</CardTitle>
              <CardDescription className="text-base">
                Your information has been submitted successfully.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Expected Response Time</p>
                <p className="text-sm text-muted-foreground">We'll be in touch within 24-48 hours</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Check Your Email</p>
                <p className="text-sm text-muted-foreground">You may receive a confirmation email shortly</p>
              </div>
            </div>

            <div className="pt-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setStep("division");
                  setSelectedDivision(null);
                  setCriteria({});
                  form.reset();
                }}
              >
                Submit Another Request
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/20d12fb8-7a61-4b15-bf8f-cdd401ddb12d.png" 
            alt="Bridge" 
            className="h-12 mx-auto mb-6"
          />
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Client Intake Form</h1>
          <p className="text-muted-foreground mt-2">Tell us what you're looking for</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8">
          {stepLabels.map((label, i) => {
            const currentIndex = getCurrentStepIndex();
            const isActive = i === currentIndex;
            const isCompleted = i < currentIndex || (link.division && i === 0);
            
            return (
              <div key={label} className="flex items-center gap-2 sm:gap-4">
                <div className="flex flex-col items-center gap-1.5">
                  <div className={cn(
                    "w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 shadow-sm",
                    isActive
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                      : isCompleted
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                  )}>
                    {isCompleted && !isActive ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span className={cn(
                    "text-xs font-medium",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}>
                    {label}
                  </span>
                </div>
                {i < 2 && <div className="w-8 sm:w-12 h-0.5 bg-border rounded-full mt-[-20px]" />}
              </div>
            );
          })}
        </div>

        {/* Division Selection */}
        {step === "division" && !link.division && (
          <Card className="shadow-lg border-border/50">
            <CardHeader className="pb-6">
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
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-base">{div.name}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{div.description}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 shrink-0" />
                  </button>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* If division is locked, skip to info */}
        {step === "division" && link.division && (
          <div className="text-center">
            <Button onClick={() => setStep("info")} size="lg" className="min-w-48">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Client Info */}
        {step === "info" && (
          <Card className="shadow-lg border-border/50">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl">Your Information</CardTitle>
              <CardDescription className="text-base">How can we reach you?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="client_name" className="text-sm font-medium">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input 
                    id="client_name" 
                    {...form.register("client_name")} 
                    placeholder="John Smith"
                    className="h-12"
                  />
                  {form.formState.errors.client_name && (
                    <p className="text-sm text-destructive">{form.formState.errors.client_name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client_email" className="text-sm font-medium">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input 
                    id="client_email" 
                    type="email"
                    {...form.register("client_email")} 
                    placeholder="john@example.com"
                    className="h-12"
                  />
                  {form.formState.errors.client_email && (
                    <p className="text-sm text-destructive">{form.formState.errors.client_email.message}</p>
                  )}
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="client_phone" className="text-sm font-medium">Phone</Label>
                  <Input 
                    id="client_phone" 
                    {...form.register("client_phone")} 
                    placeholder="(555) 123-4567"
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client_company" className="text-sm font-medium">Company</Label>
                  <Input 
                    id="client_company" 
                    {...form.register("client_company")} 
                    placeholder="Company name"
                    className="h-12"
                  />
                </div>
              </div>
              <div className="flex justify-between pt-6 border-t border-border/50">
                {!link.division && (
                  <Button variant="outline" onClick={() => setStep("division")} size="lg">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                )}
                <Button onClick={handleInfoSubmit} className={cn(!link.division ? "" : "ml-auto")} size="lg">
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
            <CardHeader className="pb-6">
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

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium">Additional Notes</Label>
                <Textarea 
                  id="notes" 
                  {...form.register("notes")} 
                  placeholder="Any other details or preferences..."
                  rows={4}
                  className="resize-none"
                />
                {form.formState.errors.notes && (
                  <p className="text-sm text-destructive">{form.formState.errors.notes.message}</p>
                )}
              </div>

              <div className="flex justify-between pt-6 border-t border-border/50">
                <Button variant="outline" onClick={() => setStep("info")} size="lg">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button 
                  onClick={handleFinalSubmit} 
                  disabled={createSubmission.isPending}
                  size="lg"
                  className="min-w-32"
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
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Budget Range <span className="text-destructive">*</span>
          </Label>
          <Select onValueChange={(v) => update("budget_range", v)}>
            <SelectTrigger className="h-12">
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
          <Label className="text-sm font-medium">Target Cap Rate</Label>
          <Select onValueChange={(v) => update("target_cap_rate", v)}>
            <SelectTrigger className="h-12">
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
        <Label className="text-sm font-medium">
          Property Types <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {["Multifamily", "Mixed-Use", "Office", "Retail", "Industrial", "Development Site"].map((type) => (
            <label key={type} className="flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-accent/50 cursor-pointer transition-colors min-h-[52px]">
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
              <span className="text-sm font-medium">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Target Boroughs/Areas</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island", "Westchester"].map((area) => (
            <label key={area} className="flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-accent/50 cursor-pointer transition-colors min-h-[52px]">
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
              <span className="text-sm font-medium">{area}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Minimum Units</Label>
          <Input 
            type="number" 
            placeholder="e.g., 10"
            className="h-12"
            onChange={(e) => update("min_units", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Timeline</Label>
          <Select onValueChange={(v) => update("timeline", v)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select timeline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate">Immediate (0-3 months)</SelectItem>
              <SelectItem value="near-term">Near-term (3-6 months)</SelectItem>
              <SelectItem value="mid-term">Mid-term (6-12 months)</SelectItem>
              <SelectItem value="long-term">Long-term (12+ months)</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Space Type <span className="text-destructive">*</span>
          </Label>
          <Select onValueChange={(v) => update("space_type", v)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="office">Office</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="industrial">Industrial/Warehouse</SelectItem>
              <SelectItem value="flex">Flex Space</SelectItem>
              <SelectItem value="medical">Medical/Healthcare</SelectItem>
              <SelectItem value="restaurant">Restaurant</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Square Footage Needed <span className="text-destructive">*</span>
          </Label>
          <Select onValueChange={(v) => update("sf_range", v)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="under-1000">Under 1,000 SF</SelectItem>
              <SelectItem value="1000-2500">1,000 - 2,500 SF</SelectItem>
              <SelectItem value="2500-5000">2,500 - 5,000 SF</SelectItem>
              <SelectItem value="5000-10000">5,000 - 10,000 SF</SelectItem>
              <SelectItem value="10000-25000">10,000 - 25,000 SF</SelectItem>
              <SelectItem value="over-25000">25,000+ SF</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Budget ($/SF/Year)</Label>
          <Select onValueChange={(v) => update("budget_psf", v)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select budget" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="under-30">Under $30/SF</SelectItem>
              <SelectItem value="30-50">$30 - $50/SF</SelectItem>
              <SelectItem value="50-75">$50 - $75/SF</SelectItem>
              <SelectItem value="75-100">$75 - $100/SF</SelectItem>
              <SelectItem value="over-100">$100+/SF</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Lease Term</Label>
          <Select onValueChange={(v) => update("lease_term", v)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select term" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-2">1-2 years</SelectItem>
              <SelectItem value="3-5">3-5 years</SelectItem>
              <SelectItem value="5-10">5-10 years</SelectItem>
              <SelectItem value="10-plus">10+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Preferred Neighborhoods</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {["Midtown", "FiDi", "SoHo", "Chelsea", "Williamsburg", "DUMBO", "LIC", "Other"].map((area) => (
            <label key={area} className="flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-accent/50 cursor-pointer transition-colors min-h-[52px]">
              <Checkbox 
                onCheckedChange={(checked) => {
                  const areas = (criteria.neighborhoods as string[]) || [];
                  if (checked) {
                    update("neighborhoods", [...areas, area]);
                  } else {
                    update("neighborhoods", areas.filter((a) => a !== area));
                  }
                }}
              />
              <span className="text-sm font-medium">{area}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Timeline</Label>
        <Select onValueChange={(v) => update("timeline", v)}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Select timeline" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="immediate">Immediate (0-3 months)</SelectItem>
            <SelectItem value="near-term">Near-term (3-6 months)</SelectItem>
            <SelectItem value="mid-term">Mid-term (6-12 months)</SelectItem>
            <SelectItem value="flexible">Flexible</SelectItem>
          </SelectContent>
        </Select>
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
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Looking to <span className="text-destructive">*</span>
          </Label>
          <Select onValueChange={(v) => update("transaction_type", v)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rent">Rent</SelectItem>
              <SelectItem value="buy">Buy</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Property Type <span className="text-destructive">*</span>
          </Label>
          <Select onValueChange={(v) => update("property_type", v)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="condo">Condo</SelectItem>
              <SelectItem value="coop">Co-op</SelectItem>
              <SelectItem value="townhouse">Townhouse</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="loft">Loft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Bedrooms <span className="text-destructive">*</span>
          </Label>
          <Select onValueChange={(v) => update("bedrooms", v)}>
            <SelectTrigger className="h-12">
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
          <Label className="text-sm font-medium">Bathrooms</Label>
          <Select onValueChange={(v) => update("bathrooms", v)}>
            <SelectTrigger className="h-12">
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
        <Label className="text-sm font-medium">Budget</Label>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input 
            type="text" 
            placeholder="Min (e.g., $3,000 or $500,000)"
            className="h-12"
            onChange={(e) => update("budget_min", e.target.value)}
          />
          <Input 
            type="text" 
            placeholder="Max (e.g., $5,000 or $1,000,000)"
            className="h-12"
            onChange={(e) => update("budget_max", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Preferred Neighborhoods</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {["Manhattan", "Brooklyn", "Queens", "Hoboken", "Jersey City", "Other"].map((area) => (
            <label key={area} className="flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-accent/50 cursor-pointer transition-colors min-h-[52px]">
              <Checkbox 
                onCheckedChange={(checked) => {
                  const areas = (criteria.neighborhoods as string[]) || [];
                  if (checked) {
                    update("neighborhoods", [...areas, area]);
                  } else {
                    update("neighborhoods", areas.filter((a) => a !== area));
                  }
                }}
              />
              <span className="text-sm font-medium">{area}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Move-in Timeline</Label>
        <Select onValueChange={(v) => update("timeline", v)}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Select timeline" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asap">ASAP</SelectItem>
            <SelectItem value="1-month">Within 1 month</SelectItem>
            <SelectItem value="1-3-months">1-3 months</SelectItem>
            <SelectItem value="3-6-months">3-6 months</SelectItem>
            <SelectItem value="flexible">Flexible</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Must-Haves (select all that apply)</Label>
        <div className="grid grid-cols-2 gap-3">
          {["In-unit laundry", "Doorman", "Gym", "Outdoor space", "Pet-friendly", "Parking", "Dishwasher", "Central AC"].map((feature) => (
            <label key={feature} className="flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-accent/50 cursor-pointer transition-colors min-h-[52px]">
              <Checkbox 
                onCheckedChange={(checked) => {
                  const features = (criteria.must_haves as string[]) || [];
                  if (checked) {
                    update("must_haves", [...features, feature]);
                  } else {
                    update("must_haves", features.filter((f) => f !== feature));
                  }
                }}
              />
              <span className="text-sm font-medium">{feature}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
