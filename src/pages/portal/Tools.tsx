import { Link } from "react-router-dom";
import { Mail, Users, Calendar, HardDrive, MessageSquare, Search, TrendingUp, Building2, Home, ExternalLink, Wand2, FileText, Calculator, FolderOpen, Send, StickyNote, ChevronRight, Wrench, Building, DollarSign, FileSignature } from "lucide-react";
import { useExternalTools } from "@/hooks/useExternalTools";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// Icon mapping for dynamic icons from database
const iconMap: Record<string, typeof Mail> = {
  Mail,
  Users,
  Calendar,
  HardDrive,
  MessageSquare,
  Search,
  TrendingUp,
  Building2,
  Home
};

// Team tools essentials (internal productivity tools)
const teamToolsEssentials = [{
  name: "eSign Suite",
  path: "/portal/esign",
  icon: FileSignature,
  description: "Electronic signatures & documents",
  color: "bg-indigo-500/20 text-indigo-400",
  isNew: true
}, {
  name: "Generators",
  path: "/portal/generators",
  icon: Wand2,
  description: "AI-powered document generation",
  color: "bg-purple-500/20 text-purple-400"
}, {
  name: "Templates",
  path: "/portal/templates",
  icon: FileText,
  description: "Division-specific templates",
  color: "bg-blue-500/20 text-blue-400"
}, {
  name: "Calculators",
  path: "/portal/calculators",
  icon: Calculator,
  description: "Financial calculators",
  color: "bg-amber-500/20 text-amber-400"
}, {
  name: "Resources",
  path: "/portal/resources",
  icon: FolderOpen,
  description: "Legal & HR documents",
  color: "bg-orange-500/20 text-orange-400"
}, {
  name: "Requests",
  path: "/portal/requests",
  icon: Send,
  description: "Business cards, marketing, BOV",
  color: "bg-rose-500/20 text-rose-400"
}, {
  name: "Notes",
  path: "/portal/notes",
  icon: StickyNote,
  description: "Personal sticky notes",
  color: "bg-cyan-500/20 text-cyan-400"
}];

// Exclusive listings
const exclusiveListings = [{
  name: "Residential",
  url: "https://streeteasy.com/building/bridge-properties",
  icon: Home,
  description: "StreetEasy listings",
  color: "bg-emerald-500/20 text-emerald-400"
}, {
  name: "Commercial",
  url: "https://bridgenyre.com/listings/commercial",
  icon: Building,
  description: "Office & retail spaces",
  color: "bg-blue-500/20 text-blue-400"
}, {
  name: "Investment Sales",
  url: "https://bridgenyre.com/listings/investment-sales",
  icon: DollarSign,
  description: "Investment opportunities",
  color: "bg-amber-500/20 text-amber-400"
}];
const Tools = () => {
  const {
    data: externalTools,
    isLoading
  } = useExternalTools();
  return <div className="flex-1 overflow-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
            <Wrench className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground font-light">Tools</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground mb-4">
            Productivity Tools
          </h1>
          <p className="text-muted-foreground font-light max-w-2xl mx-auto">
            All your essential tools and resources in one place.
          </p>
        </div>

        {/* Team Tools Essentials Section */}
        <div className="mb-12 animate-fade-in-up" style={{
        animationDelay: '0.1s'
      }}>
          <h2 className="text-xl font-light text-foreground mb-6 flex items-center gap-2">
            <Wrench className="h-4 w-4 text-muted-foreground" />
            Team Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-grid">
            {teamToolsEssentials.map(tool => {
            const Icon = tool.icon;
            return <Link key={tool.path} to={tool.path} className="glass-card p-5 group hover:border-white/20 relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-full ${tool.color.split(' ')[0]} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className={`h-6 w-6 ${tool.color.split(' ')[1]}`} />
                    </div>
                    <div className="flex items-center gap-2">
                      {'isNew' in tool && tool.isNew && (
                        <Badge className="bg-emerald-500 text-white text-[10px] px-1.5 py-0">New</Badge>
                      )}
                      <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-light text-foreground mb-2">
                    {tool.name}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground font-light">
                    {tool.description}
                  </p>
                </Link>;
          })}
          </div>
        </div>

        {/* Research Tools Section */}
        <div className="mb-12 animate-fade-in-up" style={{
        animationDelay: '0.2s'
      }}>
          <h2 className="text-xl font-light text-foreground mb-6 flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            Research Tools
          </h2>
          {isLoading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-[160px] rounded-xl" />)}
            </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-grid">
              {externalTools?.map(tool => {
            const Icon = iconMap[tool.icon] || Mail;
            return <a key={tool.id} href={tool.url} target="_blank" rel="noopener noreferrer" className={cn("group glass-card p-5 flex flex-col", "hover:border-white/20")}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all duration-300 group-hover:scale-110">
                        <Icon className="h-6 w-6 text-foreground/70 group-hover:text-foreground transition-colors duration-300" />
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors duration-300" />
                    </div>
                    
                    <h3 className="text-lg font-light text-foreground mb-2">
                      {tool.name}
                    </h3>
                    
                    {tool.description && <p className="text-sm text-muted-foreground font-light flex-1">
                        {tool.description}
                      </p>}
                    
                    <p className="text-xs text-muted-foreground/50 font-light mt-4 truncate">
                      {tool.url.replace(/^https?:\/\//, '')}
                    </p>
                  </a>;
          })}
            </div>}
        </div>

        {/* View Exclusive Listings Section */}
        <div className="animate-fade-in-up" style={{
        animationDelay: '0.3s'
      }}>
          <h2 className="text-xl font-light text-foreground mb-6 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            View Exclusive Listings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-grid">
            {exclusiveListings.map(listing => {
            const Icon = listing.icon;
            return <a key={listing.url} href={listing.url} target="_blank" rel="noopener noreferrer" className="glass-card p-5 group hover:border-white/20">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-full ${listing.color.split(' ')[0]} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className={`h-6 w-6 ${listing.color.split(' ')[1]}`} />
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors duration-300" />
                  </div>
                  
                  <h3 className="text-lg font-light text-foreground mb-2">
                    {listing.name}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground font-light">
                    {listing.description}
                  </p>
                </a>;
          })}
          </div>
        </div>
      </div>
    </div>;
};
export default Tools;