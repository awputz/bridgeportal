import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Users, Calendar, HardDrive, MessageSquare, Search, ArrowRight, TrendingUp, Building2, Home, FileText, Calculator, Sparkles, Palette, Database, FileSearch, MapPin, Send, UserPlus, FolderPlus, ListTodo, Wand2, Wrench, FolderOpen, DollarSign, Phone, Settings } from "lucide-react";
import { useExternalTools, ExternalTool } from "@/hooks/useExternalTools";
import { useIsAdminOrAgent } from "@/hooks/useUserRole";
import { Skeleton } from "@/components/ui/skeleton";
import { QuickActionCard } from "@/components/portal/QuickActionCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DashboardStats } from "@/components/portal/DashboardStats";
import { DealPipelinePreview } from "@/components/portal/DealPipelinePreview";
import { GlobalDivisionSwitcher } from "@/components/portal/GlobalDivisionSwitcher";
import { ProfileCard } from "@/components/portal/ProfileCard";
import { WelcomeBanner } from "@/components/portal/WelcomeBanner";
import { DashboardTasks } from "@/components/portal/DashboardTasks";

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
  Home,
  Database,
  FileSearch,
  MapPin
};

// Quick links to all portal pages (removed Analytics)
const quickLinks = [{
  name: "CRM",
  path: "/portal/crm",
  icon: Building2
}, {
  name: "Tasks",
  path: "/portal/tasks",
  icon: ListTodo
}, {
  name: "Directory",
  path: "/portal/directory",
  icon: Users
}, {
  name: "AI",
  path: "/portal/ai",
  icon: Sparkles
}, {
  name: "Templates",
  path: "/portal/templates",
  icon: FileText
}, {
  name: "Generators",
  path: "/portal/generators",
  icon: Wand2
}, {
  name: "Calculators",
  path: "/portal/calculators",
  icon: Calculator
}, {
  name: "Tools",
  path: "/portal/tools",
  icon: Wrench
}, {
  name: "Resources",
  path: "/portal/resources",
  icon: FolderOpen
}, {
  name: "Requests",
  path: "/portal/requests",
  icon: Send
}, {
  name: "Transactions",
  path: "/portal/my-transactions",
  icon: DollarSign
}];
const calculatorQuickAccess = [{
  name: "Cap Rate",
  path: "/portal/calculators?tab=investment-sales",
  icon: TrendingUp
}, {
  name: "Lease Analysis",
  path: "/portal/calculators?tab=commercial-leasing",
  icon: Building2
}, {
  name: "Rent vs Buy",
  path: "/portal/calculators?tab=residential",
  icon: Home
}];

// Exclusive listings links
const exclusiveListings = [{
  name: "Residential",
  url: "https://streeteasy.com/profile/957575-bridge-advisory-group?tab_profile=active_listings",
  icon: Home,
  external: true,
  color: "bg-emerald-500/20 text-emerald-400"
}, {
  name: "Commercial",
  url: "/commercial-listings",
  icon: Building2,
  external: false,
  color: "bg-blue-500/20 text-blue-400"
}, {
  name: "Investment Sales",
  url: "/services/investment-sales/listings",
  icon: TrendingUp,
  external: false,
  color: "bg-purple-500/20 text-purple-400"
}];

