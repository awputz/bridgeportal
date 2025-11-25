import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
const processSteps = [{
  number: "01",
  title: "Initial Consultation",
  description: "We start with a detailed conversation about your needs, budget, timeline, and preferences. For clients, we discuss neighborhoods, lifestyle requirements, and must-haves. For landlords and sellers, we review property details, pricing expectations, and marketing strategy.",
  duration: "30-60 minutes",
  deliverables: ["Clear understanding of requirements", "Preliminary market analysis", "Timeline and next steps"]
}, {
  number: "02",
  title: "Research & Planning",
  description: "Our team conducts comprehensive market research and develops a targeted strategy. For searches, we curate personalized property selections. For listings, we create marketing plans with competitive analysis and pricing recommendations.",
  duration: "1-3 days",
  deliverables: ["Curated property list or marketing plan", "Pricing analysis", "Strategy presentation"]
}, {
  number: "03",
  title: "Active Phase",
  description: "For clients: coordinated showings on your schedule with full support. For listings: professional photography, marketing launch, and coordinated showings. Regular updates and feedback throughout this phase.",
  duration: "2-6 weeks",
  deliverables: ["Scheduled viewings", "Regular status updates", "Market feedback and adjustments"]
}, {
  number: "04",
  title: "Application / Negotiation",
  description: "Once you've found the right property or tenant/buyer, we guide you through applications, negotiations, and due diligence. Full support with paperwork, board packages, and communication with all parties.",
  duration: "1-3 weeks",
  deliverables: ["Application submission", "Negotiation support", "Document coordination"]
}, {
  number: "05",
  title: "Closing / Move-In",
  description: "Final steps to lease signing or closing. We coordinate with attorneys, manage timelines, and ensure smooth execution. Post-closing support for any questions or issues that arise.",
  duration: "1-2 weeks",
  deliverables: ["Executed lease or closing", "Move-in coordination", "Post-closing support"]
}];
const Process = () => {
  return <div className="min-h-screen pt-28 md:pt-36 lg:pt-44 pb-20 md:pb-28 lg:pb-36">
      {/* Header */}
      <section className="px-6 lg:px-8 mb-24 md:mb-28 lg:mb-32">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 md:mb-10 lg:mb-12 tracking-tight">Our Process</h1>
          <p className="text-xl text-muted-foreground">
            A structured approach to New York real estate. Clear steps, transparent communication, and full support from first contact to closing.
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="px-6 lg:px-8 mb-24 md:mb-32 lg:mb-40">
        <div className="container mx-auto max-w-4xl space-y-16 md:space-y-20">
          {processSteps.map((step, index) => <Card key={index} className="p-8 md:p-10 lg:p-12">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Step Number */}
                <div className="flex-shrink-0">
                  <div className="text-5xl font-light text-accent">{step.number}</div>
                </div>

                {/* Step Content */}
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold mb-2">{step.title}</h2>
                  <p className="text-sm text-muted-foreground mb-4">Typical duration: {step.duration}</p>
                  <p className="text-muted-foreground mb-6">{step.description}</p>

                  {/* Deliverables */}
                  <div>
                    <p className="text-sm font-semibold mb-3">Key Deliverables:</p>
                    <ul className="space-y-2">
                      {step.deliverables.map((deliverable, idx) => <li key={idx} className="flex items-start gap-3 text-sm">
                          <CheckCircle2 className="text-accent flex-shrink-0 mt-0.5" size={16} />
                          <span>{deliverable}</span>
                        </li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>)}
        </div>
      </section>

      {/* Additional Info */}
      <section className="px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl bg-surface p-8 rounded-lg border border-border">
          <h2 className="text-2xl font-semibold mb-6 text-center">What Sets Us Apart</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">24h</div>
              <p className="text-sm text-muted-foreground">Response time for all inquiries</p>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">100%</div>
              <p className="text-sm text-muted-foreground">Transparency throughout process</p>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">Dedicated</div>
              <p className="text-sm text-muted-foreground">Back office support team</p>
            </div>
          </div>
        </div>
      </section>
    </div>;
};
export default Process;