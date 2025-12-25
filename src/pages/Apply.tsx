import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  User, 
  Briefcase, 
  Building2, 
  FileText, 
  Send,
  Heart,
  MessageSquare,
  Trophy,
  Target,
  HelpCircle,
  PenTool,
  Upload,
  Loader2,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useCreateApplication, useUploadApplicationFile, CreateApplicationData } from "@/hooks/useAgentApplications";
import { cn } from "@/lib/utils";

const steps = [
  { id: "personal", title: "Personal Info", icon: User },
  { id: "professional", title: "Professional", icon: Briefcase },
  { id: "divisions", title: "Divisions", icon: Building2 },
  { id: "culture", title: "Our Culture", icon: Heart },
  { id: "bio", title: "Bio & Photos", icon: FileText },
  { id: "review", title: "Review", icon: Send },
];

const culturalValues = [
  { icon: Heart, title: "Lead with Optimism and Compassion", description: "Approach every interaction with positivity and empathy." },
  { icon: MessageSquare, title: "Cultivate Frequent Feedback", description: "Open communication helps us grow together." },
  { icon: Trophy, title: "Celebrate the Wins", description: "Acknowledge achievements, big and small." },
  { icon: Target, title: "Embrace Process Over Outcome", description: "Focus on doing things right, not just fast." },
  { icon: HelpCircle, title: "Start with Why", description: "Understand the purpose behind every action." },
  { icon: PenTool, title: "Cherish Writing", description: "Clear written communication is essential." },
];

const divisionOptions = [
  { id: "residential", label: "Residential", description: "Apartments, co-ops, condos, and townhouses" },
  { id: "commercial", label: "Commercial Leasing", description: "Retail, office, and industrial spaces" },
  { id: "investment_sales", label: "Investment Sales", description: "Multi-family and commercial property sales" },
];