// Group tools by category
const groupToolsByCategory = (tools: ExternalTool[]) => {
  const groups: Record<string, ExternalTool[]> = {
    research: [],
    productivity: []
  };
  tools.forEach(tool => {
    const category = (tool as any).category || 'research';
    if (!groups[category]) groups[category] = [];
    groups[category].push(tool);
  });
  return groups;
};
const Dashboard = () => {
  const {
    data: tools,
    isLoading
  } = useExternalTools();
  const {
    isAdminOrAgent,
    role
  } = useIsAdminOrAgent();
  const [aiPrompt, setAiPrompt] = useState("");
  const navigate = useNavigate();
  const groupedTools = tools ? groupToolsByCategory(tools) : {
    research: [],
    productivity: []
  };
  const isAdmin = role === 'admin';
  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (aiPrompt.trim()) {
      navigate(`/portal/ai?prompt=${encodeURIComponent(aiPrompt)}`);
    }
  };
  return <div className="min-h-screen pb-24 md:pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Personalized Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <WelcomeBanner />
          <div className="flex items-center gap-2">
            <GlobalDivisionSwitcher />
            {isAdmin && <Link to="/admin">
                
              </Link>}
          </div>
        </div>

        {/* Quick Actions Row: Call Office + Request */}
        <section className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="tel:2125319295" className="glass-card p-4 flex items-center gap-3 hover:border-primary/50 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <span className="text-sm font-medium text-foreground">Call Office</span>
                <p className="text-xs text-muted-foreground">(212) 531-9295</p>
              </div>
            </a>
            <Link to="/portal/requests" className="glass-card p-4 flex items-center gap-3 hover:border-amber-500/50 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Send className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <span className="text-sm font-medium text-foreground">Submit Request</span>
                <p className="text-xs text-muted-foreground">Cards, BOV, etc.</p>
              </div>
            </Link>
            <Link to="/portal/crm?action=add-contact" className="glass-card p-4 flex items-center gap-3 hover:border-green-500/50 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <UserPlus className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <span className="text-sm font-medium text-foreground">Add Contact</span>
                <p className="text-xs text-muted-foreground">CRM</p>
              </div>
            </Link>
            <Link to="/portal/crm?action=new-deal" className="glass-card p-4 flex items-center gap-3 hover:border-blue-500/50 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <FolderPlus className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <span className="text-sm font-medium text-foreground">New Deal</span>
                <p className="text-xs text-muted-foreground">Pipeline</p>
              </div>
            </Link>
          </div>
        </section>

        {/* My Profile Card */}
        <section className="mb-8">
          <ProfileCard />
        </section>

        {/* CRM Stats */}
        <section className="mb-8">
          <DashboardStats />
        </section>

        {/* Exclusive Listings */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-light text-foreground flex items-center gap-2">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              View Our Exclusive Listings
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {exclusiveListings.map(listing => {
            const Icon = listing.icon;
            const content = <div className="glass-card p-4 flex flex-col items-center justify-center text-center hover:border-white/20 transition-all duration-300 min-h-[100px]">
                  <div className={`w-10 h-10 rounded-full ${listing.color.split(' ')[0]} flex items-center justify-center mb-2`}>
                    <Icon className={`h-5 w-5 ${listing.color.split(' ')[1]}`} />
                  </div>
                  <span className="text-sm font-light text-foreground">{listing.name}</span>
                  {listing.external}
                </div>;
            return listing.external ? <a key={listing.name} href={listing.url} target="_blank" rel="noopener noreferrer">
                  {content}
                </a> : <Link key={listing.name} to={listing.url}>
                  {content}
                </Link>;
          })}
          </div>
        </section>

        {/* AI Quick Prompt */}
        <section className="mb-8">
          <form onSubmit={handleAiSubmit} className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-5 w-5 text-foreground" />
              </div>
              <Input value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} placeholder="Ask Bridge AI anything... (deal analysis, emails, market research)" className="flex-1 bg-transparent border-0 focus-visible:ring-0 text-foreground placeholder:text-muted-foreground" />
              <Button type="submit" size="icon" disabled={!aiPrompt.trim()} className="h-10 w-10 rounded-full bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 flex-shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </section>

        {/* Tasks + Deal Pipeline */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Tasks with Filters */}
            <DashboardTasks />
            
            {/* Right: Deal Pipeline Preview */}
            <DealPipelinePreview />
          </div>
        </section>

        {/* Research Tools */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-light text-foreground flex items-center gap-2">
              <Database className="h-5 w-5 text-muted-foreground" />
              Research Tools
            </h2>
          </div>
          
          {isLoading ? <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-[120px] rounded-xl" />)}
            </div> : <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {groupedTools.research?.map(tool => {
            const Icon = iconMap[tool.icon] || Database;
            return <QuickActionCard key={tool.id} name={tool.name} description={tool.description || undefined} icon={Icon} url={tool.url} />;
          })}
            </div>}
        </section>

        {/* Productivity Tools */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-light text-foreground flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-muted-foreground" />
              Productivity
            </h2>
          </div>
          
          {isLoading ? <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-[120px] rounded-xl" />)}
            </div> : <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {groupedTools.productivity?.map(tool => {
            const Icon = iconMap[tool.icon] || Mail;
            return <QuickActionCard key={tool.id} name={tool.name} description={tool.description || undefined} icon={Icon} url={tool.url} />;
          })}
            </div>}
        </section>

        {/* Calculator Quick Access */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-light text-foreground flex items-center gap-2">
              <Calculator className="h-5 w-5 text-muted-foreground" />
              Calculators
            </h2>
            <Link to="/portal/calculators" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors font-light">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {calculatorQuickAccess.map(calc => {
            const Icon = calc.icon;
            return <Link key={calc.name} to={calc.path} className="glass-card p-4 flex flex-col items-center justify-center text-center hover:border-white/20 transition-all duration-300 min-h-[100px]">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-2">
                    <Icon className="h-5 w-5 text-foreground/70" />
                  </div>
                  <span className="text-sm font-light text-foreground">{calc.name}</span>
                </Link>;
          })}
          </div>
        </section>

        {/* Templates Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-light text-foreground flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              Templates
            </h2>
            <Link to="/portal/templates" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors font-light">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/portal/templates/investment-sales" className="glass-card p-4 flex flex-col items-center gap-2 hover:border-white/20 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-foreground/60" />
              </div>
              <span className="text-sm font-light text-foreground text-center">Investment Sales</span>
            </Link>
            
            <Link to="/portal/templates/commercial-leasing" className="glass-card p-4 flex flex-col items-center gap-2 hover:border-white/20 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-foreground/60" />
              </div>
              <span className="text-sm font-light text-foreground text-center">Commercial</span>
            </Link>
            
            <Link to="/portal/templates/residential" className="glass-card p-4 flex flex-col items-center gap-2 hover:border-white/20 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <Home className="h-5 w-5 text-foreground/60" />
              </div>
              <span className="text-sm font-light text-foreground text-center">Residential</span>
            </Link>
            
            <Link to="/portal/templates/marketing" className="glass-card p-4 flex flex-col items-center gap-2 hover:border-white/20 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <Palette className="h-5 w-5 text-foreground/60" />
              </div>
              <span className="text-sm font-light text-foreground text-center">Marketing</span>
            </Link>
          </div>
        </section>

        {/* All Portal Pages - Quick Links */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-light text-foreground flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
              All Pages
            </h2>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {quickLinks.map(link => {
            const Icon = link.icon;
            return <Link key={link.path} to={link.path} className="glass-card p-3 flex flex-col items-center justify-center text-center hover:border-white/20 transition-all duration-300 min-h-[80px]">
                  <Icon className="h-5 w-5 text-foreground/60 mb-1.5" />
                  <span className="text-xs font-light text-foreground">{link.name}</span>
                </Link>;
          })}
          </div>
        </section>
      </div>
    </div>;
};
export default Dashboard;