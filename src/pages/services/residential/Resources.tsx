import { ServicePageLayout } from "@/components/ServicePageLayout";
import { FileText, CheckCircle, Clock, HelpCircle, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Resources = () => {
  const heroContent = (
    <section className="relative bg-gradient-to-b from-secondary to-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-primary font-medium mb-4">Residential / Resources</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
          Renter Resources
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Everything you need to know about renting in New York City. From application requirements to move-in tips.
        </p>
      </div>
    </section>
  );

  const requiredDocuments = [
    "Government-issued photo ID (passport or driver's license)",
    "Last 2-3 pay stubs or employment letter",
    "Most recent tax return (1040 or W-2)",
    "Last 2-3 bank statements",
    "Letter of employment on company letterhead",
    "Previous landlord reference (if applicable)",
    "Guarantor documentation (if required)",
  ];

  const rentalProcess = [
    { step: "Search & Tour", duration: "1-2 weeks", description: "Browse listings, schedule viewings, and find your ideal home." },
    { step: "Application", duration: "1-2 days", description: "Submit application with required documents and application fee." },
    { step: "Background Check", duration: "2-3 days", description: "Credit check, employment verification, and reference checks." },
    { step: "Approval & Lease", duration: "1-2 days", description: "Review and sign lease agreement, pay security deposit." },
    { step: "Move-In", duration: "Scheduled date", description: "Key pickup, walkthrough, and welcome to your new home!" },
  ];

  const faqs = [
    {
      question: "What credit score do I need to rent in NYC?",
      answer: "Most landlords prefer a credit score of 680 or higher. However, requirements vary by building and landlord. If your credit score is lower, you may need a guarantor or offer additional security deposit."
    },
    {
      question: "How much income do I need to qualify?",
      answer: "The standard requirement is annual income of 40x the monthly rent. For example, for a $3,000/month apartment, you'd need to earn $120,000/year. Guarantors typically need 80x the monthly rent."
    },
    {
      question: "What is a guarantor and when do I need one?",
      answer: "A guarantor is someone who agrees to pay your rent if you can't. You may need one if your income doesn't meet requirements, you have limited credit history, or you're a student or new to the workforce."
    },
    {
      question: "What fees should I expect when renting?",
      answer: "Typical fees include: first month's rent, security deposit (usually one month's rent), and potentially a broker fee (typically one month's rent or 15% of annual rent)."
    },
    {
      question: "How long does the application process take?",
      answer: "The typical application process takes 3-7 business days from submission to approval. Having all documents ready can speed up the process significantly."
    },
    {
      question: "Can I negotiate rent in NYC?",
      answer: "Yes, especially during slower rental seasons (winter months) or for longer lease terms. We can help negotiate on your behalf to get the best possible terms."
    },
  ];

  return (
    <ServicePageLayout serviceKey="residential" heroContent={heroContent}>
      {/* Required Documents */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <FileText className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">Required Documents</h2>
              </div>
              <p className="text-muted-foreground mb-8">
                Have these documents ready to speed up your application process. Being prepared shows landlords you're a serious applicant.
              </p>
              <ul className="space-y-4">
                {requiredDocuments.map((doc, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Card className="bg-secondary/20 border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-primary" />
                  Downloadable Checklist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Download our comprehensive rental application checklist to ensure you have everything ready.
                </p>
                <Button className="w-full" variant="outline">
                  Download Application Checklist (PDF)
                </Button>
                <Button className="w-full" variant="outline">
                  Download Move-In Guide (PDF)
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Rental Process Timeline */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6 justify-center">
            <Clock className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Rental Process Timeline</h2>
          </div>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Understanding the typical rental timeline helps you plan your apartment search effectively.
          </p>

          <div className="grid md:grid-cols-5 gap-4">
            {rentalProcess.map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-background rounded-lg p-6 border border-border h-full">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold mb-4">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{item.step}</h3>
                  <p className="text-sm text-primary font-medium mb-2">{item.duration}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                {index < rentalProcess.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 text-primary text-2xl">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6 justify-center">
            <HelpCircle className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Frequently Asked Questions</h2>
          </div>
          <p className="text-muted-foreground text-center mb-12">
            Common questions about renting in New York City.
          </p>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-secondary/20 rounded-lg border border-border px-6"
              >
                <AccordionTrigger className="text-left text-foreground hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your New Home?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Our team is here to guide you through every step of the rental process. Contact us today to start your search.
          </p>
          <Button size="lg" variant="secondary">
            Contact Our Team
          </Button>
        </div>
      </section>
    </ServicePageLayout>
  );
};

export default Resources;
