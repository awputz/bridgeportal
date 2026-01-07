import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Phone, Mail, Linkedin, Instagram, Download, Users, Building2, Home, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { Skeleton } from "@/components/ui/skeleton";
import { downloadVCard } from "@/lib/vcard";
import { cn } from "@/lib/utils";
import { QueryErrorState } from "@/components/ui/QueryErrorState";

const divisions = [
  { id: "all", name: "All", icon: Users },
  { id: "leadership", name: "Leadership", icon: Users },
  { id: "investment-sales", name: "Investment Sales", icon: TrendingUp },
  { id: "residential", name: "Residential", icon: Home },
  { id: "operations", name: "Operations", icon: Users },
  { id: "marketing", name: "Marketing", icon: Users },
  { id: "advisory", name: "Advisory", icon: Users },
];

const Directory = () => {
  const [search, setSearch] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("all");
  const { data: members, isLoading, error, refetch } = useTeamMembers();

  const filteredMembers = useMemo(() => {
    if (!members) return [];
    
    return members.filter(member => {
      const matchesSearch = 
        member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.title.toLowerCase().includes(search.toLowerCase()) ||
        member.email.toLowerCase().includes(search.toLowerCase());
      
      const matchesDivision = 
        selectedDivision === "all" || 
        member.category.toLowerCase().includes(selectedDivision.replace("-", " "));
      
      return matchesSearch && matchesDivision;
    });
  }, [members, search, selectedDivision]);

  const handleDownloadVCard = (member: any) => {
    downloadVCard({
      name: member.name,
      email: member.email,
      phone: member.phone || "",
      title: member.title,
    });
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
        {/* Back to Company */}
        <Link 
          to="/portal/company" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          ← Back to Company
        </Link>

        {/* Header */}
        <div className="mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground mb-2">
            Company Directory
          </h1>
          <p className="text-muted-foreground font-light">
            Find and connect with your colleagues
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, title, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 focus:border-white/20"
            />
          </div>

          {/* Division Filters */}
          <div className="flex flex-wrap gap-2">
            {divisions.map((division) => {
              const Icon = division.icon;
              return (
                <button
                  key={division.id}
                  onClick={() => setSelectedDivision(division.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-light transition-all",
                    selectedDivision === division.id
                      ? "bg-foreground text-background"
                      : "bg-white/5 text-foreground/70 hover:bg-white/10 hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {division.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-6">
          {filteredMembers.length} {filteredMembers.length === 1 ? "member" : "members"} found
        </p>

        {/* Directory Grid */}
        {error ? (
          <QueryErrorState
            error={error}
            onRetry={() => refetch()}
            title="Failed to load directory"
          />
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-[280px] rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="glass-card p-5 flex flex-col"
              >
                {/* Photo */}
                <div className="w-20 h-20 rounded-full bg-white/10 mb-4 overflow-hidden flex-shrink-0">
                  {member.image_url ? (
                    <img
                      src={member.image_url}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-light text-foreground/50">
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-light text-foreground truncate">
                    {member.name}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate mb-1">
                    {member.title}
                  </p>
                  <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-white/10 text-foreground/70 mb-4">
                    {member.category}
                  </span>
                </div>

                {/* Contact Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                  {member.phone && (
                    <a
                      href={`tel:${member.phone}`}
                      className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                      title="Call"
                    >
                      <Phone className="h-4 w-4 text-foreground/70" />
                    </a>
                  )}
                  <a
                    href={`mailto:${member.email}`}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                    title="Email"
                  >
                    <Mail className="h-4 w-4 text-foreground/70" />
                  </a>
                  {member.linkedin_url && (
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                      title="LinkedIn"
                    >
                      <Linkedin className="h-4 w-4 text-foreground/70" />
                    </a>
                  )}
                  {member.instagram_url && (
                    <a
                      href={member.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                      title="Instagram"
                    >
                      <Instagram className="h-4 w-4 text-foreground/70" />
                    </a>
                  )}
                  <button
                    onClick={() => handleDownloadVCard(member)}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors ml-auto"
                    title="Save Contact"
                  >
                    <Download className="h-4 w-4 text-foreground/70" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredMembers.length === 0 && (
          <div className="text-center py-16">
            <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-light text-foreground mb-2">No members found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Directory;
