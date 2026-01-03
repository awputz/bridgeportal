import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { ExclusiveDivision } from "@/hooks/useExclusiveSubmissions";

interface OwnerStepProps {
  ownerName: string;
  ownerEmail?: string;
  ownerPhone?: string;
  ownerCompany?: string;
  division: ExclusiveDivision;
  onChange: (updates: {
    owner_name?: string;
    owner_email?: string;
    owner_phone?: string;
    owner_company?: string;
  }) => void;
}

export function OwnerStep({ 
  ownerName, 
  ownerEmail, 
  ownerPhone, 
  ownerCompany, 
  division,
  onChange 
}: OwnerStepProps) {
  const ownerLabel = division === "residential" ? "Landlord" : "Owner";
  const showCompany = division !== "residential";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          {ownerLabel} Details
        </h2>
        <p className="text-muted-foreground mt-1">
          Enter the property {ownerLabel.toLowerCase()}'s contact information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contact Information</CardTitle>
          <CardDescription>
            This information will be kept private and used for deal coordination
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="owner_name">{ownerLabel} Name *</Label>
            <Input
              id="owner_name"
              value={ownerName}
              onChange={(e) => onChange({ owner_name: e.target.value })}
              placeholder={`Enter ${ownerLabel.toLowerCase()}'s full name`}
              className="h-12"
            />
          </div>

          {showCompany && (
            <div className="space-y-2">
              <Label htmlFor="owner_company">Company / Entity Name</Label>
              <Input
                id="owner_company"
                value={ownerCompany || ""}
                onChange={(e) => onChange({ owner_company: e.target.value })}
                placeholder="e.g., ABC Holdings LLC"
                className="h-12"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="owner_email">Email</Label>
              <Input
                id="owner_email"
                type="email"
                value={ownerEmail || ""}
                onChange={(e) => onChange({ owner_email: e.target.value })}
                placeholder="email@example.com"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="owner_phone">Phone</Label>
              <Input
                id="owner_phone"
                type="tel"
                value={ownerPhone || ""}
                onChange={(e) => onChange({ owner_phone: e.target.value })}
                placeholder="(555) 555-5555"
                className="h-12"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
