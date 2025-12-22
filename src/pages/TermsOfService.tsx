import { useScrollReveal } from "@/hooks/useScrollReveal";
import { SEOHelmet } from "@/components/SEOHelmet";
import { useBridgeSettings } from "@/hooks/useBridgeSettings";

const TermsOfService = () => {
  const heroReveal = useScrollReveal();
  const contentReveal = useScrollReveal();
  const { data: settings } = useBridgeSettings();

  const sections = [
    {
      title: "Acceptance of Terms",
      content: `By accessing or using the ${settings?.company_name || "Bridge Advisory Group"} website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or services.`
    },
    {
      title: "Description of Services",
      content: `${settings?.company_name || "Bridge Advisory Group"} provides real estate brokerage services, including but not limited to:

• Investment sales advisory
• Commercial leasing
• Residential sales and rentals
• Property management
• Capital advisory services
• Market research and analysis

Our website provides information about our services, property listings, and resources for real estate professionals and clients.`
    },
    {
      title: "User Conduct",
      content: `When using our website and services, you agree to:

• Provide accurate and complete information
• Use the services only for lawful purposes
• Not interfere with the proper functioning of the website
• Not attempt to gain unauthorized access to any systems
• Not transmit any viruses, malware, or harmful code
• Respect the intellectual property rights of others`
    },
    {
      title: "Intellectual Property",
      content: `All content on this website, including but not limited to text, graphics, logos, images, and software, is the property of ${settings?.company_name || "Bridge Advisory Group"} or its content suppliers and is protected by intellectual property laws.

You may not reproduce, distribute, modify, or create derivative works from any content without our express written permission.`
    },
    {
      title: "Property Listings & Information",
      content: `All listing information is deemed reliable but is not guaranteed and is subject to errors, omissions, changes in price, prior sale, or withdrawal without notice.

• All measurements and square footages are approximate
• No representation is made as to the accuracy of any description
• All descriptive information should be independently verified
• Photos may be representative and not of the actual property`
    },
    {
      title: "User Submissions",
      content: `By submitting information through our contact forms, deal room registrations, or other channels, you grant us permission to use this information to:

• Respond to your inquiries
• Provide requested services
• Send relevant communications
• Improve our services

You represent that any information you provide is accurate and that you have the right to share such information.`
    },
    {
      title: "Disclaimer of Warranties",
      content: `Our website and services are provided "as is" and "as available" without any warranties of any kind, either express or implied.

We do not warrant that:
• The website will be uninterrupted or error-free
• Defects will be corrected
• The website is free of viruses or harmful components
• The information is accurate or complete

No financial or legal advice is provided through this website.`
    },
    {
      title: "Limitation of Liability",
      content: `To the fullest extent permitted by law, ${settings?.company_name || "Bridge Advisory Group"} shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the website or services.

Our total liability for any claims arising from these terms shall not exceed the amount you paid for our services, if any.`
    },
    {
      title: "Indemnification",
      content: `You agree to indemnify and hold harmless ${settings?.company_name || "Bridge Advisory Group"}, its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of the website or violation of these terms.`
    },
    {
      title: "Fair Housing",
      content: `${settings?.company_name || "Bridge Advisory Group"} supports the Fair Housing Act and Equal Opportunity Act. We do not discriminate based on race, color, religion, sex, national origin, familial status, disability, or any other protected class.

We do not discriminate against voucher holders pursuant to applicable law. All lawful sources of income are accepted.`
    },
    {
      title: "Governing Law",
      content: `These Terms of Service shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of law provisions.

Any disputes arising from these terms shall be resolved in the courts of New York County, New York.`
    },
    {
      title: "Changes to Terms",
      content: `We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website after any changes constitutes acceptance of the new terms.`
    },
    {
      title: "Contact Information",
      content: `If you have questions about these Terms of Service, please contact us at:

${settings?.company_name || "Bridge Advisory Group"}
${settings?.company_address?.full || "New York, NY"}
Email: ${settings?.company_contact?.email || "info@bridgeadvisorygroup.com"}
Phone: ${settings?.company_contact?.phone || "(212) 634-6460"}`
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHelmet
        title="Terms of Service | Bridge Advisory Group"
        description="Review the Terms of Service for Bridge Advisory Group's website and real estate services. Understand your rights and responsibilities when using our platform."
      />

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 border-b border-border/10" ref={heroReveal.elementRef}>
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className={`text-center transition-all duration-700 ${heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight mb-4">
              Terms of Service
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
              Welcome to {settings?.company_name || "Bridge Advisory Group"}. These Terms of Service ("Terms") govern your use of our website and services. Please read them carefully before using our platform.
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

export default TermsOfService;
