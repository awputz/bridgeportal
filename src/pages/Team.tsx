import { useState, useRef } from "react";
import { CheckCircle2, TrendingUp, Users, Building2 } from "lucide-react";
import { TeamMemberDialog } from "@/components/TeamMemberDialog";
import { useBridgeAgents, BridgeAgent, TeamCategory } from "@/hooks/useBridgeAgents";
import { TeamPerformance } from "@/components/TeamPerformance";
import { use3DTilt } from "@/hooks/useMousePosition";
import { SEOHelmet } from "@/components/SEOHelmet";
interface TeamMember {
  name: string;
  title: string;
  bio?: string;
  image: string;
  instagram?: string;
  linkedin?: string;
  email?: string;
  phone?: string;
}
const CATEGORY_LABELS: Record<TeamCategory, string> = {
  'Leadership': 'Leadership',
  'Investment Sales': 'Investment Sales',
  'Residential': 'Residential',
  'Operations': 'Operations',
  'Marketing': 'Marketing',
  'Advisory': 'Advisory'
};
const Team = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    data,
    isLoading
  } = useBridgeAgents();
  const mapAgentToMember = (agent: BridgeAgent): TeamMember => ({
    name: agent.name,
    title: agent.title,
    bio: agent.bio,
    image: agent.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.name)}&size=400&background=18181b&color=fff`,
    instagram: agent.instagram_url,
    linkedin: agent.linkedin_url,
    email: agent.email,
    phone: agent.phone,
  });
  const handleMemberClick = (member: TeamMember) => {
    setSelectedMember(member);
    setDialogOpen(true);
  };
  const TiltCard = ({
    agent,
    isLarge
  }: {
    agent: BridgeAgent;
    isLarge: boolean;
  }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const {
      handleMouseMove,
      handleMouseLeave,
      tiltStyle
    } = use3DTilt(cardRef, 8);
    const member = mapAgentToMember(agent);
    return <div ref={cardRef} onClick={() => handleMemberClick(member)} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={tiltStyle} className="group glass-card overflow-hidden cursor-pointer active:scale-[0.98] will-change-transform">
        <div className="aspect-square bg-muted/20 relative overflow-hidden">
          <img src={member.image} alt={member.name} onError={e => {
          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&size=400&background=18181b&color=fff`;
        }} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
        </div>

        <div className={isLarge ? "p-5" : "p-4"}>
          <h3 className={`${isLarge ? "text-lg" : "text-base"} font-light mb-1`}>{member.name}</h3>
          <p className="text-xs text-muted-foreground font-light mb-1">{member.title}</p>
          {isLarge && member.bio && <p className="text-xs text-muted-foreground/80 leading-relaxed font-light line-clamp-2 mt-2">{member.bio}</p>}
        </div>
      </div>;
  };
  const renderAgentCard = (agent: BridgeAgent, isLarge: boolean = false) => {
    return <TiltCard key={agent.id} agent={agent} isLarge={isLarge} />;
  };
  const renderSection = (category: TeamCategory, isLeadership: boolean = false) => {
    const agents = data?.grouped[category] || [];
    if (agents.length === 0) return null;
    return <div className="mb-10 sm:mb-16 md:mb-24 lg:mb-32">
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light">{CATEGORY_LABELS[category]}</h2>
          <div className="h-px flex-1 bg-border" />
        </div>
        
        <div className={`grid ${isLeadership ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6' : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-5'} stagger-reveal`}>
          {agents.map(agent => renderAgentCard(agent, isLeadership))}
        </div>
      </div>;
  };
  if (isLoading) {
    return <div className="min-h-screen pt-28 md:pt-36 lg:pt-44 pb-20 md:pb-28 lg:pb-36 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="animate-pulse space-y-8">
            <div className="h-12 w-64 bg-muted rounded" />
            <div className="h-6 w-96 bg-muted rounded" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="aspect-square bg-muted rounded-lg" />)}
            </div>
          </div>
        </div>
      </div>;
  }
  return <div className="min-h-screen pt-20 sm:pt-24 md:pt-32 lg:pt-40 pb-12 sm:pb-16 md:pb-24 lg:pb-32 px-4 md:px-6 lg:px-8">
      <SEOHelmet title="Our Team | Bridge Advisory Group - NYC Real Estate Experts" description="Meet the Bridge Advisory Group team - senior professionals with deep NYC market expertise and proven investment sales track records." path="/team" />
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 sm:mb-12 md:mb-20 lg:mb-24 max-w-4xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light mb-4 sm:mb-6 md:mb-8 lg:mb-10 tracking-tight">Meet the Team</h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed font-light">
            Senior professionals with deep NYC market expertise and proven investment sales track records
          </p>
        </div>

        {/* Team Sections */}
        {renderSection('Leadership', true)}
        {renderSection('Investment Sales')}
        {renderSection('Residential')}
        {renderSection('Operations')}
        {renderSection('Marketing')}
        {renderSection('Advisory')}

        {/* Collective Credentials */}
        

        {/* Our Network */}
        

        {/* Expertise Section */}
        <section className="p-6 md:p-10 lg:p-12 rounded-xl bg-white/[0.02]">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-light mb-8 md:mb-12 text-center">Team Expertise</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10 max-w-5xl mx-auto">
            {[{
            title: "Market Knowledge",
            description: "Deep understanding of NYC neighborhoods, building types, and investor preferences across all boroughs"
          }, {
            title: "Transaction Experience",
            description: "Cumulative experience handling $500M+ in middle-market investment property sales"
          }, {
            title: "Capital Relationships",
            description: "Direct access to institutional and private buyers, lenders, and equity sources"
          }].map((item, index) => <div key={index} className="text-center">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="text-accent" size={24} />
                </div>
                <h3 className="text-base md:text-lg font-light mb-3">{item.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-light">{item.description}</p>
              </div>)}
          </div>
        </section>
      </div>

      <TeamMemberDialog member={selectedMember} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>;
};
export default Team;