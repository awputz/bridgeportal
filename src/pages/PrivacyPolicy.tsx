import { useScrollReveal } from "@/hooks/useScrollReveal";
import { SEOHelmet } from "@/components/SEOHelmet";
import { useBridgeSettings } from "@/hooks/useBridgeSettings";

const PrivacyPolicy = () => {
  const heroReveal = useScrollReveal();
  const contentReveal = useScrollReveal();
  const { data: settings } = useBridgeSettings();

  const sections = [
    {
      title: "Information We Collect",
      content: `We collect information you provide directly to us, including:
      
• Contact information (name, email address, phone number) when you submit inquiries or contact forms
• Newsletter subscription information when you sign up for our mailing list
• Property inquiry details when you express interest in listings
• Deal room registration information for investment property access
• Any other information you choose to provide to us`
    },
    {
      title: "How We Use Your Information",
      content: `We use the information we collect to:

• Respond to your inquiries and provide customer service
• Send you newsletters and marketing communications (with your consent)
• Facilitate real estate transactions and provide our services
• Improve our website and services
• Comply with legal obligations
• Protect against fraudulent or illegal activity`
    },
    {
      title: "Information Sharing",
      content: `We may share your information with:

• Our affiliated companies and business partners
• Service providers who assist with our operations
• Legal and regulatory authorities when required by law
• Other parties with your consent

We do not sell your personal information to third parties.`
    },
    {
      title: "Cookies & Tracking Technologies",
      content: `Our website uses cookies and similar tracking technologies to:

• Remember your preferences
• Analyze website traffic and usage
• Improve user experience

You can control cookies through your browser settings. Disabling cookies may affect some website functionality.`
    },
    {
      title: "Data Security",
      content: `We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.`
    },
    {
      title: "Your Rights",
      content: `Depending on your location, you may have rights regarding your personal information, including:

• Access to your personal information
• Correction of inaccurate information
• Deletion of your information
• Opt-out of marketing communications
• Data portability

To exercise these rights, please contact us using the information below.`
    },
    {
      title: "Third-Party Links",
      content: `Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.`
    },
    {
      title: "Changes to This Policy",
      content: `We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page with an updated effective date.`
    },
    {
      title: "Contact Us",
      content: `If you have questions about this Privacy Policy or our privacy practices, please contact us at:

${settings?.company_name || "Bridge Advisory Group"}
${settings?.company_address?.full || "New York, NY"}
Email: ${settings?.company_contact?.email || "info@bridgeadvisorygroup.com"}
Phone: ${settings?.company_contact?.phone || "(212) 634-6460"}`
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHelmet
        title="Privacy Policy | Bridge Advisory Group"
        description="Learn how Bridge Advisory Group collects, uses, and protects your personal information. Our privacy policy outlines our commitment to data security and your rights."
      />

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 border-b border-border/10" ref={heroReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className={`text-center transition-all duration-700 ${heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground text-lg font-light">
              Last updated: December 2024
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24" ref={contentReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div className={`transition-all duration-700 ${contentReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-muted-foreground font-light leading-relaxed mb-12">
              {settings?.company_name || "Bridge Advisory Group"} ("we," "us," or "our") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            </p>

            <div className="space-y-10">
              {sections.map((section, index) => (
                <div 
                  key={section.title}
                  className="border-b border-border/10 pb-10 last:border-0"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <h2 className="text-xl md:text-2xl font-light mb-4 tracking-tight">
                    {section.title}
                  </h2>
                  <div className="text-muted-foreground font-light leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