const Apply = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<CreateApplicationData>>({
    email: "",
    full_name: "",
    phone: "",
    mailing_address: "",
    date_of_birth: "",
    license_number: "",
    linkedin_url: "",
    instagram_url: "",
    divisions: [],
    bio: "",
    headshot_url: "",
    id_photo_url: "",
    cultural_values_acknowledged: false,
  });
  const [headshotFile, setHeadshotFile] = useState<File | null>(null);
  const [idPhotoFile, setIdPhotoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createApplication = useCreateApplication();
  const uploadFile = useUploadApplicationFile();

  const progress = ((currentStep + 1) / steps.length) * 100;
  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleDivision = (divisionId: string) => {
    const current = formData.divisions || [];
    const updated = current.includes(divisionId)
      ? current.filter(d => d !== divisionId)
      : [...current, divisionId];
    updateFormData("divisions", updated);
  };

  const handleNext = () => {
    if (isLastStep) handleSubmit();
    else setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      let headshotUrl = formData.headshot_url;
      let idPhotoUrl = formData.id_photo_url;

      // Upload files if selected
      if (headshotFile) {
        headshotUrl = await uploadFile.mutateAsync({ file: headshotFile, type: 'headshot' });
      }
      if (idPhotoFile) {
        idPhotoUrl = await uploadFile.mutateAsync({ file: idPhotoFile, type: 'id_photo' });
      }

      await createApplication.mutateAsync({
        ...formData as CreateApplicationData,
        headshot_url: headshotUrl,
        id_photo_url: idPhotoUrl,
      });

      // Navigate to success page
      navigate("/apply/success");
    } catch (error) {
      console.error("Error submitting application:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (step.id) {
      case "personal":
        return formData.email && formData.full_name && formData.phone;
      case "professional":
        return true; // Optional fields
      case "divisions":
        return (formData.divisions?.length || 0) > 0;
      case "culture":
        return formData.cultural_values_acknowledged;
      case "bio":
        return formData.bio && formData.bio.length >= 50;
      case "review":
        return true;
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    switch (step.id) {
      case "personal":
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-light text-foreground mb-2">Personal Information</h2>
              <p className="text-muted-foreground text-sm">Tell us about yourself</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name || ""}
                  onChange={(e) => updateFormData("full_name", e.target.value)}
                  placeholder="John Doe"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  placeholder="john@example.com"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone || ""}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  placeholder="(555) 123-4567"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="mailing_address">Mailing Address</Label>
                <Input
                  id="mailing_address"
                  value={formData.mailing_address || ""}
                  onChange={(e) => updateFormData("mailing_address", e.target.value)}
                  placeholder="123 Main St, New York, NY 10001"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth || ""}
                  onChange={(e) => updateFormData("date_of_birth", e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </div>
          </div>
        );

      case "professional":
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-light text-foreground mb-2">Professional Details</h2>
              <p className="text-muted-foreground text-sm">Your credentials and social presence</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="license_number">NY Real Estate License Number</Label>
                <Input
                  id="license_number"
                  value={formData.license_number || ""}
                  onChange={(e) => updateFormData("license_number", e.target.value)}
                  placeholder="10401234567"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="linkedin_url">LinkedIn Profile URL</Label>
                <Input
                  id="linkedin_url"
                  type="url"
                  value={formData.linkedin_url || ""}
                  onChange={(e) => updateFormData("linkedin_url", e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="instagram_url">Instagram Handle</Label>
                <Input
                  id="instagram_url"
                  value={formData.instagram_url || ""}
                  onChange={(e) => updateFormData("instagram_url", e.target.value)}
                  placeholder="@yourhandle"
                  className="mt-1.5"
                />
              </div>
            </div>
          </div>
        );

      case "divisions":
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-light text-foreground mb-2">Select Your Division(s)</h2>
              <p className="text-muted-foreground text-sm">Choose at least one area of focus</p>
            </div>
            <div className="space-y-3">
              {divisionOptions.map((division) => (
                <button
                  key={division.id}
                  onClick={() => toggleDivision(division.id)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left",
                    formData.divisions?.includes(division.id)
                      ? "bg-primary/10 border-primary/50"
                      : "hover:bg-muted/50 border-border"
                  )}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                    formData.divisions?.includes(division.id)
                      ? "bg-primary border-primary"
                      : "border-muted-foreground"
                  )}>
                    {formData.divisions?.includes(division.id) && (
                      <Check className="h-4 w-4 text-primary-foreground" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{division.label}</h3>
                    <p className="text-sm text-muted-foreground">{division.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case "culture":
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-light text-foreground mb-2">Our Cultural Values</h2>
              <p className="text-muted-foreground text-sm">The principles that guide everything we do at Bridge</p>
            </div>
            <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-2">
              {culturalValues.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground">{title}</h3>
                    <p className="text-xs text-muted-foreground">{description}</p>
                  </div>
                </div>
              ))}
            </div>
            <label className="flex items-start gap-3 p-4 rounded-xl border border-border cursor-pointer hover:bg-muted/30 transition-colors">
              <Checkbox
                checked={formData.cultural_values_acknowledged || false}
                onCheckedChange={(checked) => updateFormData("cultural_values_acknowledged", checked)}
              />
              <span className="text-sm text-foreground">
                I have read and embrace these cultural values. I commit to upholding them in my work at Bridge Advisory Group.
              </span>
            </label>
          </div>
        );

      case "bio":
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-light text-foreground mb-2">Bio & Photos</h2>
              <p className="text-muted-foreground text-sm">Help us get to know you better</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bio">Professional Bio (3+ sentences) *</Label>
                <Textarea
                  id="bio"
                  value={formData.bio || ""}
                  onChange={(e) => updateFormData("bio", e.target.value)}
                  placeholder="Tell us about your background, experience, and why you're interested in joining Bridge..."
                  className="mt-1.5 min-h-[120px]"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {(formData.bio?.length || 0)} characters (minimum 50)
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Professional Headshot</Label>
                  <label className="mt-1.5 flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/30 transition-colors">
                    {headshotFile ? (
                      <div className="text-center">
                        <Check className="h-6 w-6 text-emerald-500 mx-auto mb-1" />
                        <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                          {headshotFile.name}
                        </span>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
                        <span className="text-xs text-muted-foreground">Upload Photo</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setHeadshotFile(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>
                
                <div>
                  <Label>Photo ID</Label>
                  <label className="mt-1.5 flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/30 transition-colors">
                    {idPhotoFile ? (
                      <div className="text-center">
                        <Check className="h-6 w-6 text-emerald-500 mx-auto mb-1" />
                        <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                          {idPhotoFile.name}
                        </span>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
                        <span className="text-xs text-muted-foreground">Upload ID</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setIdPhotoFile(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case "review":
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-light text-foreground mb-2">Review Your Application</h2>
              <p className="text-muted-foreground text-sm">Make sure everything looks good before submitting</p>
            </div>
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
              <div className="p-4 rounded-xl bg-muted/30 space-y-2">
                <h3 className="text-sm font-medium text-foreground">Personal Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-muted-foreground">Name:</span> {formData.full_name}</div>
                  <div><span className="text-muted-foreground">Email:</span> {formData.email}</div>
                  <div><span className="text-muted-foreground">Phone:</span> {formData.phone}</div>
                  {formData.date_of_birth && (
                    <div><span className="text-muted-foreground">DOB:</span> {formData.date_of_birth}</div>
                  )}
                </div>
              </div>
              
              <div className="p-4 rounded-xl bg-muted/30 space-y-2">
                <h3 className="text-sm font-medium text-foreground">Professional</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {formData.license_number && (
                    <div><span className="text-muted-foreground">License:</span> {formData.license_number}</div>
                  )}
                  {formData.linkedin_url && (
                    <div><span className="text-muted-foreground">LinkedIn:</span> ✓</div>
                  )}
                  {formData.instagram_url && (
                    <div><span className="text-muted-foreground">Instagram:</span> {formData.instagram_url}</div>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-muted/30 space-y-2">
                <h3 className="text-sm font-medium text-foreground">Divisions</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.divisions?.map(d => (
                    <span key={d} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full capitalize">
                      {d.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-muted/30 space-y-2">
                <h3 className="text-sm font-medium text-foreground">Bio</h3>
                <p className="text-sm text-muted-foreground">{formData.bio}</p>
              </div>

              <div className="p-4 rounded-xl bg-muted/30 space-y-2">
                <h3 className="text-sm font-medium text-foreground">Uploads</h3>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    {headshotFile ? <Check className="h-4 w-4 text-emerald-500" /> : <span className="text-muted-foreground">—</span>}
                    <span>Headshot</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {idPhotoFile ? <Check className="h-4 w-4 text-emerald-500" /> : <span className="text-muted-foreground">—</span>}
                    <span>Photo ID</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-emerald-500" />
                  <span className="text-sm text-foreground">Cultural values acknowledged</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-gradient-to-b from-background via-background to-black/50 pointer-events-none" />
      
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate("/login")} 
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </button>
          <img 
            src="/lovable-uploads/20d12fb8-7a61-4b15-bf8f-cdd401ddb12d.png" 
            alt="Bridge Advisory Group" 
            className="h-10"
          />
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                  i === currentStep 
                    ? "bg-primary text-primary-foreground" 
                    : i < currentStep 
                      ? "bg-primary/20 text-primary" 
                      : "bg-muted text-muted-foreground"
                )}>
                  {i < currentStep ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                </div>
                {i < steps.length - 1 && (
                  <div className={cn(
                    "w-8 md:w-16 h-0.5 mx-1",
                    i < currentStep ? "bg-primary/50" : "bg-muted"
                  )} />
                )}
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-1" />
        </div>

        {/* Form Card */}
        <div className="glass-panel-strong p-6 md:p-8 rounded-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed() || isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : isLastStep ? (
              <>
                Submit Application
                <Send className="h-4 w-4" />
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Apply;
