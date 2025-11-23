import { X, Mail, Phone, Instagram, Linkedin, Contact } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContactPanelProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  title: string;
  description?: string;
  email: string;
  phone: string;
  instagram?: string;
  linkedin?: string;
}

const ContactPanel = ({
  isOpen,
  onClose,
  name,
  title,
  description,
  email,
  phone,
  instagram = "https://instagram.com/bridgeresidential",
  linkedin,
}: ContactPanelProps) => {
  if (!isOpen) return null;

  const handleDownloadVCard = () => {
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${name}
TITLE:${title}
EMAIL:${email}
TEL:${phone}
END:VCARD`;
    
    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name.replace(/\s+/g, '_')}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300 animate-in fade-in-0"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[450px] max-h-[85vh] bg-background z-[60] shadow-2xl border border-border overflow-y-auto rounded-xl animate-in fade-in-0 zoom-in-95 duration-300">
        <div className="p-8">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X size={20} className="text-foreground" />
          </button>

          {/* Header */}
          <div className="mb-12 pr-12">
            <h2 className="text-2xl font-semibold mb-2 text-foreground">{name}</h2>
            <p className="text-xs tracking-wider text-muted-foreground mb-1 uppercase leading-relaxed">
              {title}
            </p>
            {description && (
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                {description || "Residential Advisor at BRIDGE Residential"}
              </p>
            )}
          </div>

          {/* Contact Actions Grid */}
          <div className="grid grid-cols-3 gap-6">
            {/* Email */}
            <a
              href={`mailto:${email}`}
              className="flex flex-col items-center gap-3 group"
            >
              <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center group-hover:bg-foreground group-hover:border-foreground transition-all duration-300">
                <Mail size={24} className="text-foreground group-hover:text-background transition-colors" />
              </div>
              <span className="text-xs tracking-wider text-muted-foreground uppercase">
                Email
              </span>
            </a>

            {/* Phone */}
            <a
              href={`tel:${phone}`}
              className="flex flex-col items-center gap-3 group"
            >
              <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center group-hover:bg-foreground group-hover:border-foreground transition-all duration-300">
                <Phone size={24} className="text-foreground group-hover:text-background transition-colors" />
              </div>
              <span className="text-xs tracking-wider text-muted-foreground uppercase">
                Phone
              </span>
            </a>

            {/* Instagram */}
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 group"
            >
              <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center group-hover:bg-foreground group-hover:border-foreground transition-all duration-300">
                <Instagram size={24} className="text-foreground group-hover:text-background transition-colors" />
              </div>
              <span className="text-xs tracking-wider text-muted-foreground uppercase">
                Instagram
              </span>
            </a>

            {/* LinkedIn */}
            <a
              href={linkedin || "https://linkedin.com/company/bridge-residential"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 group"
            >
              <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center group-hover:bg-foreground group-hover:border-foreground transition-all duration-300">
                <Linkedin size={24} className="text-foreground group-hover:text-background transition-colors" />
              </div>
              <span className="text-xs tracking-wider text-muted-foreground uppercase">
                LinkedIn
              </span>
            </a>

            {/* Save Contact */}
            <button
              onClick={handleDownloadVCard}
              className="flex flex-col items-center gap-3 group"
            >
              <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center group-hover:bg-foreground group-hover:border-foreground transition-all duration-300">
                <Contact size={24} className="text-foreground group-hover:text-background transition-colors" />
              </div>
              <span className="text-xs tracking-wider text-muted-foreground text-center uppercase">
                Save
              </span>
            </button>
          </div>

          {/* Chat Link */}
          <div className="mt-16 pt-8 border-t border-border">
            <button
              onClick={() => {
                onClose();
                // This will be handled by the AIChat component
                window.dispatchEvent(new CustomEvent('openAIChat'));
              }}
              className="text-sm tracking-wider text-muted-foreground hover:text-foreground transition-colors uppercase"
            >
              Chat with BRIDGE Assistant
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPanel;