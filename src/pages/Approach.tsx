import { CheckCircle2, TrendingUp, Users } from "lucide-react";

const Approach = () => {
  return (
    <div className="min-h-screen pt-32 px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Approach</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            BRIDGE Investment Sales combines aggressive marketing, disciplined underwriting, and capital markets access to run full sale and recapitalization processes for middle market owners and investors.
          </p>
        </div>

        {/* Three Stage Process */}
        <section className="mb-24">
          <h2 className="text-4xl font-bold mb-12 text-center">Our Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border-l-2 border-accent/30 rounded-lg transition-all hover:bg-white/3 backdrop-blur-sm">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-6">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Preparation and Underwriting</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={20} className="mt-0.5 text-accent flex-shrink-0" />
                  <span>Property inspection and documentation review</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={20} className="mt-0.5 text-accent flex-shrink-0" />
                  <span>Financial analysis and rent roll verification</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={20} className="mt-0.5 text-accent flex-shrink-0" />
                  <span>Market positioning and pricing strategy</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={20} className="mt-0.5 text-accent flex-shrink-0" />
                  <span>Marketing materials and offering memorandum</span>
                </li>
              </ul>
            </div>

            <div className="p-8 border-l-2 border-accent/30 rounded-lg transition-all hover:bg-white/3 backdrop-blur-sm">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-6">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Market Coverage and Outreach</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={20} className="mt-0.5 text-accent flex-shrink-0" />
                  <span>Targeted buyer universe development</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={20} className="mt-0.5 text-accent flex-shrink-0" />
                  <span>Direct outreach to qualified investors</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={20} className="mt-0.5 text-accent flex-shrink-0" />
                  <span>Property tours and due diligence coordination</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={20} className="mt-0.5 text-accent flex-shrink-0" />
                  <span>Continuous market feedback and positioning</span>
                </li>
              </ul>
            </div>

            <div className="p-8 border-l-2 border-accent/30 rounded-lg transition-all hover:bg-white/3 backdrop-blur-sm">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-6">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Bidding, Selection, and Execution</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={20} className="mt-0.5 text-accent flex-shrink-0" />
                  <span>Bid management and negotiation strategy</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={20} className="mt-0.5 text-accent flex-shrink-0" />
                  <span>Contract terms and structure optimization</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={20} className="mt-0.5 text-accent flex-shrink-0" />
                  <span>Due diligence support and coordination</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={20} className="mt-0.5 text-accent flex-shrink-0" />
                  <span>Closing management through completion</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Owner Journey */}
        <section className="mb-24 backdrop-blur-sm rounded-2xl p-12">
          <h2 className="text-4xl font-bold mb-12 text-center">Owner Journey</h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-white/10" />
              
              {/* Steps */}
              <div className="space-y-12">
                {[
                  {
                    step: "1",
                    title: "Initial Consultation",
                    description: "Discussion of goals, timeline, and property fundamentals"
                  },
                  {
                    step: "2",
                    title: "Valuation and Positioning",
                    description: "Market analysis, pricing strategy, and go-to-market recommendations"
                  },
                  {
                    step: "3",
                    title: "Preparation",
                    description: "Documentation, underwriting, and marketing materials development"
                  },
                  {
                    step: "4",
                    title: "Marketing Launch",
                    description: "Targeted outreach to qualified buyer universe"
                  },
                  {
                    step: "5",
                    title: "Bidding Process",
                    description: "Offer management, negotiation, and buyer selection"
                  },
                  {
                    step: "6",
                    title: "Closing",
                    description: "Due diligence coordination and transaction completion"
                  }
                ].map((item, index) => (
                  <div key={index} className="relative flex gap-6 items-start">
                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-accent flex items-center justify-center text-white font-bold text-xl z-10">
                      {item.step}
                    </div>
                    <div className="pt-2">
                      <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Integration with Capital Advisory */}
        <section className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <TrendingUp className="mb-6 text-accent" size={48} />
              <h2 className="text-4xl font-bold mb-6">Integration with Capital Advisory</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                BRIDGE Investment Sales operates within Bridge Advisory Group's broader platform, allowing seamless coordination between sale processes and capital markets.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                This integration means owners and buyers receive real-time guidance on financing, market structure, and timing across both sale and recapitalization scenarios.
              </p>
            </div>
            
              <div className="space-y-6">
              {[
                {
                  title: "Debt and Equity Coordination",
                  description: "Real-time feedback on financing availability and structure during marketing"
                },
                {
                  title: "Market Intelligence",
                  description: "Current pricing, cap rates, and buyer appetite across asset classes"
                },
                {
                  title: "Recapitalization Analysis",
                  description: "Comparison of sale versus refinance or partner restructuring options"
                },
                {
                  title: "Lender Relationships",
                  description: "Direct access to debt providers for bridge, permanent, and construction financing"
                }
              ].map((item, index) => (
                <div key={index} className="p-6 border-l-2 border-accent/30 rounded-lg backdrop-blur-sm hover:bg-white/3 transition-all">
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What Sets Us Apart */}
        <section className="backdrop-blur-sm rounded-2xl p-12">
          <h2 className="text-4xl font-bold mb-12 text-center">What Sets Us Apart</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Senior Talent",
                description: "Team led by professionals with $100M+ in career transactions and deep NYC market knowledge"
              },
              {
                icon: TrendingUp,
                title: "Middle Market Focus",
                description: "Concentrated expertise in $2M–$50M transactions where process and relationships matter most"
              },
              {
                icon: CheckCircle2,
                title: "Institutional Process",
                description: "Disciplined underwriting, targeted marketing, and structured bidding for every assignment"
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="mx-auto mb-4 text-accent" size={48} />
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Approach;