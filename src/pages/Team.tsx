import { CheckCircle2 } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";

const leadership = [
  {
    name: "Alex Putzer",
    title: "Cofounder and Managing Partner",
    bio: "Co-founder who focuses on firm-wide strategy, growth, and capital relationships. Supports investment sales platform design and major client relationships.",
    email: COMPANY_INFO.contact.email,
    phone: COMPANY_INFO.contact.phone,
    image: "/team-photos/alex-putzer.png"
  },
  {
    name: "Joshua Malekan",
    title: "Cofounder and Principal",
    bio: "Principal and senior lead for investment sales with a focus on New York multifamily, mixed-use, and development assignments.",
    email: COMPANY_INFO.contact.email,
    phone: COMPANY_INFO.contact.phone,
    image: "/team-photos/joshua-malekan.png"
  },
  {
    name: "Eric Delafraz",
    title: "Managing Director",
    bio: "Leads day-to-day investment sales operations and execution across New York City with a focus on middle market and private capital transactions.",
    email: COMPANY_INFO.contact.email,
    phone: COMPANY_INFO.contact.phone,
    image: "/team-photos/eric-delafraz.png"
  }
];

const Team = () => {
  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-16 md:pb-20 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 md:mb-20 max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-light mb-6 tracking-tight">Meet the Team</h1>
          <p className="text-lg md:text-2xl text-muted-foreground leading-relaxed font-light">
            Senior professionals with deep NYC market expertise and proven investment sales track records
          </p>
        </div>

        {/* Leadership Section */}
        <div className="mb-16 md:mb-20">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-2xl md:text-3xl font-light">Leadership</h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {leadership.map((member, index) => (
              <div 
                key={index} 
                className="group overflow-hidden rounded-lg transition-all duration-400 hover:transform hover:-translate-y-1"
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

        {/* Expertise Section */}
        <section className="p-8 md:p-12 rounded-xl bg-white/[0.02]">
          <h2 className="text-2xl md:text-3xl font-light mb-12 text-center">Team Expertise</h2>
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
    </div>
  );
};

export default Team;
