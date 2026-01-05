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
import { DashboardStats } from "@/components/portal/DashboardStats";
import { DealPipelinePreview } from "@/components/portal/DealPipelinePreview";
import { InlineDivisionSwitcher } from "@/components/portal/InlineDivisionSwitcher";
import { ProfileCard } from "@/components/portal/ProfileCard";
import { WelcomeBanner } from "@/components/portal/WelcomeBanner";
import { DashboardTasks } from "@/components/portal/DashboardTasks";
import { AnnouncementsWidget } from "@/components/portal/AnnouncementsWidget";
import { GoogleWorkspaceWidget } from "@/components/portal/GoogleWorkspaceWidget";
import { AlertsWidget } from "@/components/portal/AlertsWidget";
import { OnboardingTooltip } from "@/components/portal/OnboardingTooltip";
import { useOnboardingTooltips } from "@/hooks/useOnboardingTooltips";

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
  const { dismissStep, dismissAll } = useOnboardingTooltips();

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
        {/* Welcome Banner + Division Switcher */}
        <div className="flex flex-col gap-6 mb-8 animate-fade-in">
          <OnboardingTooltip
            id="dashboard-welcome"
            title="Your Command Center"
            description="This dashboard gives you quick access to all your tools, CRM, tasks, and more. Let's take a quick tour!"
            position="bottom"
            step={1}
            totalSteps={5}
            onNext={() => dismissStep("dashboard-welcome")}
            onSkipAll={dismissAll}
          >
            <WelcomeBanner />
          </OnboardingTooltip>
          <InlineDivisionSwitcher />
        </div>

        {/* ACTIONS HUB - Primary Actions */}
        <section className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
          <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <a href="tel:2125319295" className="glass-card p-4 flex items-center gap-3 hover:border-primary/50 group">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <span className="text-sm font-medium text-foreground">Call Office</span>
                <p className="text-xs text-muted-foreground">(212) 531-9295</p>
              </div>
            </a>
            <Link to="/portal/requests" className="glass-card p-4 flex items-center gap-3 hover:border-amber-500/50 group">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <Send className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <span className="text-sm font-medium text-foreground">Submit Request</span>
                <p className="text-xs text-muted-foreground">Cards, BOV, etc.</p>
              </div>
            </Link>
            <Link to="/portal/commission-request" className="glass-card p-4 flex items-center gap-3 hover:border-emerald-500/50 group">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <DollarSign className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-sm font-medium text-foreground">Commission Request</span>
                <p className="text-xs text-muted-foreground">Request payment</p>
              </div>
            </Link>
            <Link to="/portal/exclusives/new" className="glass-card p-4 flex items-center gap-3 hover:border-purple-500/50 group">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <ClipboardCheck className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <span className="text-sm font-medium text-foreground">Submit Exclusive</span>
                <p className="text-xs text-muted-foreground">New listing</p>
              </div>
            </Link>
          </div>
        </section>

        {/* Secondary Actions Row */}
        <section className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
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

        {/* Profile Card */}
        <section className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <ProfileCard />
        </section>

        {/* CRM Stats */}
        <section className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <DashboardStats />
        </section>

        {/* Google Workspace + Announcements */}
        <section className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <GoogleWorkspaceWidget />
            <div className="space-y-4">
              <AnnouncementsWidget />
              <AlertsWidget />
            </div>
          </div>
        </section>

        {/* AI Quick Prompt */}
        <section className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
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

        {/* Tasks + Deal Pipeline */}
        <section className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DashboardTasks />
            <DealPipelinePreview />
          </div>
        </section>

        {/* Quick Tools - Combined Research & Team Tools */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-light text-foreground flex items-center gap-2">
              <Wrench className="h-5 w-5 text-muted-foreground" />
              Quick Tools
            </h2>
            <Link to="/portal/tools" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-[120px] rounded-xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...groupedTools.research || [], ...groupedTools.productivity || []].slice(0, 6).map(tool => {
                const Icon = iconMap[tool.icon] || Database;
                return <QuickActionCard key={tool.id} name={tool.name} description={tool.description || undefined} icon={Icon} url={tool.url} />;
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
