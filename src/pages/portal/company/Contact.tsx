import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Users, Headphones, Building2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const contactInfo = [
  {
    title: "Office Phone",
    value: "(212) 531-9295",
    icon: Phone,
    action: "tel:2125319295",
    color: "bg-emerald-500/20 text-emerald-400"
  },
  {
    title: "General Email",
    value: "office@bridgenyre.com",
    icon: Mail,
    action: "mailto:office@bridgenyre.com",
    color: "bg-blue-500/20 text-blue-400"
  },
  {
    title: "Address",
    value: "600 Third Avenue, Floors 2 & 10, New York, NY 10016",
    icon: MapPin,
    action: "https://maps.google.com/?q=600+Third+Avenue+New+York+NY+10016",
    color: "bg-amber-500/20 text-amber-400"
  }
];

const departments = [
  {
    name: "Leadership",
    description: "Executive team and management inquiries",
    contacts: [
      { name: "General Leadership", email: "leadership@bridgenyre.com" }
    ]
  },
  {
    name: "Marketing",
    description: "Collateral requests, branding, creative support",
    contacts: [
      { name: "Marketing Team", email: "marketing@bridgenyre.com" }
    ]
  },
  {
    name: "Operations",
    description: "IT support, systems access, office operations",
    contacts: [
      { name: "Operations Team", email: "operations@bridgenyre.com" }
    ]
  }
];

const Contact = () => {
  return (
    <div className="min-h-screen pb-24 md:pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Back to Company */}
        <Link 
          to="/portal/company" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          ← Back to Company
        </Link>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
            <Headphones className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground font-light">Contact & Support</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground mb-4">
            Get in Touch
          </h1>
          <p className="text-muted-foreground font-light max-w-2xl mx-auto">
            Need help? We're here to support you with whatever you need.
          </p>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {contactInfo.map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={index}
                href={item.action}
                target={item.action.startsWith("http") ? "_blank" : undefined}
                rel={item.action.startsWith("http") ? "noopener noreferrer" : undefined}
                className="glass-card p-5 hover:border-white/20 transition-all duration-300 block"
              >
                <div className={`w-10 h-10 rounded-full ${item.color.split(' ')[0]} flex items-center justify-center mb-3`}>
                  <Icon className={`h-5 w-5 ${item.color.split(' ')[1]}`} />
                </div>
                <h4 className="text-foreground font-light mb-1">{item.title}</h4>
                <p className="text-sm text-muted-foreground font-light">{item.value}</p>
              </a>
            );
          })}
        </div>

        {/* Call Office Button */}
        <div className="glass-card p-6 mb-8 text-center">
          <h3 className="text-lg font-light text-foreground mb-3">Need immediate assistance?</h3>
          <Button asChild size="lg" className="gap-2">
            <a href="tel:2125319295">
              <Phone className="h-4 w-4" />
              Call Office Now
            </a>
          </Button>
        </div>

        {/* Department Contacts */}
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-light text-foreground mb-6 flex items-center gap-3">
            <Users className="h-5 w-5 text-muted-foreground" />
            Department Contacts
          </h2>
          <div className="space-y-4">
            {departments.map((dept, index) => (
              <div key={index} className="glass-card p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <h4 className="text-foreground font-light mb-1">{dept.name}</h4>
                    <p className="text-sm text-muted-foreground font-light">{dept.description}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {dept.contacts.map((contact, cIndex) => (
                      <a
                        key={cIndex}
                        href={`mailto:${contact.email}`}
                        className="inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                        {contact.email}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Office Location */}
        <div className="glass-card p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
              <Building2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-light text-foreground mb-1">Headquarters</h3>
              <p className="text-muted-foreground font-light text-sm mb-3">
                600 Third Avenue<br />
                Floors 2 and 10<br />
                New York, NY 10016
              </p>
              <a
                href="https://maps.google.com/?q=600+Third+Avenue+New+York+NY+10016"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
