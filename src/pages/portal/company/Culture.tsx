import { Heart, Shield, Zap, TrendingUp, Users, UserCheck, Target, Eye, Clock, Sparkles } from "lucide-react";

const coreValues = [
  {
    name: "Integrity",
    description: "Transparency and honest communication in everything we do",
    icon: Shield,
    color: "bg-emerald-500/20 text-emerald-400"
  },
  {
    name: "Excellence",
    description: "Highest standards in every transaction and interaction",
    icon: Target,
    color: "bg-blue-500/20 text-blue-400"
  },
  {
    name: "Speed",
    description: "Streamlined processes that respect everyone's time",
    icon: Zap,
    color: "bg-amber-500/20 text-amber-400"
  },
  {
    name: "Growth",
    description: "Clear career paths with mentorship from senior leadership",
    icon: TrendingUp,
    color: "bg-purple-500/20 text-purple-400"
  },
  {
    name: "Collaboration",
    description: "Cross-divisional expertise on every engagement. Wins are celebrated together.",
    icon: Users,
    color: "bg-rose-500/20 text-rose-400"
  },
  {
    name: "Client-First",
    description: "Client goals drive every recommendation",
    icon: UserCheck,
    color: "bg-cyan-500/20 text-cyan-400"
  }
];

const philosophies = [
  {
    name: "Precision",
    description: "Every transaction deserves careful attention to detail with rigorous analysis and clear communication",
    icon: Target
  },
  {
    name: "Transparency",
    description: "Honest assessments, realistic timelines, and regular updates throughout every engagement",
    icon: Eye
  },
  {
    name: "Long-Term Relationships",
    description: "We invest in understanding client goals and delivering value that compounds over time",
    icon: Clock
  }
];

const differentiators = [
  { title: "Integrated View", description: "Cross-functional insights across all divisions" },
  { title: "Speed", description: "Streamlined processes that move fast" },
  { title: "Creative Marketing", description: "In-house team for compelling narratives" },
  { title: "Principal Thinking", description: "Advisory beyond just brokerage" }
];

const Culture = () => {
  return (
    <div className="min-h-screen pb-24 md:pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
            <Heart className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground font-light">Culture & Values</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground mb-4">
            What We Believe
          </h1>
          <p className="text-muted-foreground font-light max-w-2xl mx-auto">
            Our culture is built on shared values that guide how we work with clients, partners, and each other.
          </p>
        </div>

        {/* Core Values */}
        <div className="mb-12">
          <h2 className="text-xl md:text-2xl font-light text-foreground mb-6 flex items-center gap-3">
            <Shield className="h-5 w-5 text-muted-foreground" />
            Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coreValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="glass-card p-5 hover:border-white/20 transition-all duration-300 min-h-[120px]">
                  <div className={`w-10 h-10 rounded-full ${value.color.split(' ')[0]} flex items-center justify-center mb-3`}>
                    <Icon className={`h-5 w-5 ${value.color.split(' ')[1]}`} />
                  </div>
                  <h4 className="text-foreground font-light mb-2">{value.name}</h4>
                  <p className="text-sm text-muted-foreground font-light">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Our Philosophy */}
        <div className="mb-12">
          <h2 className="text-xl md:text-2xl font-light text-foreground mb-6 flex items-center gap-3">
            <Eye className="h-5 w-5 text-muted-foreground" />
            Our Philosophy
          </h2>
          <div className="space-y-4">
            {philosophies.map((philosophy, index) => {
              const Icon = philosophy.icon;
              return (
                <div key={index} className="glass-card p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="text-foreground font-light mb-1">{philosophy.name}</h4>
                      <p className="text-sm text-muted-foreground font-light">{philosophy.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Why Bridge */}
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-light text-foreground mb-6 flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-muted-foreground" />
            Why Bridge
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {differentiators.map((item, index) => (
              <div key={index} className="glass-card p-4 text-center hover:border-white/20 transition-all duration-300 min-h-[88px] flex flex-col justify-center">
                <h4 className="text-foreground font-light mb-1 text-sm">{item.title}</h4>
                <p className="text-xs text-muted-foreground font-light">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Culture;
