import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateStagingProject } from "@/hooks/marketing/useStaging";
import { Loader2 } from "lucide-react";

type StagingType = "residential" | "commercial" | "architecture" | "investment";

interface CreateStagingProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultStagingType?: StagingType;
}

const STAGING_TYPES = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "architecture", label: "Architecture" },
  { value: "investment", label: "Investment" },
];

const PROPERTY_TYPES = [
  { value: "single-family", label: "Single Family Home" },
  { value: "condo", label: "Condo / Apartment" },
  { value: "townhouse", label: "Townhouse" },
  { value: "multi-family", label: "Multi-Family" },
  { value: "office", label: "Office Space" },
  { value: "retail", label: "Retail Space" },
  { value: "industrial", label: "Industrial" },
  { value: "mixed-use", label: "Mixed Use" },
];

const TARGET_AUDIENCES = [
  { value: "first-time-buyers", label: "First-Time Buyers" },
  { value: "luxury-buyers", label: "Luxury Buyers" },
  { value: "investors", label: "Investors" },
  { value: "families", label: "Families" },
  { value: "young-professionals", label: "Young Professionals" },
  { value: "commercial-tenants", label: "Commercial Tenants" },
];

export function CreateStagingProjectDialog({
  open,
  onOpenChange,
  defaultStagingType,
}: CreateStagingProjectDialogProps) {
  const navigate = useNavigate();
  const createProject = useCreateStagingProject();
  
  const [name, setName] = useState("");
  const [stagingType, setStagingType] = useState<StagingType>(defaultStagingType || "residential");
  const [propertyType, setPropertyType] = useState<string>("");
  const [targetAudience, setTargetAudience] = useState<string>("");

  useEffect(() => {
    if (defaultStagingType) {
      setStagingType(defaultStagingType);
    }
  }, [defaultStagingType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    createProject.mutate(
      {
        name: name.trim(),
        staging_type: stagingType,
        property_type: propertyType || undefined,
        target_audience: targetAudience || undefined,
      },
      {
        onSuccess: (data) => {
          onOpenChange(false);
          resetForm();
          if (data?.id) {
            navigate(`/portal/marketing/staging/${data.id}`);
          }
        },
      }
    );
  };

  const resetForm = () => {
    setName("");
    setStagingType("residential");
    setPropertyType("");
    setTargetAudience("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] flex flex-col">
        <DialogHeader className="space-y-2 pb-4 flex-shrink-0">
          <DialogTitle className="text-2xl font-light">Create Staging Project</DialogTitle>
          <DialogDescription className="text-sm">Set up a new AI staging project for your property</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex-1 space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              placeholder="e.g., 123 Main St Living Room"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="staging-type">Staging Type *</Label>
            <Select value={stagingType} onValueChange={(v) => setStagingType(v as StagingType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STAGING_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="property-type">Property Type</Label>
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger>
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                {PROPERTY_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target-audience">Target Audience</Label>
            <Select value={targetAudience} onValueChange={setTargetAudience}>
              <SelectTrigger>
                <SelectValue placeholder="Select target audience" />
              </SelectTrigger>
              <SelectContent>
                {TARGET_AUDIENCES.map((audience) => (
                  <SelectItem key={audience.value} value={audience.value}>
                    {audience.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2 pt-4 border-t flex-shrink-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createProject.isPending || !name.trim()}>
              {createProject.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Project"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
