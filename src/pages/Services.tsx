import { CheckCircle2, FileText, TrendingUp, Users, Building2, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Services = () => {
  return (
    <div className="min-h-screen pt-24 md:pt-32 lg:pt-40 pb-16 md:pb-20 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 md:mb-20 max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 tracking-tight">Investment Sales Services</h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light">
            Strategic advisory for property owners, developers, and investors throughout NYC
          </p>
        </div>

        {/* Services Overview Grid */}
        <section className="mb-16 md:mb-24">
          <div className="grid grid-cols-1 gap-8 md:gap-12">
            {/* Service 1 */}
            <div className="p-8 md:p-12 border-l-2 border-accent/30 rounded-lg bg-white/[0.02] transition-all duration-400 hover:bg-white/[0.04]">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="text-accent" size={28} />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-light mb-3">Comprehensive Valuation & Underwriting</h2>
                  <p className="text-base md:text-lg text-muted-foreground font-light">
                    We provide detailed financial analysis and valuation reports tailored to each asset, incorporating current market conditions and projected returns.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-light uppercase tracking-wider text-muted-foreground mb-3">Key Deliverables</h3>
                  <ul className="space-y-2 text-sm md:text-base font-light">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={18} className="mt-0.5 text-accent flex-shrink-0" />
                      <span>Current market comparables analysis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={18} className="mt-0.5 text-accent flex-shrink-0" />
                      <span>Rent roll assessment and verification</span>
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
                <div>
                  <h3 className="text-sm font-light uppercase tracking-wider text-muted-foreground mb-3">Typical Timeline</h3>
                  <p className="text-sm md:text-base font-light mb-4">1-2 weeks for comprehensive analysis</p>
                  <h3 className="text-sm font-light uppercase tracking-wider text-muted-foreground mb-3">Best For</h3>
                  <p className="text-sm md:text-base font-light">Multifamily, mixed-use, and income-producing properties valued $2M-$50M</p>
                </div>
              </div>
            </div>

            {/* Service 2 */}
            <div className="p-8 md:p-12 border-l-2 border-accent/30 rounded-lg bg-white/[0.02] transition-all duration-400 hover:bg-white/[0.04]">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="text-accent" size={28} />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-light mb-3">Deal Structuring & Execution</h2>
                  <p className="text-base md:text-lg text-muted-foreground font-light">
                    We specialize in complex transactions, crafting deal terms that reflect the asset's potential while aligning with client objectives.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-light uppercase tracking-wider text-muted-foreground mb-3">Transaction Types</h3>
                  <ul className="space-y-2 text-sm md:text-base font-light">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={18} className="mt-0.5 text-accent flex-shrink-0" />
                      <span>Value-add opportunities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={18} className="mt-0.5 text-accent flex-shrink-0" />
                      <span>1031 exchange coordination</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={18} className="mt-0.5 text-accent flex-shrink-0" />
                      <span>Off-market assignments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={18} className="mt-0.5 text-accent flex-shrink-0" />
                      <span>Note sales and distressed assets</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-light uppercase tracking-wider text-muted-foreground mb-3">Typical Timeline</h3>
                  <p className="text-sm md:text-base font-light mb-4">4-12 weeks from listing to closing</p>
                  <h3 className="text-sm font-light uppercase tracking-wider text-muted-foreground mb-3">Best For</h3>
                  <p className="text-sm md:text-base font-light">Owners with unique circumstances, timeline constraints, or complex tax situations</p>
                </div>
              </div>
            </div>

            {/* Service 3 */}
            <div className="p-8 md:p-12 border-l-2 border-accent/30 rounded-lg bg-white/[0.02] transition-all duration-400 hover:bg-white/[0.04]">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Users className="text-accent" size={28} />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-light mb-3">Targeted Buyer Outreach</h2>
                  <p className="text-base md:text-lg text-muted-foreground font-light">
                    Through a curated network of qualified buyers, we ensure your asset is introduced to the right audience with active capital to deploy.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-light uppercase tracking-wider text-muted-foreground mb-3">Buyer Categories</h3>
                  <ul className="space-y-2 text-sm md:text-base font-light">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={18} className="mt-0.5 text-accent flex-shrink-0" />
                      <span>High-net-worth individuals and family offices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={18} className="mt-0.5 text-accent flex-shrink-0" />
                      <span>Institutional capital and private equity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={18} className="mt-0.5 text-accent flex-shrink-0" />
                      <span>Active developers and syndicators</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={18} className="mt-0.5 text-accent flex-shrink-0" />
                      <span>Continuously updated acquisition mandates</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-light uppercase tracking-wider text-muted-foreground mb-3">Our Advantage</h3>
                  <p className="text-sm md:text-base font-light mb-4">Direct access to decision-makers with current capital deployment timelines and acquisition criteria</p>
                  <h3 className="text-sm font-light uppercase tracking-wider text-muted-foreground mb-3">Coverage</h3>
                  <p className="text-sm md:text-base font-light">All NYC boroughs with concentration in Manhattan, Brooklyn, and Queens</p>
                </div>
              </div>
            </div>

            {/* Service 4 */}
            <div className="p-8 md:p-12 border-l-2 border-accent/30 rounded-lg bg-white/[0.02] transition-all duration-400 hover:bg-white/[0.04]">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Building2 className="text-accent" size={28} />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-light mb-3">Integrated Capital Advisory</h2>
                  <p className="text-base md:text-lg text-muted-foreground font-light">
                    Leveraging our in-house capital advisory group to align debt and equity placement strategies with the sale process for optimal pricing and smooth closings.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-light uppercase tracking-wider text-muted-foreground mb-3">Advisory Services</h3>
                  <ul className="space-y-2 text-sm md:text-base font-light">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={18} className="mt-0.5 text-accent flex-shrink-0" />
                      <span>Debt and equity placement coordination</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={18} className="mt-0.5 text-accent flex-shrink-0" />
                      <span>Buyer financing facilitation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={18} className="mt-0.5 text-accent flex-shrink-0" />
                      <span>Lender relationship management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={18} className="mt-0.5 text-accent flex-shrink-0" />
                      <span>Real-time market structure guidance</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-light uppercase tracking-wider text-muted-foreground mb-3">Impact on Sale</h3>
                  <p className="text-sm md:text-base font-light mb-4">Coordinated capital markets access increases buyer confidence and reduces financing contingency risk</p>
                  <h3 className="text-sm font-light uppercase tracking-wider text-muted-foreground mb-3">Best For</h3>
                  <p className="text-sm md:text-base font-light">Sellers seeking maximum price certainty and execution confidence</p>
                </div>
              </div>
            </div>

            {/* Service 5 */}
            <div className="p-8 md:p-12 border-l-2 border-accent/30 rounded-lg bg-white/[0.02] transition-all duration-400 hover:bg-white/[0.04]">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Award className="text-accent" size={28} />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-light mb-3">Marketing Strategy & Materials</h2>
                  <p className="text-base md:text-lg text-muted-foreground font-light">
                    Each listing is supported by a custom marketing campaign that presents the asset with clarity, professionalism, and strategic positioning.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-light uppercase tracking-wider text-muted-foreground mb-3">Marketing Components</h3>
                  <ul className="space-y-2 text-sm md:text-base font-light">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={18} className="mt-0.5 text-accent flex-shrink-0" />
                      <span>Professionally designed Offering Memorandum</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={18} className="mt-0.5 text-accent flex-shrink-0" />
                      <span>Branded digital and print materials</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={18} className="mt-0.5 text-accent flex-shrink-0" />
                      <span>Platform visibility (CoStar, LoopNet, proprietary channels)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={18} className="mt-0.5 text-accent flex-shrink-0" />
                      <span>Direct buyer engagement and outreach</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-light uppercase tracking-wider text-muted-foreground mb-3">Our Approach</h3>
                  <p className="text-sm md:text-base font-light mb-4">Tailored positioning for each asset type and buyer universe with emphasis on financial clarity and upside potential</p>
                  <h3 className="text-sm font-light uppercase tracking-wider text-muted-foreground mb-3">Timeline</h3>
                  <p className="text-sm md:text-base font-light">Materials developed within 5-7 days of engagement</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Comparison Table */}
        <section className="mb-16 md:mb-24 hidden lg:block">
          <h2 className="text-3xl md:text-4xl font-light mb-12 text-center">Why Bridge Advisory Group</h2>
          <div className="overflow-hidden rounded-xl border border-white/10">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="text-left p-4 md:p-6 font-light text-base md:text-lg">Feature</th>
                  <th className="text-center p-4 md:p-6 font-light text-base md:text-lg">Basic Broker</th>
                  <th className="text-center p-4 md:p-6 font-light text-base md:text-lg text-accent">Bridge Advisory Group</th>
                </tr>
              </thead>
              <tbody className="text-sm md:text-base font-light">
                <tr className="border-b border-white/5">
                  <td className="p-4 md:p-6">Valuation Analysis</td>
                  <td className="p-4 md:p-6 text-center text-muted-foreground">Basic CMA</td>
                  <td className="p-4 md:p-6 text-center text-accent">Comprehensive Underwriting</td>
                </tr>
                <tr className="border-b border-white/5 bg-white/[0.01]">
                  <td className="p-4 md:p-6">1031 Exchange Support</td>
                  <td className="p-4 md:p-6 text-center text-muted-foreground">Limited</td>
                  <td className="p-4 md:p-6 text-center text-accent">Full Service Coordination</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-4 md:p-6">Buyer Network</td>
                  <td className="p-4 md:p-6 text-center text-muted-foreground">Local Only</td>
                  <td className="p-4 md:p-6 text-center text-accent">Institutional + Private Capital</td>
                </tr>
                <tr className="border-b border-white/5 bg-white/[0.01]">
                  <td className="p-4 md:p-6">Capital Advisory</td>
                  <td className="p-4 md:p-6 text-center text-muted-foreground">Referral Based</td>
                  <td className="p-4 md:p-6 text-center text-accent">In-House Team</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-4 md:p-6">Marketing Materials</td>
                  <td className="p-4 md:p-6 text-center text-muted-foreground">Template Based</td>
                  <td className="p-4 md:p-6 text-center text-accent">Fully Branded & Custom</td>
                </tr>
                <tr className="bg-white/[0.01]">
                  <td className="p-4 md:p-6">Transaction Support</td>
                  <td className="p-4 md:p-6 text-center text-muted-foreground">Agent Only</td>
                  <td className="p-4 md:p-6 text-center text-accent">Full Team Platform</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Process Integration CTA */}
        <section className="p-8 md:p-12 rounded-xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/5 text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-6">See How We Execute</h2>
          <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed mb-8 max-w-2xl mx-auto">
            Our services are backed by a proven process that delivers clarity, speed, and results from pre-market analysis through closing.
          </p>
          <Button asChild size="lg" className="font-light px-8 md:px-12">
            <Link to="/approach">View Our Process</Link>
          </Button>
        </section>
      </div>
    </div>
  );
};

export default Services;