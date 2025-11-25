import { Button } from "@/components/ui/button";
import { COMPANY_INFO } from "@/lib/constants";
import { CheckCircle2 } from "lucide-react";

const leadership = [
  {
    name: "Alex Putzer",
    title: "Cofounder and Managing Partner, Bridge Advisory Group",
    bio: "Co-founder who focuses on firm-wide strategy, growth, and capital relationships. Supports investment sales platform design and major client relationships.",
    email: COMPANY_INFO.contact.email,
    phone: COMPANY_INFO.contact.phone,
    image: "/team-photos/alex-putzer.png"
  },
  {
    name: "Joshua Malekan",
    title: "Cofounder and Principal, Bridge Advisory Group | Senior Lead for Investment Sales",
    bio: "Principal and senior lead for investment sales with a focus on New York multifamily, mixed-use, and development assignments.",
    email: COMPANY_INFO.contact.email,
    phone: COMPANY_INFO.contact.phone,
    image: "/team-photos/joshua-malekan.png"
  },
  {
    name: "Eric Delafraz",
    title: "Managing Director and Head of Investment Sales, BRIDGE Investment Sales",
    bio: "Leads day-to-day investment sales operations and execution across New York City with a focus on middle market and private capital transactions.",
    email: COMPANY_INFO.contact.email,
    phone: COMPANY_INFO.contact.phone,
    image: "/team-photos/eric-delafraz.png"
  }
];

const Team = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-20 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">Meet the Team</h1>
          <p className="text-2xl text-muted-foreground leading-relaxed">
            Senior professionals with deep NYC market expertise and proven investment sales track records
          </p>
        </div>

        {/* Leadership Section */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl font-bold">Leadership</h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {leadership.map((member, index) => (
              <div 
                key={index} 
                className="group overflow-hidden rounded-lg transition-all hover:bg-white/3 border-l-2 border-transparent hover:border-accent/30"
              >
                <div className="aspect-square bg-muted/20 relative overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                  <p className="text-sm text-accent font-semibold mb-4">{member.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expertise Section */}
        <section className="backdrop-blur-sm rounded-2xl p-12 mb-20">
          <h2 className="text-3xl font-bold mb-12 text-center">Team Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "Market Knowledge",
                description: "Deep understanding of NYC neighborhoods, building types, and investor preferences across all boroughs"
              },
              {
                title: "Transaction Experience",
                description: "Cumulative experience handling $500M+ in middle-market investment property sales"
              },
              {
                title: "Capital Relationships",
                description: "Direct access to institutional and private buyers, lenders, and equity sources"
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="text-accent" size={28} />
                </div>
                <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Team;