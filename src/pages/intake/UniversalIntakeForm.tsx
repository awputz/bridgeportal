import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle2, Building2, Home, Briefcase, ArrowRight, ArrowLeft, Clock, Mail, User, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAgentsList, useCreateIntakeSubmission } from "@/hooks/useIntake";
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

const stepLabels = ["Agent", "Sector", "Contact", "Criteria"];

type Step = "agent" | "division" | "info" | "criteria" | "success";

export default function UniversalIntakeForm() {
  const [selectedAgent, setSelectedAgent] = useState<{ id: string; name: string } | null>(null);
  const [isGeneralInquiry, setIsGeneralInquiry] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("agent");
  const [criteria, setCriteria] = useState<Record<string, unknown>>({});

  const { data: agents, isLoading: agentsLoading, error: agentsError, refetch: refetchAgents } = useAgentsList();
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

  const handleAgentSelect = (agentId: string, agentName: string) => {
    setSelectedAgent({ id: agentId, name: agentName });
    setIsGeneralInquiry(false);
    setStep("division");
  };

  const handleGeneralInquiry = () => {
    setSelectedAgent(null);
    setIsGeneralInquiry(true);
    setStep("division");
  };

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
        agent_id: selectedAgent?.id || null,
        division: selectedDivision!,
        client_name: values.client_name.trim(),
        client_email: values.client_email.trim().toLowerCase(),
        client_phone: values.client_phone?.trim() || undefined,
        client_company: values.client_company?.trim() || undefined,
        criteria,
        notes: values.notes?.trim() || undefined,
        is_general_inquiry: isGeneralInquiry,
      });
      setStep("success");
    } catch {
      // Error handled by mutation
    }
  };

  const getCurrentStepIndex = () => {
    if (step === "agent") return 0;
    if (step === "division") return 1;
    if (step === "info") return 2;
    return 3;
  };

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

            {selectedAgent && (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Your Agent</p>
                  <p className="text-sm text-muted-foreground">{selectedAgent.name} will reach out to you</p>
                </div>
              </div>
            )}

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
                  setStep("agent");
                  setSelectedAgent(null);
                  setIsGeneralInquiry(false);
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
    <div className="min-h-screen overflow-y-auto bg-gradient-to-b from-background to-muted/20 py-12 px-4 sm:px-6 pb-24">
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
            const isCompleted = i < currentIndex;
            
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
                {i < 3 && <div className="w-8 sm:w-12 h-0.5 bg-border rounded-full mt-[-20px]" />}
              </div>
            );
          })}
        </div>

        {/* Agent Selection */}
        {step === "agent" && (
          <Card className="shadow-lg border-border/50">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl">Who are you working with?</CardTitle>
              <CardDescription className="text-base">Select your agent or submit a general inquiry</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {agentsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : agentsError || !agents ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <p className="text-muted-foreground">Unable to load agents</p>
                  <Button variant="outline" onClick={() => refetchAgents()}>
                    Try Again
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {agents.map((agent) => (
                      <button
                        key={agent.id}
                        onClick={() => handleAgentSelect(agent.id, agent.full_name || agent.email || "Agent")}
                        className="p-4 rounded-xl border border-border hover:border-primary hover:bg-accent/50 hover:shadow-md transition-all duration-200 flex flex-col items-center gap-3 text-center group"
                      >
                        <Avatar className="h-16 w-16 group-hover:scale-105 transition-transform duration-200">
                          <AvatarImage src={agent.avatar_url || undefined} alt={agent.full_name || ""} />
                          <AvatarFallback className="bg-primary/10 text-primary text-lg font-medium">
                            {(agent.full_name || agent.email || "A").charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <p className="font-medium text-sm leading-tight">
                          {agent.full_name || agent.email}
                        </p>
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>

                  <button
                    onClick={handleGeneralInquiry}
                    className="w-full p-5 rounded-xl border border-dashed border-border hover:border-primary hover:bg-accent/50 hover:shadow-md transition-all duration-200 flex items-center gap-5 text-left group"
                  >
                    <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-all duration-200">
                      <HelpCircle className="h-7 w-7 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-base">I don't have an agent yet</p>
                      <p className="text-sm text-muted-foreground mt-0.5">Submit a general inquiry</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 shrink-0" />
                  </button>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Division Selection */}
        {step === "division" && (
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
              <div className="pt-4 border-t border-border/50">
                <Button variant="ghost" onClick={() => setStep("agent")} size="lg">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </div>
            </CardContent>
          </Card>
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
                <Button variant="outline" onClick={() => setStep("division")} size="lg">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={handleInfoSubmit} size="lg">
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
                {selectedDivision === "investment-sales" && "Investment Criteria"}
                {selectedDivision === "commercial-leasing" && "Space Requirements"}
                {selectedDivision === "residential" && "Home Search Criteria"}
              </CardTitle>
              <CardDescription className="text-base">Help us understand what you're looking for</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {selectedDivision === "investment-sales" && (
                <InvestmentSalesCriteria criteria={criteria} setCriteria={setCriteria} />
              )}
              {selectedDivision === "commercial-leasing" && (
                <CommercialLeasingCriteria criteria={criteria} setCriteria={setCriteria} />
              )}
              {selectedDivision === "residential" && (
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
          <Select onValueChange={(v) => update("budget", v)} value={criteria.budget as string || ""}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select budget" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="under-5m">Under $5M</SelectItem>
              <SelectItem value="5m-10m">$5M - $10M</SelectItem>
              <SelectItem value="10m-25m">$10M - $25M</SelectItem>
              <SelectItem value="25m-50m">$25M - $50M</SelectItem>
              <SelectItem value="50m-plus">$50M+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Target Cap Rate</Label>
          <Select onValueChange={(v) => update("capRate", v)} value={criteria.capRate as string || ""}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select cap rate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4-5">4% - 5%</SelectItem>
              <SelectItem value="5-6">5% - 6%</SelectItem>
              <SelectItem value="6-7">6% - 7%</SelectItem>
              <SelectItem value="7-plus">7%+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium">Preferred Property Types</Label>
        <div className="grid grid-cols-2 gap-3 pt-2">
          {["Multifamily", "Mixed-Use", "Office", "Retail", "Industrial", "Land"].map((type) => (
            <div key={type} className="flex items-center space-x-3">
              <Checkbox 
                id={`type-${type}`}
                checked={(criteria.propertyTypes as string[] || []).includes(type)}
                onCheckedChange={(checked) => {
                  const types = criteria.propertyTypes as string[] || [];
                  update("propertyTypes", checked ? [...types, type] : types.filter(t => t !== type));
                }}
              />
              <Label htmlFor={`type-${type}`} className="font-normal cursor-pointer">{type}</Label>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium">Target Locations (Neighborhoods/Boroughs)</Label>
        <Input 
          placeholder="e.g. Brooklyn, Upper West Side, Queens"
          value={criteria.locations as string || ""}
          onChange={(e) => update("locations", e.target.value)}
          className="h-12"
        />
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
            Square Footage Needed <span className="text-destructive">*</span>
          </Label>
          <Select onValueChange={(v) => update("sqft", v)} value={criteria.sqft as string || ""}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="under-1000">Under 1,000 SF</SelectItem>
              <SelectItem value="1000-2500">1,000 - 2,500 SF</SelectItem>
              <SelectItem value="2500-5000">2,500 - 5,000 SF</SelectItem>
              <SelectItem value="5000-10000">5,000 - 10,000 SF</SelectItem>
              <SelectItem value="10000-plus">10,000+ SF</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Space Type</Label>
          <Select onValueChange={(v) => update("spaceType", v)} value={criteria.spaceType as string || ""}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="office">Office</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="industrial">Industrial/Warehouse</SelectItem>
              <SelectItem value="flex">Flex Space</SelectItem>
              <SelectItem value="medical">Medical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Budget (per SF/year)</Label>
          <Input 
            placeholder="e.g. $50-75 PSF"
            value={criteria.budget as string || ""}
            onChange={(e) => update("budget", e.target.value)}
            className="h-12"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Move-in Timeline</Label>
          <Select onValueChange={(v) => update("timeline", v)} value={criteria.timeline as string || ""}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select timeline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asap">ASAP</SelectItem>
              <SelectItem value="1-3-months">1-3 Months</SelectItem>
              <SelectItem value="3-6-months">3-6 Months</SelectItem>
              <SelectItem value="6-plus-months">6+ Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium">Preferred Locations</Label>
        <Input 
          placeholder="e.g. Midtown, FiDi, Chelsea"
          value={criteria.locations as string || ""}
          onChange={(e) => update("locations", e.target.value)}
          className="h-12"
        />
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
          <Label className="text-sm font-medium">Looking to</Label>
          <Select onValueChange={(v) => update("transactionType", v)} value={criteria.transactionType as string || ""}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rent">Rent</SelectItem>
              <SelectItem value="buy">Buy</SelectItem>
              <SelectItem value="both">Both / Undecided</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Bedrooms</Label>
          <Select onValueChange={(v) => update("bedrooms", v)} value={criteria.bedrooms as string || ""}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select bedrooms" />
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
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Budget {criteria.transactionType === "rent" ? "(Monthly)" : "(Purchase Price)"}
          </Label>
          <Input 
            placeholder={criteria.transactionType === "rent" ? "e.g. $3,000 - $5,000" : "e.g. $500K - $1M"}
            value={criteria.budget as string || ""}
            onChange={(e) => update("budget", e.target.value)}
            className="h-12"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Move-in Date</Label>
          <Select onValueChange={(v) => update("moveIn", v)} value={criteria.moveIn as string || ""}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select timing" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediately">Immediately</SelectItem>
              <SelectItem value="1-month">Within 1 Month</SelectItem>
              <SelectItem value="1-3-months">1-3 Months</SelectItem>
              <SelectItem value="flexible">Flexible</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium">Preferred Neighborhoods</Label>
        <Input 
          placeholder="e.g. West Village, Williamsburg, Park Slope"
          value={criteria.neighborhoods as string || ""}
          onChange={(e) => update("neighborhoods", e.target.value)}
          className="h-12"
        />
      </div>
    </div>
  );
}
