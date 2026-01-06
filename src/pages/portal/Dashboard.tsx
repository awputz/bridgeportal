import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Mail, Users, Calendar, HardDrive, MessageSquare, Search, ArrowRight, TrendingUp, 
  Building2, Home, FileText, Calculator, Sparkles, Palette, Database, FileSearch, 
  MapPin, Send, UserPlus, FolderPlus, ListTodo, Wand2, Wrench, FolderOpen, 
  DollarSign, Phone, Target, Heart, Globe, Headphones, Bell, ClipboardCheck
} from "lucide-react";
import { useExternalTools, ExternalTool } from "@/hooks/useExternalTools";
import { useIsAdminOrAgent } from "@/hooks/useUserRole";
import { Skeleton } from "@/components/ui/skeleton";
import { QuickActionCard } from "@/components/portal/QuickActionCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CRMCommandCenter } from "@/components/portal/CRMCommandCenter";
import { WelcomeBanner } from "@/components/portal/WelcomeBanner";
import { AnnouncementsWidget } from "@/components/portal/AnnouncementsWidget";
import { GmailWidget } from "@/components/portal/GmailWidget";
import { GoogleCalendarWidget } from "@/components/portal/GoogleCalendarWidget";
import { AlertsWidget } from "@/components/portal/AlertsWidget";
import { SectionErrorBoundary } from "@/components/portal/SectionErrorBoundary";

// Icon mapping for dynamic icons from database
const iconMap: Record<string, typeof Mail> = {
  Mail, Users, Calendar, HardDrive, MessageSquare, Search, TrendingUp,
  Building2, Home, Database, FileSearch, MapPin
};

// Quick links to all portal pages
const quickLinks = [
  { name: "CRM", path: "/portal/crm", icon: Building2 },
  { name: "Tasks", path: "/portal/tasks", icon: ListTodo },
  { name: "Directory", path: "/portal/directory", icon: Users },
  { name: "AI", path: "/portal/ai", icon: Sparkles },
  { name: "Templates", path: "/portal/templates", icon: FileText },
  { name: "Generators", path: "/portal/generators", icon: Wand2 },
  { name: "Calculators", path: "/portal/calculators", icon: Calculator },
  { name: "Tools", path: "/portal/tools", icon: Wrench },
  { name: "Resources", path: "/portal/resources", icon: FolderOpen },
  { name: "Requests", path: "/portal/requests", icon: Send },
  { name: "Transactions", path: "/portal/my-transactions", icon: DollarSign },
];

// Company quick links
const companyQuickLinks = [
  { name: "About Us", path: "/portal/company/about", icon: Building2 },
  { name: "Mission", path: "/portal/company/mission", icon: Target },
  { name: "Culture", path: "/portal/company/culture", icon: Heart },
  { name: "Expansion", path: "/portal/company/expansion", icon: Globe },
  { name: "Contact", path: "/portal/company/contact", icon: Headphones },
  { name: "News", path: "/portal/announcements", icon: Bell },
];

// Exclusive listings links
const exclusiveListings = [
  { name: "Residential", url: "https://streeteasy.com/profile/957575-bridge-advisory-group?tab_profile=active_listings", icon: Home, external: true, color: "bg-emerald-500/20 text-emerald-400" },
  { name: "Commercial", url: "https://bridgenyre.com/commercial-listings", icon: Building2, external: true, color: "bg-blue-500/20 text-blue-400" },
  { name: "Investment Sales", url: "https://bridgenyre.com/services/investment-sales/listings", icon: TrendingUp, external: true, color: "bg-purple-500/20 text-purple-400" },
];

// Group tools by category
const groupToolsByCategory = (tools: ExternalTool[]) => {
  const groups: Record<string, ExternalTool[]> = { research: [], productivity: [] };
  tools.forEach(tool => {
    const category = (tool as any).category || 'research';
    if (!groups[category]) groups[category] = [];
    groups[category].push(tool);
  });
  return groups;
};

