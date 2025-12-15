import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBridgeAgents, type TeamCategory } from "@/hooks/useBridgeAgents";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface TeamHighlightProps {
  category?: TeamCategory;
  title?: string;
  subtitle?: string;
  showCTA?: boolean;
  maxMembers?: number;
  className?: string;
  includeNames?: string[];
}

export function TeamHighlight({ 
  category, 
  title = "Meet Our Team",
  subtitle,
  showCTA = true,
  maxMembers = 4,
  className = "",
  includeNames = []
}: TeamHighlightProps) {
  const reveal = useScrollReveal(0.1);
  const { data } = useBridgeAgents();
  
  // Get agents from specified category
  let agents = category 
    ? (data?.grouped[category] || []).slice(0, maxMembers)
    : (data?.grouped.Leadership || []).slice(0, maxMembers);
  
  // If specific names are provided, include those members from any category
  if (includeNames.length > 0 && data?.all) {
    const namedAgents = data.all.filter(agent => 
      includeNames.some(name => agent.name.toLowerCase().includes(name.toLowerCase()))
    );
    // Combine named agents with category agents, avoiding duplicates
    const existingIds = new Set(agents.map(a => a.id));
    const uniqueNamedAgents = namedAgents.filter(a => !existingIds.has(a.id));
    agents = [...uniqueNamedAgents, ...agents].slice(0, maxMembers);
  }

  if (agents.length === 0) return null;

  return (
    <section 
      className={`py-16 md:py-24 border-b border-border/10 ${className}`}
      ref={reveal.elementRef}
    >
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        <div className={`text-center mb-10 transition-all duration-700 ${
          reveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4">{title}</h2>
          {subtitle && (
            <p className="text-muted-foreground font-light max-w-2xl mx-auto text-sm md:text-base">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {agents.map((agent, index) => (
            <Link
              key={agent.id}
              to={`/team#${agent.slug || agent.id}`}
              className={`group text-center transition-all duration-500 ${
                reveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: reveal.isVisible ? `${index * 100}ms` : '0ms' }}
            >
              <div className="relative aspect-square mb-3 rounded-lg overflow-hidden bg-muted/20">
                {agent.image_url ? (
                  <img
                    src={agent.image_url}
                    alt={agent.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary">
                    <span className="text-3xl md:text-4xl font-light text-muted-foreground">
                      {agent.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
              </div>
              <h3 className="text-sm md:text-base font-medium group-hover:text-primary transition-colors">
                {agent.name}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground font-light">
                {agent.title}
              </p>
            </Link>
          ))}
        </div>

        {showCTA && (
          <div className={`text-center mt-8 transition-all duration-700 ${
            reveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`} style={{ transitionDelay: reveal.isVisible ? '400ms' : '0ms' }}>
            <Button asChild variant="link" className="font-light group text-muted-foreground hover:text-foreground">
              <Link to="/team">
                Meet the Full Team
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
