import { Link } from "react-router-dom";
import { ClipboardCheck, Briefcase, Users, BarChart3, Award, FileCheck, UserCheck, MessageSquare, Handshake, Target } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const professionalStandards = [
  "Represent Bridge Advisory Group with the highest level of professionalism",
  "Maintain current real estate licensing and required continuing education",
  "Adhere to all compliance, fair housing, and ethical standards",
  "Respond to client inquiries within 24 hours maximum",
  "Keep accurate and up-to-date records of all transactions and client communications"
];

const clientServiceExpectations = [
  "Put client interests first in every interaction",
  "Provide honest assessments and realistic expectations",
  "Communicate regularly and proactively with clients",
  "Collaborate with other divisions when it benefits the client",
  "Leverage the full Bridge platform to deliver comprehensive solutions"
];

const teamCollaboration = [
  "Share knowledge and insights with fellow team members",
  "Participate in team meetings, training sessions, and company events",
  "Support colleagues in cross-divisional deals",
  "Contribute to a positive, supportive work environment",
  "Celebrate team wins and learn from challenges together"
];

const performanceStandards = [
  "Meet or exceed individual and team production goals",
  "Maintain high client satisfaction ratings",
  "Continuously develop skills and market knowledge",
  "Embrace technology and tools provided by the company",
  "Uphold the Bridge brand in all marketing and communications"
];

const sections = [
  {
    id: "professional",
    title: "Professional Standards",
    icon: Briefcase,
    items: professionalStandards,
    color: "text-emerald-400"
  },
  {
    id: "client",
    title: "Client Service Expectations",
    icon: UserCheck,
    items: clientServiceExpectations,
    color: "text-blue-400"
  },
  {
    id: "team",
    title: "Team Collaboration",
    icon: Users,
    items: teamCollaboration,
    color: "text-amber-400"
  },
  {
    id: "performance",
    title: "Performance Standards",
    icon: BarChart3,
    items: performanceStandards,
    color: "text-purple-400"
  }
];

const Expectations = () => {
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
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground font-light">Agent Expectations</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground mb-4">
            What We Expect
          </h1>
          <p className="text-muted-foreground font-light max-w-2xl mx-auto">
            Clear standards and expectations that define excellence at Bridge Advisory Group.
          </p>
        </div>

        {/* Expectations Accordion */}
        <Accordion type="multiple" defaultValue={["professional", "client"]} className="space-y-4">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <AccordionItem 
                key={section.id} 
                value={section.id}
                className="glass-card border-white/10 px-6 rounded-xl overflow-hidden"
              >
                <AccordionTrigger className="py-5 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${section.color}`} />
                    <span className="text-foreground font-light">{section.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <ul className="space-y-3">
                    {section.items.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground font-light text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        {/* Summary Card */}
        <div className="glass-card p-6 mt-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Award className="h-5 w-5 text-foreground/60" />
            <h3 className="text-foreground font-light">The Bridge Standard</h3>
          </div>
          <p className="text-muted-foreground font-light text-sm max-w-xl mx-auto">
            We hold ourselves to the highest standards because our clients deserve nothing less. 
            Excellence is not optional—it's the foundation of everything we do.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Expectations;
