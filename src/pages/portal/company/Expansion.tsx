import { Link } from "react-router-dom";
import { Globe, MapPin, Building2, Users, Award, ArrowRight, Sparkles } from "lucide-react";

const upcomingMarkets = [
  {
    name: "Bridge Florida",
    locations: ["Palm Beach", "West Palm Beach", "Miami"],
    status: "In Development",
    icon: "🌴"
  },
  {
    name: "Bridge Los Angeles",
    locations: ["Los Angeles", "Malibu"],
    status: "In Development",
    icon: "🌅"
  },
  {
    name: "Bridge Boston",
    locations: ["Greater Boston"],
    status: "In Development",
    icon: "🏛️"
  },
  {
    name: "Bridge New Jersey",
    locations: ["New Jersey"],
    status: "In Development",
    icon: "🏢"
  }
];

const agentBenefits = [
  {
    title: "Growth Opportunities",
    description: "Opportunities for growth into new markets as we expand"
  },
  {
    title: "Referral Partnerships",
    description: "Referral partnerships with future offices across the country"
  },
  {
    title: "Consistent Culture",
    description: "Consistent culture and standards across all locations"
  },
  {
    title: "First Access",
    description: "First access to expansion opportunities for high performers"
  }
];

const Expansion = () => {
  return (
    <div className="min-h-screen pb-24 md:pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
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
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground font-light">Expansion</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground mb-4">
            Growing Our Platform
          </h1>
          <p className="text-muted-foreground font-light max-w-2xl mx-auto">
            Bridge Advisory Group is expanding its platform into select new markets. These future offices are in development 
            and will share the same standards for service, process, and culture that define our New York platform.
          </p>
        </div>

        {/* Current HQ */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <Building2 className="h-6 w-6 text-emerald-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-light text-foreground">Bridge New York</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">Active HQ</span>
              </div>
              <p className="text-muted-foreground font-light text-sm">600 Third Avenue · Floors 2 & 10</p>
            </div>
          </div>
        </div>

        {/* Upcoming Markets */}
        <div className="mb-12">
          <h2 className="text-xl md:text-2xl font-light text-foreground mb-6 flex items-center gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            Upcoming Markets
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingMarkets.map((market, index) => (
              <div key={index} className="glass-card p-5 hover:border-white/20 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">{market.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-foreground font-light">{market.name}</h4>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                        {market.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground font-light">
                      {market.locations.join(" · ")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What This Means for Agents */}
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-light text-foreground mb-6 flex items-center gap-3">
            <Users className="h-5 w-5 text-muted-foreground" />
            What This Means for Agents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agentBenefits.map((benefit, index) => (
              <div key={index} className="glass-card p-5">
                <div className="flex items-start gap-3">
                  <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-foreground font-light mb-1">{benefit.title}</h4>
                    <p className="text-sm text-muted-foreground font-light">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center glass-card p-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-foreground/60" />
            <h3 className="text-foreground font-light">One Platform, Multiple Markets</h3>
          </div>
          <p className="text-muted-foreground font-light text-sm max-w-xl mx-auto">
            As we grow, our commitment to excellence, collaboration, and client-first service remains constant. 
            High performers will have first access to leadership opportunities in new markets.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Expansion;
