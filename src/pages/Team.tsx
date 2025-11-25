import { useState } from "react";
import { CheckCircle2, TrendingUp, Users, Building2 } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";
import { TeamMemberDialog } from "@/components/TeamMemberDialog";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { TeamPerformance } from "@/components/TeamPerformance";

interface TeamMember {
  name: string;
  title: string;
  bio?: string;
  email: string;
  phone?: string;
  image: string;
  instagram?: string;
  linkedin?: string;
}

const Team = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { data: leadershipData = [], isLoading: leadershipLoading } = useTeamMembers('leadership');
  const { data: salesTeamData = [], isLoading: salesTeamLoading } = useTeamMembers('sales_team');
  
  // Map database fields to component format
  const leadership = leadershipData.map(member => ({
    ...member,
    image: member.image_url || '/team-photos/placeholder.png',
    instagram: member.instagram_url,
    linkedin: member.linkedin_url,
    phone: member.phone || COMPANY_INFO.contact.phone,
  }));
  
  const investmentSalesTeam = salesTeamData.map(member => ({
    ...member,
    image: member.image_url || '/team-photos/placeholder.png',
    instagram: member.instagram_url,
    linkedin: member.linkedin_url,
    phone: member.phone || COMPANY_INFO.contact.phone,
  }));

  const handleMemberClick = (member: TeamMember) => {
    setSelectedMember(member);
    setDialogOpen(true);
  };
  return (
    <div className="min-h-screen pt-28 md:pt-36 lg:pt-44 pb-20 md:pb-28 lg:pb-36 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-20 md:mb-24 lg:mb-28 max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 md:mb-10 lg:mb-12 tracking-tight">Meet the Team</h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light">
            Senior professionals with deep NYC market expertise and proven investment sales track records
          </p>
        </div>

        {/* Leadership Section */}
        <div className="mb-24 md:mb-32 lg:mb-40">
          <div className="flex items-center gap-4 mb-14 md:mb-16 lg:mb-20">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light">Leadership</h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
            {leadership.map((member, index) => (
              <div 
                key={index} 
                onClick={() => handleMemberClick(member)}
                className="group overflow-hidden rounded-lg transition-all duration-400 hover:transform hover:-translate-y-1 cursor-pointer active:scale-[0.98]"
              >
                <div className="aspect-square bg-muted/20 relative overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg md:text-xl font-light mb-1">{member.name}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground font-light mb-4">{member.title}</p>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-light">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advisors Section */}
        <div className="mb-24 md:mb-32 lg:mb-40">
          <div className="flex items-center gap-4 mb-14 md:mb-16 lg:mb-20">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light">Advisors</h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10 lg:gap-12">
            {investmentSalesTeam.map((member, index) => (
              <div 
                key={index}
                onClick={() => handleMemberClick(member)}
                className="group overflow-hidden rounded-lg transition-all duration-400 hover:transform hover:-translate-y-1 cursor-pointer active:scale-[0.98]"
              >
                <div className="aspect-square bg-muted/20 relative overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                
                <div className="p-6">
                  <h3 className="text-base md:text-lg font-light mb-1">{member.name}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground font-light mb-4">{member.title}</p>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-light">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Collective Credentials */}
        <section className="mb-24 md:mb-32 lg:mb-40">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-12 text-center">Collective Credentials</h2>
          <TeamPerformance />
        </section>

        {/* Our Network */}
        <section className="mb-16 md:mb-20">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-12 text-center">Our Network</h2>
          <p className="text-base md:text-lg text-muted-foreground font-light text-center mb-12 max-w-3xl mx-auto">
            Strategic partnerships with industry leaders across capital markets, legal, and service providers
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="p-6 text-center border-l-2 border-accent/30 rounded-lg transition-all duration-400 hover:bg-white/[0.02]">
              <Users className="mx-auto mb-4 text-accent" size={40} />
              <h3 className="text-base md:text-lg font-light mb-2">Institutional Buyers</h3>
              <p className="text-xs md:text-sm text-muted-foreground font-light">Private equity, REITs, family offices with active NYC acquisition mandates</p>
            </div>
            <div className="p-6 text-center border-l-2 border-accent/30 rounded-lg transition-all duration-400 hover:bg-white/[0.02]">
              <TrendingUp className="mx-auto mb-4 text-accent" size={40} />
              <h3 className="text-base md:text-lg font-light mb-2">Private Capital</h3>
              <p className="text-xs md:text-sm text-muted-foreground font-light">High-net-worth individuals, syndicators, and active developers</p>
            </div>
            <div className="p-6 text-center border-l-2 border-accent/30 rounded-lg transition-all duration-400 hover:bg-white/[0.02]">
              <Building2 className="mx-auto mb-4 text-accent" size={40} />
              <h3 className="text-base md:text-lg font-light mb-2">Lender Relationships</h3>
              <p className="text-xs md:text-sm text-muted-foreground font-light">Banks, debt funds, credit unions, and agency lenders</p>
            </div>
            <div className="p-6 text-center border-l-2 border-accent/30 rounded-lg transition-all duration-400 hover:bg-white/[0.02]">
              <CheckCircle2 className="mx-auto mb-4 text-accent" size={40} />
              <h3 className="text-base md:text-lg font-light mb-2">Service Providers</h3>
              <p className="text-xs md:text-sm text-muted-foreground font-light">Real estate attorneys, title companies, engineers, and architects</p>
            </div>
          </div>
        </section>

        {/* Expertise Section */}
        <section className="p-8 md:p-12 rounded-xl bg-white/[0.02]">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-12 text-center">Team Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto">
            {[
              { title: "Market Knowledge", description: "Deep understanding of NYC neighborhoods, building types, and investor preferences across all boroughs" },
              { title: "Transaction Experience", description: "Cumulative experience handling $500M+ in middle-market investment property sales" },
              { title: "Capital Relationships", description: "Direct access to institutional and private buyers, lenders, and equity sources" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="text-accent" size={24} />
                </div>
                <h3 className="text-base md:text-lg font-light mb-3">{item.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-light">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <TeamMemberDialog 
        member={selectedMember}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default Team;
