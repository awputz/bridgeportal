import { Target, Eye, Compass, Lightbulb } from "lucide-react";

const Mission = () => {
  return (
    <div className="min-h-screen pb-24 md:pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground font-light">Mission & Vision</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground mb-4">
            Our Purpose
          </h1>
          <p className="text-muted-foreground font-light max-w-2xl mx-auto">
            Guiding principles that drive everything we do at Bridge Advisory Group.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="glass-card p-8 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <Target className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-light text-foreground mb-2">Mission Statement</h2>
              <p className="text-muted-foreground text-sm font-light">What we strive to accomplish every day</p>
            </div>
          </div>
          <blockquote className="text-lg md:text-xl font-light text-foreground leading-relaxed pl-4 border-l-2 border-emerald-500/50">
            "To deliver exceptional real estate advisory services through integrity, expertise, and client-first service. 
            We redefine real estate service excellence across New York through expert-led strategies that maximize value 
            and foster long-term relationships."
          </blockquote>
        </div>

        {/* Vision Statement */}
        <div className="glass-card p-8 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Eye className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-light text-foreground mb-2">Vision Statement</h2>
              <p className="text-muted-foreground text-sm font-light">Where we're headed</p>
            </div>
          </div>
          <blockquote className="text-lg md:text-xl font-light text-foreground leading-relaxed pl-4 border-l-2 border-blue-500/50">
            "To be New York's most trusted real estate advisory platform, known for innovative approaches, 
            integration of services, and unwavering commitment to client success."
          </blockquote>
        </div>

        {/* Our Approach */}
        <div className="glass-card p-8 mb-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <Compass className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-light text-foreground mb-2">Our Approach</h2>
              <p className="text-muted-foreground text-sm font-light">How we operate</p>
            </div>
          </div>
          <blockquote className="text-lg md:text-xl font-light text-foreground leading-relaxed pl-4 border-l-2 border-amber-500/50">
            "Principal-level thinking combined with hands-on execution across every transaction."
          </blockquote>
        </div>

        {/* Key Takeaway */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/10">
            <Lightbulb className="h-5 w-5 text-foreground/60" />
            <span className="text-foreground font-light">Integrity · Expertise · Client-First</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mission;
