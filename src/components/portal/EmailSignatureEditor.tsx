import { useState, useEffect } from "react";
import { PenLine, Save, X, User, Briefcase, Phone, Mail, Globe } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface SignatureData {
  name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  website: string;
}

interface EmailSignatureEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (signature: string) => void;
  currentSignature?: string;
}

const LOCAL_STORAGE_KEY = "bridge_email_signature";

export function EmailSignatureEditor({
  open,
  onOpenChange,
  onSave,
  currentSignature,
}: EmailSignatureEditorProps) {
  const [data, setData] = useState<SignatureData>({
    name: "",
    title: "",
    company: "Bridge Real Estate",
    phone: "",
    email: "",
    website: "https://bridgerealestate.com",
  });

  useEffect(() => {
    // Load saved signature data from localStorage
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch {
        // Invalid JSON, use defaults
      }
    }
  }, [open]);

  const generateSignature = (): string => {
    return `
<div style="font-family: Arial, sans-serif; color: #333; font-size: 14px; line-height: 1.5;">
  <p style="margin: 0; font-weight: 600; color: #c41e3a; font-size: 16px;">${data.name || "Your Name"}</p>
  ${data.title ? `<p style="margin: 0; color: #666; font-size: 13px;">${data.title}</p>` : ""}
  ${data.company ? `<p style="margin: 0; color: #666; font-size: 13px; font-weight: 500;">${data.company}</p>` : ""}
  <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e5e5;">
    ${data.phone ? `<p style="margin: 2px 0; font-size: 13px;"><span style="color: #999;">P:</span> ${data.phone}</p>` : ""}
    ${data.email ? `<p style="margin: 2px 0; font-size: 13px;"><span style="color: #999;">E:</span> <a href="mailto:${data.email}" style="color: #c41e3a; text-decoration: none;">${data.email}</a></p>` : ""}
    ${data.website ? `<p style="margin: 2px 0; font-size: 13px;"><span style="color: #999;">W:</span> <a href="${data.website}" style="color: #c41e3a; text-decoration: none;">${data.website}</a></p>` : ""}
  </div>
</div>
`.trim();
  };

  const handleSave = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    const signature = generateSignature();
    onSave(signature);
    toast.success("Signature saved");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PenLine className="h-5 w-5 text-gmail-red" />
            Email Signature
          </DialogTitle>
        </DialogHeader>

        <div className="form-section py-4">
          <div className="form-grid">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Full Name
              </Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                placeholder="John Smith"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                Title
              </Label>
              <Input
                id="title"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                placeholder="Licensed Real Estate Salesperson"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              Company
            </Label>
            <Input
              id="company"
              value={data.company}
              onChange={(e) => setData({ ...data, company: e.target.value })}
              placeholder="Bridge Real Estate"
            />
          </div>

          <div className="form-grid">
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                Phone
              </Label>
              <Input
                id="phone"
                value={data.phone}
                onChange={(e) => setData({ ...data, phone: e.target.value })}
                placeholder="(555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email
              </Label>
              <Input
                id="email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                placeholder="john@bridgerealestate.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              Website
            </Label>
            <Input
              id="website"
              value={data.website}
              onChange={(e) => setData({ ...data, website: e.target.value })}
              placeholder="https://bridgerealestate.com"
            />
          </div>

          <Separator />

          {/* Preview */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">Preview</Label>
            <div
              className="p-4 rounded-lg border bg-white dark:bg-zinc-900"
              dangerouslySetInnerHTML={{ __html: generateSignature() }}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-gmail-red hover:bg-gmail-red/90">
            <Save className="h-4 w-4 mr-2" />
            Save Signature
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function getStoredSignature(): string | null {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    try {
      const data: SignatureData = JSON.parse(saved);
      return `
<div style="font-family: Arial, sans-serif; color: #333; font-size: 14px; line-height: 1.5;">
  <p style="margin: 0; font-weight: 600; color: #c41e3a; font-size: 16px;">${data.name || "Your Name"}</p>
  ${data.title ? `<p style="margin: 0; color: #666; font-size: 13px;">${data.title}</p>` : ""}
  ${data.company ? `<p style="margin: 0; color: #666; font-size: 13px; font-weight: 500;">${data.company}</p>` : ""}
  <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e5e5;">
    ${data.phone ? `<p style="margin: 2px 0; font-size: 13px;"><span style="color: #999;">P:</span> ${data.phone}</p>` : ""}
    ${data.email ? `<p style="margin: 2px 0; font-size: 13px;"><span style="color: #999;">E:</span> <a href="mailto:${data.email}" style="color: #c41e3a; text-decoration: none;">${data.email}</a></p>` : ""}
    ${data.website ? `<p style="margin: 2px 0; font-size: 13px;"><span style="color: #999;">W:</span> <a href="${data.website}" style="color: #c41e3a; text-decoration: none;">${data.website}</a></p>` : ""}
  </div>
</div>
`.trim();
    } catch {
      return null;
    }
  }
  return null;
}
