import { useState } from "react";
import { Card } from "@/components/ui/card";
import ContactPanel from "@/components/ContactPanel";
import { COMPANY_INFO } from "@/lib/constants";

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
  const [selectedMember, setSelectedMember] = useState<typeof leadership[0] | null>(null);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Team</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {COMPANY_INFO.description.short}
          </p>
        </div>

        {/* Leadership Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-8">Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leadership.map((member, index) => (
              <Card 
                key={index} 
                className="p-6 border border-border hover-lift cursor-pointer"
                onClick={() => setSelectedMember(member)}
              >
                <img 
                  src={member.image} 
                  alt={member.name}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                  className="w-20 h-20 rounded-lg mb-4 object-cover"
                />
                <div className="hidden w-20 h-20 bg-muted/30 rounded-lg mb-4" />
                
                <h3 className="text-lg font-semibold mb-2">{member.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{member.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Panel */}
      {selectedMember && (
        <ContactPanel
          isOpen={!!selectedMember}
          onClose={() => setSelectedMember(null)}
          name={selectedMember.name}
          title={selectedMember.title}
          description={selectedMember.bio}
          email={selectedMember.email}
          phone={selectedMember.phone}
        />
      )}
    </div>
  );
};

export default Team;