const Dashboard = () => {
  const { data: tools, isLoading } = useExternalTools();
  const { role } = useIsAdminOrAgent();
  const [aiPrompt, setAiPrompt] = useState("");
  const navigate = useNavigate();
  

  const groupedTools = tools ? groupToolsByCategory(tools) : { research: [], productivity: [] };

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (aiPrompt.trim()) {
      navigate(`/portal/ai?prompt=${encodeURIComponent(aiPrompt)}`);
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
        {/* 1. Welcome Banner */}
        <div className="mb-6 animate-fade-in">
          <WelcomeBanner />
        </div>

        {/* 2. Quick Actions Hub - Primary Actions */}
        <section className="mb-4 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
          <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <a href="tel:2125319295" className="glass-card px-4 h-16 flex items-center gap-3 hover:border-primary/50 group">
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
                <Phone className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 flex flex-col justify-center">
                <span className="text-sm font-medium text-foreground block truncate leading-tight">Call Office</span>
                <span className="text-xs text-muted-foreground truncate leading-tight">(212) 531-9295</span>
              </div>
            </a>
            <Link to="/portal/requests" className="glass-card px-4 h-16 flex items-center gap-3 hover:border-amber-500/50 group">
              <div className="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
                <Send className="h-4 w-4 text-amber-400" />
              </div>
              <div className="min-w-0 flex flex-col justify-center">
                <span className="text-sm font-medium text-foreground block truncate leading-tight">Submit Request</span>
                <span className="text-xs text-muted-foreground truncate leading-tight">Cards, BOV, etc.</span>
              </div>
            </Link>
            <Link to="/portal/commission-request" className="glass-card px-4 h-16 flex items-center gap-3 hover:border-emerald-500/50 group">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
                <DollarSign className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="min-w-0 flex flex-col justify-center">
                <span className="text-sm font-medium text-foreground block truncate leading-tight">Commission Request</span>
                <span className="text-xs text-muted-foreground truncate leading-tight">Request payment</span>
              </div>
            </Link>
            <Link to="/portal/exclusives/new" className="glass-card px-4 h-16 flex items-center gap-3 hover:border-purple-500/50 group">
              <div className="w-9 h-9 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
                <ClipboardCheck className="h-4 w-4 text-purple-400" />
              </div>
              <div className="min-w-0 flex flex-col justify-center">
                <span className="text-sm font-medium text-foreground block truncate leading-tight">Submit Exclusive</span>
                <span className="text-xs text-muted-foreground truncate leading-tight">New listing</span>
              </div>
            </Link>
          </div>
        </section>

        {/* Secondary Actions Row */}
        <section className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.08s' }}>
          <div className="grid grid-cols-4 gap-3">
            <Link to="/portal/crm?action=add-contact" className="glass-card p-3 flex flex-col items-center justify-center gap-1 hover:border-green-500/50 group text-center">
              <UserPlus className="h-5 w-5 text-green-400 transition-transform group-hover:scale-110" />
              <span className="text-xs text-muted-foreground">Add Contact</span>
            </Link>
            <Link to="/portal/crm?action=new-deal" className="glass-card p-3 flex flex-col items-center justify-center gap-1 hover:border-blue-500/50 group text-center">
              <FolderPlus className="h-5 w-5 text-blue-400 transition-transform group-hover:scale-110" />
              <span className="text-xs text-muted-foreground">New Deal</span>
            </Link>
            <Link to="/portal/tasks?action=new" className="glass-card p-3 flex flex-col items-center justify-center gap-1 hover:border-orange-500/50 group text-center">
              <ListTodo className="h-5 w-5 text-orange-400 transition-transform group-hover:scale-110" />
              <span className="text-xs text-muted-foreground">New Task</span>
            </Link>
            <Link to="/portal/ai" className="glass-card p-3 flex flex-col items-center justify-center gap-1 hover:border-primary/50 group text-center">
              <Sparkles className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
              <span className="text-xs text-muted-foreground">Bridge AI</span>
            </Link>
          </div>
        </section>

        {/* 3. CRM Command Center - Unified Section */}
        <section className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.12s' }}>
          <SectionErrorBoundary sectionName="CRM Command Center">
            <CRMCommandCenter />
          </SectionErrorBoundary>
        </section>

        {/* 4. Gmail & Calendar Side-by-Side */}
        <section className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.16s' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <SectionErrorBoundary sectionName="Gmail">
              <GmailWidget />
            </SectionErrorBoundary>
            <SectionErrorBoundary sectionName="Google Calendar">
              <GoogleCalendarWidget />
            </SectionErrorBoundary>
          </div>
        </section>

        {/* 5. Announcements & Alerts */}
        <section className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.18s' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <SectionErrorBoundary sectionName="Announcements">
              <AnnouncementsWidget />
            </SectionErrorBoundary>
            <SectionErrorBoundary sectionName="Alerts">
              <AlertsWidget />
            </SectionErrorBoundary>
          </div>
        </section>

        {/* 5. AI Quick Prompt */}
        <section className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <form onSubmit={handleAiSubmit} className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-5 w-5 text-foreground" />
              </div>
              <Input 
                value={aiPrompt} 
                onChange={e => setAiPrompt(e.target.value)} 
                placeholder="Ask Bridge AI anything... (deal analysis, emails, market research)" 
                className="flex-1 bg-transparent border-0 focus-visible:ring-0 text-foreground placeholder:text-muted-foreground" 
              />
              <Button type="submit" size="icon" disabled={!aiPrompt.trim()} className="h-10 w-10 rounded-full bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 flex-shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </section>

        {/* 6. Discovery Section - Exclusive Listings */}
        <section className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.24s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-light text-foreground flex items-center gap-2">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              View Our Exclusive Listings
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-3 auto-rows-fr">
            {exclusiveListings.map(listing => {
              const Icon = listing.icon;
              const content = (
                <div className="glass-card p-3 sm:p-4 flex flex-col items-center justify-center text-center hover:border-white/20 transition-all duration-300 h-full">
                  <div className={`w-10 h-10 rounded-full ${listing.color.split(' ')[0]} flex items-center justify-center mb-2 flex-shrink-0`}>
                    <Icon className={`h-5 w-5 ${listing.color.split(' ')[1]}`} />
                  </div>
                  <span className="text-xs sm:text-sm font-light text-foreground line-clamp-1">{listing.name}</span>
                </div>
              );
              return listing.external ? (
                <a key={listing.name} href={listing.url} target="_blank" rel="noopener noreferrer" className="h-full">
                  {content}
                </a>
              ) : (
                <Link key={listing.name} to={listing.url} className="h-full">
                  {content}
                </Link>
              );
            })}
          </div>
        </section>

        {/* Research Tools */}
        <section className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.26s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-light text-foreground flex items-center gap-2">
              <Database className="h-5 w-5 text-muted-foreground" />
              Research Tools
            </h2>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-[120px] rounded-xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {groupedTools.research?.map(tool => {
                const Icon = iconMap[tool.icon] || Database;
                return <QuickActionCard key={tool.id} name={tool.name} description={tool.description || undefined} icon={Icon} url={tool.url} />;
              })}
            </div>
          )}
        </section>

        {/* Team Tools */}
        <section className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.28s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-light text-foreground flex items-center gap-2">
              <Wrench className="h-5 w-5 text-muted-foreground" />
              Team Tools
            </h2>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-[120px] rounded-xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {groupedTools.productivity?.map(tool => {
                const Icon = iconMap[tool.icon] || Mail;
                return <QuickActionCard key={tool.id} name={tool.name} description={tool.description || undefined} icon={Icon} url={tool.url} />;
              })}
            </div>
          )}
        </section>

        {/* 7. Company Quick Links */}
        <section className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-light text-foreground flex items-center gap-2">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              Company
            </h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {companyQuickLinks.map(link => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="glass-card p-3 flex flex-col items-center justify-center text-center hover:border-white/20 transition-all duration-300 min-h-[80px]"
                >
                  <Icon className="h-5 w-5 text-foreground/60 mb-1.5" />
                  <span className="text-xs font-light text-foreground">{link.name}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* All Portal Pages */}
        <section className="animate-fade-in-up" style={{ animationDelay: '0.32s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-light text-foreground flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
              All Pages
            </h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {quickLinks.map(link => {
              const Icon = link.icon;
              return (
                <Link key={link.path} to={link.path} className="glass-card p-3 flex flex-col items-center justify-center text-center hover:border-white/20 transition-all duration-300 min-h-[80px]">
                  <Icon className="h-5 w-5 text-foreground/60 mb-1.5" />
                  <span className="text-xs font-light text-foreground">{link.name}</span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
