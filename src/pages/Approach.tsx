import { CheckCircle2, TrendingUp, Users, Building2, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Approach = () => {
  return (
    <div className="min-h-screen pt-28 md:pt-36 lg:pt-44 pb-20 md:pb-28 lg:pb-36 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-20 md:mb-24 lg:mb-28 max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 md:mb-10 lg:mb-12 tracking-tight">Our Process</h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-loose font-light mb-6">
            Bridge Advisory Group's Investment Sales division offers strategic advisory services for property owners, developers, and investors throughout New York City. Our team combines institutional experience with an entrepreneurial approach to ensure every asset is positioned to maximize value and close efficiently.
          </p>
        </div>

        {/* Three Stage Process */}
        <section className="mb-24 md:mb-32 lg:mb-40">
          <h2 className="text-3xl md:text-4xl font-light mb-16 md:mb-20 lg:mb-24 text-center">Our Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 lg:gap-14">
            <div className="p-6 md:p-8 border-l-2 border-accent/30 rounded-lg transition-all duration-400 hover:bg-white/3 hover:transform hover:-translate-y-1">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-6">
                <span className="text-2xl font-light">1</span>
              </div>
              <h3 className="text-xl md:text-2xl font-light mb-4">Preparation and Underwriting</h3>
              <ul className="space-y-3 text-sm md:text-base text-muted-foreground font-light">
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

            <div className="p-6 md:p-8 border-l-2 border-accent/30 rounded-lg transition-all duration-400 hover:bg-white/3 hover:transform hover:-translate-y-1">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-6">
                <span className="text-2xl font-light">2</span>
              </div>
              <h3 className="text-xl md:text-2xl font-light mb-4">Market Coverage and Outreach</h3>
              <ul className="space-y-3 text-sm md:text-base text-muted-foreground font-light">
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

            <div className="p-6 md:p-8 border-l-2 border-accent/30 rounded-lg transition-all duration-400 hover:bg-white/3 hover:transform hover:-translate-y-1">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-6">
                <span className="text-2xl font-light">3</span>
              </div>
              <h3 className="text-xl md:text-2xl font-light mb-4">Bidding, Selection, and Execution</h3>
              <ul className="space-y-3 text-sm md:text-base text-muted-foreground font-light">
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

        {/* Investment Sales Services */}
        <section className="mb-24 md:mb-32 lg:mb-40">
          <h2 className="text-3xl md:text-4xl font-light mb-16 md:mb-20 lg:mb-24 text-center">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 lg:gap-14">
            <div className="p-8 md:p-10 lg:p-12 border-l-2 border-accent/30 rounded-lg transition-all duration-400 hover:bg-white/3 hover:transform hover:-translate-y-1">
              <h3 className="text-xl md:text-2xl font-light mb-4">Comprehensive Valuation & Underwriting</h3>
              <p className="text-sm md:text-base text-muted-foreground font-light mb-4">
                We provide detailed financial analysis and valuation reports tailored to each asset.
              </p>
              <ul className="space-y-2 text-sm md:text-base text-muted-foreground font-light">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={18} className="mt-0.5 text-accent flex-shrink-0" />
                  <span>Current market comps analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={18} className="mt-0.5 text-accent flex-shrink-0" />
                  <span>Rent roll assessments</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={18} className="mt-0.5 text-accent flex-shrink-0" />
                  <span>Capital expenditure planning</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={18} className="mt-0.5 text-accent flex-shrink-0" />
                  <span>Projected returns modeling</span>
                </li>
              </ul>
            </div>

            <div className="p-8 md:p-10 lg:p-12 border-l-2 border-accent/30 rounded-lg transition-all duration-400 hover:bg-white/3 hover:transform hover:-translate-y-1">
              <h3 className="text-xl md:text-2xl font-light mb-4">Deal Structuring & Execution</h3>
              <p className="text-sm md:text-base text-muted-foreground font-light mb-4">
                We specialize in complex transactions, crafting deal terms that reflect the asset's potential while aligning with client objectives.
              </p>
              <ul className="space-y-2 text-sm md:text-base text-muted-foreground font-light">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={18} className="mt-0.5 text-accent flex-shrink-0" />
                  <span>Value-add opportunities</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={18} className="mt-0.5 text-accent flex-shrink-0" />
                  <span>1031 exchanges</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={18} className="mt-0.5 text-accent flex-shrink-0" />
                  <span>Off-market assignments</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={18} className="mt-0.5 text-accent flex-shrink-0" />
                  <span>Note sales</span>
                </li>
              </ul>
            </div>

            <div className="p-8 md:p-10 lg:p-12 border-l-2 border-accent/30 rounded-lg transition-all duration-400 hover:bg-white/3 hover:transform hover:-translate-y-1">
              <h3 className="text-xl md:text-2xl font-light mb-4">Targeted Buyer Outreach</h3>
              <p className="text-sm md:text-base text-muted-foreground font-light mb-4">
                Through a curated network of qualified buyers, we ensure your asset is introduced to the right audience.
              </p>
              <ul className="space-y-2 text-sm md:text-base text-muted-foreground font-light">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={18} className="mt-0.5 text-accent flex-shrink-0" />
                  <span>High-net-worth individuals to institutional capital</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={18} className="mt-0.5 text-accent flex-shrink-0" />
                  <span>Continuously updated buyer database</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={18} className="mt-0.5 text-accent flex-shrink-0" />
                  <span>Active mandates and acquisition criteria</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={18} className="mt-0.5 text-accent flex-shrink-0" />
                  <span>Current capital deployment timelines</span>
                </li>
              </ul>
            </div>

            <div className="p-8 md:p-10 lg:p-12 border-l-2 border-accent/30 rounded-lg transition-all duration-400 hover:bg-white/3 hover:transform hover:-translate-y-1">
              <h3 className="text-xl md:text-2xl font-light mb-4">Integrated Capital Advisory</h3>
              <p className="text-sm md:text-base text-muted-foreground font-light mb-4">
                Leveraging our in-house capital advisory group to align debt and equity placement strategies with the sale process.
              </p>
              <ul className="space-y-2 text-sm md:text-base text-muted-foreground font-light">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={18} className="mt-0.5 text-accent flex-shrink-0" />
                  <span>Debt and equity placement strategies</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={18} className="mt-0.5 text-accent flex-shrink-0" />
                  <span>Optimal pricing support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={18} className="mt-0.5 text-accent flex-shrink-0" />
                  <span>Smooth closing facilitation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={18} className="mt-0.5 text-accent flex-shrink-0" />
                  <span>Lender coordination</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 md:mt-10 p-8 md:p-10 lg:p-12 border-l-2 border-accent/30 rounded-lg transition-all duration-400 hover:bg-white/3 hover:transform hover:-translate-y-1">
            <h3 className="text-xl md:text-2xl font-light mb-2">Marketing Strategy & Materials</h3>
            <p className="text-xs md:text-sm text-accent font-light mb-3">Powered by Our Fully Integrated In-House Marketing Team</p>
            <p className="text-sm md:text-base text-muted-foreground font-light mb-4">
              Each listing is supported by a custom marketing campaign that presents the asset with clarity and strength.
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm md:text-base text-muted-foreground font-light">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={18} className="mt-0.5 text-accent flex-shrink-0" />
                <span>Professionally designed Offering Memorandum</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={18} className="mt-0.5 text-accent flex-shrink-0" />
                <span>Branded outreach materials</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={18} className="mt-0.5 text-accent flex-shrink-0" />
                <span>Digital visibility across major platforms</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={18} className="mt-0.5 text-accent flex-shrink-0" />
                <span>Direct buyer engagement</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Owner Journey */}
        <section className="mb-24 md:mb-32 lg:mb-40 p-10 md:p-12 lg:p-14 rounded-xl bg-white/[0.02]">
          <h2 className="text-3xl md:text-4xl font-light mb-16 md:mb-20 lg:mb-24 text-center">Owner Journey</h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-white/10 hidden md:block" />
              
              <div className="space-y-8 md:space-y-12">
                {[
                  { step: "1", title: "Initial Consultation", description: "Discussion of goals, timeline, and property fundamentals" },
                  { step: "2", title: "Valuation and Positioning", description: "Market analysis, pricing strategy, and go-to-market recommendations" },
                  { step: "3", title: "Preparation", description: "Documentation, underwriting, and marketing materials development" },
                  { step: "4", title: "Marketing Launch", description: "Targeted outreach to qualified buyer universe" },
                  { step: "5", title: "Bidding Process", description: "Offer management, negotiation, and buyer selection" },
                  { step: "6", title: "Closing", description: "Due diligence coordination and transaction completion" }
                ].map((item, index) => (
                  <div key={index} className="relative flex gap-4 md:gap-6 items-start">
                    <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full bg-accent flex items-center justify-center text-white font-light text-lg md:text-xl z-10">
                      {item.step}
                    </div>
                    <div className="pt-1 md:pt-2 flex-1">
                      <h3 className="text-lg md:text-2xl font-light mb-2">{item.title}</h3>
                      <p className="text-sm md:text-base text-muted-foreground font-light">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Integration with Capital Advisory */}
        <section className="mb-24 md:mb-32 lg:mb-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-14 items-center">
            <div>
              <TrendingUp className="mb-6 text-accent" size={48} />
              <h2 className="text-3xl md:text-4xl font-light mb-6">Integration with Capital Advisory</h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6 font-light">
                BRIDGE Investment Sales operates within Bridge Advisory Group's broader platform, allowing seamless coordination between sale processes and capital markets.
              </p>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-light">
                This integration means owners and buyers receive real-time guidance on financing, market structure, and timing across both sale and recapitalization scenarios.
              </p>
            </div>
            
            <div className="space-y-4 md:space-y-6">
              {[
                { title: "Debt and Equity Coordination", description: "Real-time feedback on financing availability and structure during marketing" },
                { title: "Market Intelligence", description: "Current pricing, cap rates, and buyer appetite across asset classes" },
                { title: "Recapitalization Analysis", description: "Comparison of sale versus refinance or partner restructuring options" },
                { title: "Lender Relationships", description: "Direct access to debt providers for bridge, permanent, and construction financing" }
              ].map((item, index) => (
                <div key={index} className="p-4 md:p-6 border-l-2 border-accent/30 rounded-lg transition-all duration-400 hover:bg-white/3">
                  <h3 className="font-light text-base md:text-lg mb-2">{item.title}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground font-light">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Client Profile */}
        <section className="mb-16 md:mb-24 p-8 md:p-12 rounded-xl bg-white/[0.02]">
          <h2 className="text-3xl md:text-4xl font-light mb-12 text-center">Client Profile</h2>
          <p className="text-base md:text-lg text-muted-foreground font-light text-center mb-12 max-w-3xl mx-auto">
            We work with a broad range of sellers to achieve their investment goals
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="p-6 text-center border-l-2 border-accent/30 rounded-lg transition-all duration-400 hover:bg-white/3 hover:transform hover:-translate-y-1">
              <Users className="mx-auto mb-4 text-accent" size={40} />
              <h3 className="text-lg md:text-xl font-light mb-2">Private Owners</h3>
              <p className="text-sm md:text-base text-muted-foreground font-light">Family offices and individual property owners</p>
            </div>
            <div className="p-6 text-center border-l-2 border-accent/30 rounded-lg transition-all duration-400 hover:bg-white/3 hover:transform hover:-translate-y-1">
              <Building2 className="mx-auto mb-4 text-accent" size={40} />
              <h3 className="text-lg md:text-xl font-light mb-2">Owner-Operators</h3>
              <p className="text-sm md:text-base text-muted-foreground font-light">Developers and active property managers</p>
            </div>
            <div className="p-6 text-center border-l-2 border-accent/30 rounded-lg transition-all duration-400 hover:bg-white/3 hover:transform hover:-translate-y-1">
              <TrendingUp className="mx-auto mb-4 text-accent" size={40} />
              <h3 className="text-lg md:text-xl font-light mb-2">Institutional Investors</h3>
              <p className="text-sm md:text-base text-muted-foreground font-light">Funds and institutional capital partners</p>
            </div>
            <div className="p-6 text-center border-l-2 border-accent/30 rounded-lg transition-all duration-400 hover:bg-white/3 hover:transform hover:-translate-y-1">
              <Award className="mx-auto mb-4 text-accent" size={40} />
              <h3 className="text-lg md:text-xl font-light mb-2">Distressed Assets</h3>
              <p className="text-sm md:text-base text-muted-foreground font-light">Asset holders and receivers</p>
            </div>
          </div>
        </section>

        {/* What Sets Us Apart */}
        <section className="p-8 md:p-12 rounded-xl bg-white/[0.02] mb-16">
          <h2 className="text-3xl md:text-4xl font-light mb-12 text-center">What Sets Us Apart</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {[
              { icon: Users, title: "Senior Talent", description: "Team led by professionals with $100M+ in career transactions and deep NYC market knowledge" },
              { icon: TrendingUp, title: "Middle Market Focus", description: "Concentrated expertise in $2M–$50M transactions where process and relationships matter most" },
              { icon: CheckCircle2, title: "Institutional Process", description: "Disciplined underwriting, targeted marketing, and structured bidding for every assignment" },
              { icon: Award, title: "In-House Marketing Team", description: "Dedicated marketing professionals integrated directly into our process—no outsourcing, no delays" }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="mx-auto mb-4 text-accent" size={40} />
                  <h3 className="text-lg md:text-xl font-light mb-3">{item.title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* A Strategic Sales Partner - CTA */}
        <section className="p-8 md:p-12 rounded-xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/5">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-light mb-6">A Strategic Sales Partner</h2>
            <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed mb-8">
              At Bridge Advisory Group, we take a hands-on, data-driven approach to investment sales. From pre-market analysis through closing, our focus is on providing clarity, speed, and results.
            </p>
            <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed mb-8">
              If you're considering selling or recapitalizing an asset, our team is ready to advise.
            </p>
            <Button asChild size="lg" className="font-light px-8 md:px-12">
              <Link to="/submit-deal">Ready to Discuss Your Asset?</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Approach;
