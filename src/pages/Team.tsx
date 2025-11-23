import { useState } from "react";
import { Card } from "@/components/ui/card";
import ContactPanel from "@/components/ContactPanel";
import { COMPANY_INFO } from "@/lib/constants";

const leadership = [
  {
    name: "Alex Putzer",
    title: "Co-founder and Managing Partner, Bridge Advisory Group",
    bio: "Alex Putzer is a co-founder of Bridge Advisory Group and focuses on firm-wide strategy, growth, and capital relationships. His background spans residential and commercial leasing, investment sales, and capital advisory. At BRIDGE Residential he supports platform design, marketing standards, and major landlord relationships.",
    email: COMPANY_INFO.contact.residentialEmail,
    phone: COMPANY_INFO.contact.phone,
    image: "/team-photos/alex-putzer.png"
  },
  {
    name: "Jacob Neiderfer",
    title: "Managing Director, Bridge Advisory Group | Director of Residential Leasing, BRIDGE Residential",
    bio: "Jacob Neiderfer leads BRIDGE Residential as Director of Residential Leasing and serves as Managing Director at Bridge Advisory Group. He is responsible for day-to-day residential operations, systems, and process, with a focus on full building lease-ups, new launches, and high-volume rental assignments across Manhattan, Brooklyn, and Queens.",
    email: COMPANY_INFO.contact.residentialEmail,
    phone: COMPANY_INFO.contact.phone,
    image: "/team-photos/jacob-neiderfer.png"
  }
];

const residentialAdvisors = [
  {
    name: "Henny Sherman",
    title: "Residential Leasing Associate",
    bio: "Henny Sherman is a residential leasing associate at BRIDGE Residential, working across core Manhattan and Brooklyn neighborhoods. She focuses on high-intent renter clients and building-level assignments, with a detail-oriented approach to showings, applications, and day-to-day client service.",
    email: COMPANY_INFO.contact.residentialEmail,
    phone: COMPANY_INFO.contact.phone,
    image: "/team-photos/henny-sherman.png"
  },
  {
    name: "Coco Campbell",
    title: "Residential Leasing Associate",
    bio: "Coco Campbell is a residential leasing associate focused on design-driven rentals and curated searches. She supports both direct renter clients and landlord relationships, working inside the BRIDGE Residential platform for listings, marketing, and deal execution.",
    email: COMPANY_INFO.contact.residentialEmail,
    phone: COMPANY_INFO.contact.phone,
    image: "/team-photos/coco-campbell.png"
  }
];

const Team = () => {
  const [selectedMember, setSelectedMember] = useState<typeof leadership[0] | null>(null);

  return (
    <div className="min-h-screen pt-36 pb-20">
      {/* Header */}
      <section className="px-6 lg:px-8 mb-20 pt-8">
        <div className="container mx-auto max-w-5xl">
          <h1 className="mb-4">The Team</h1>
          <p className="text-xl text-muted max-w-2xl leading-relaxed mb-8">
            {COMPANY_INFO.description.short}
          </p>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="px-6 lg:px-8 mb-20">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-2xl font-semibold mb-8">Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {leadership.map((member, index) => (
              <Card 
                key={index} 
                className="p-8 border border-border rounded-lg cursor-pointer hover-lift transition-all"
                onClick={() => setSelectedMember(member)}
              >
                {/* Profile Image */}
                <img 
                  src={member.image} 
                  alt={member.name}
                  onError={(e) => {
                    // Show placeholder if image fails to load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                  className="w-24 h-24 rounded-lg mb-6 object-cover"
                />
                <div className="hidden w-24 h-24 bg-muted/30 rounded-lg mb-6" />
                
                {/* Member Info */}
                <div>
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-sm text-muted mb-4">{member.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Residential Advisors Section */}
      <section className="px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-2xl font-semibold mb-8">Residential Advisors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {residentialAdvisors.map((member, index) => (
              <Card 
                key={index} 
                className="p-8 border border-border rounded-lg cursor-pointer hover-lift transition-all"
                onClick={() => setSelectedMember(member)}
              >
                {/* Profile Image */}
                <img 
                  src={member.image} 
                  alt={member.name}
                  onError={(e) => {
                    // Show placeholder if image fails to load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                  className="w-24 h-24 rounded-lg mb-6 object-cover"
                />
                <div className="hidden w-24 h-24 bg-muted/30 rounded-lg mb-6" />
                
                {/* Member Info */}
                <div>
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-sm text-muted mb-4">{member.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

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
