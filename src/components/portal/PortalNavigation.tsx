import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LayoutDashboard, FileText, Wrench, LogOut, Settings, Users, Sparkles, Calculator, Briefcase, Wand2, User, ChevronDown, ListTodo, FolderOpen, Send, Building2, Heart, Target, Globe, Headphones, Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useIsAdminOrAgent } from "@/hooks/useUserRole";
import { NotificationCenter } from "./NotificationCenter";

// Core navigation items (always visible)
const coreNavItems = [
  { name: "Dashboard", path: "/portal", icon: LayoutDashboard },
  { name: "CRM", path: "/portal/crm", icon: Briefcase },
  { name: "Tasks", path: "/portal/tasks", icon: ListTodo },
  { name: "Directory", path: "/portal/directory", icon: Users },
];

// Company pages dropdown
const companyItems = [
  { name: "About Us", path: "/portal/company/about", icon: Building2, description: "Our story and divisions" },
  { name: "Mission & Vision", path: "/portal/company/mission", icon: Target, description: "Our guiding principles" },
  { name: "Culture & Values", path: "/portal/company/culture", icon: Heart, description: "What we believe" },
  { name: "Expectations", path: "/portal/company/expectations", icon: Users, description: "Agent standards" },
  { name: "Expansion", path: "/portal/company/expansion", icon: Globe, description: "Future markets" },
  { name: "Contact", path: "/portal/company/contact", icon: Headphones, description: "Get support" },
  { name: "Announcements", path: "/portal/announcements", icon: Bell, description: "Company news" },
];

// Productivity tools (grouped in dropdown)
const productivityItems = [
  { name: "Generators", path: "/portal/generators", icon: Wand2, description: "AI-powered document generation" },
  { name: "Templates", path: "/portal/templates", icon: FileText, description: "Division-specific templates" },
  { name: "Calculators", path: "/portal/calculators", icon: Calculator, description: "Financial calculators" },
  { name: "Tools", path: "/portal/tools", icon: Wrench, description: "External resources" },
  { name: "Resources", path: "/portal/resources", icon: FolderOpen, description: "Legal & HR documents" },
  { name: "Requests", path: "/portal/requests", icon: Send, description: "Business cards, marketing, BOV" },
];

// All nav items for mobile
const allNavItems = [
  ...coreNavItems,
  ...companyItems,
  ...productivityItems,
  { name: "AI", path: "/portal/ai", icon: Sparkles },
  { name: "Profile", path: "/portal/profile", icon: User },
];

export const PortalNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdminOrAgent } = useIsAdminOrAgent();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      navigate('/login');
    }
  };

  const isProductivityActive = productivityItems.some(
    item => location.pathname === item.path || location.pathname.startsWith(item.path)
  );

  const isCompanyActive = companyItems.some(
    item => location.pathname === item.path || location.pathname.startsWith(item.path)
  );

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-3 pt-3 md:px-4 md:pt-3 lg:px-5 lg:pt-4">
        <div className="max-w-7xl mx-auto glass-nav">
          {/* Mobile Layout */}
          <div className="flex lg:hidden items-center justify-between h-14 px-4">
            <Link to="/portal" className="flex items-center flex-shrink-0">
              <img 
                src="/lovable-uploads/20d12fb8-7a61-4b15-bf8f-cdd401ddb12d.png" 
                alt="Bridge Agent Portal" 
                className="h-11 sm:h-12 w-auto" 
              />
            </Link>
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="p-3 -mr-2 text-foreground hover:text-foreground/80 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center" 
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <Menu 
                  size={22} 
                  className={`absolute inset-0 transition-all duration-300 ${isOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} 
                />
                <X 
                  size={22} 
                  className={`absolute inset-0 transition-all duration-300 ${isOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} 
                />
              </div>
            </button>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid grid-cols-3 items-center h-20 px-8">
            {/* Left: Logo */}
            <div className="flex items-center">
              <Link to="/portal" className="flex items-center">
                <img 
                  alt="Bridge Agent Portal" 
                  className="h-14 w-auto" 
                  src="/lovable-uploads/20d12fb8-7a61-4b15-bf8f-cdd401ddb12d.png" 
                />
              </Link>
            </div>

            {/* Center: Navigation */}
            <div className="flex items-center justify-center space-x-6">
              {/* Core Items */}
              {coreNavItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || 
                  (item.path !== '/portal' && location.pathname.startsWith(item.path));
                
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      "relative z-10 flex items-center gap-2 text-[15px] font-light transition-all duration-200 hover:scale-105 cursor-pointer",
                      isActive ? "text-foreground" : "text-foreground/70 hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}

              {/* Productivity Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      "relative z-10 flex items-center gap-1.5 text-[15px] font-light transition-all duration-200 hover:scale-105 cursor-pointer",
                      isProductivityActive ? "text-foreground" : "text-foreground/70 hover:text-foreground"
                    )}
                  >
                    <Wrench className="h-4 w-4" />
                    Productivity
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-56 bg-background/95 backdrop-blur-xl border-border">
                  {productivityItems.map(item => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path || 
                      location.pathname.startsWith(item.path);
                    
                    return (
                      <DropdownMenuItem key={item.name} asChild>
                        <Link 
                          to={item.path} 
                          className={cn(
                            "flex items-start gap-3 py-2.5 cursor-pointer",
                            isActive && "bg-accent/20"
                          )}
                        >
                          <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-light">{item.name}</div>
                            <div className="text-xs text-muted-foreground font-light">{item.description}</div>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* AI */}
              <Link
                to="/portal/ai"
                className={cn(
                  "relative z-10 flex items-center gap-2 text-[15px] font-light transition-all duration-200 hover:scale-105 cursor-pointer",
                  location.pathname.startsWith('/portal/ai') ? "text-foreground" : "text-foreground/70 hover:text-foreground"
                )}
              >
                <Sparkles className="h-4 w-4" />
                AI
              </Link>

              {/* Profile */}
              <Link
                to="/portal/profile"
                className={cn(
                  "relative z-10 flex items-center gap-2 text-[15px] font-light transition-all duration-200 hover:scale-105 cursor-pointer",
                  location.pathname.startsWith('/portal/profile') ? "text-foreground" : "text-foreground/70 hover:text-foreground"
                )}
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
            </div>

            {/* Right: User Menu */}
            <div className="flex items-center justify-end gap-2">
              <NotificationCenter />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="font-light text-foreground/80 hover:text-foreground">
                    <Settings className="h-4 w-4 mr-2" />
                    Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-background/95 backdrop-blur-xl border-border">
                  <DropdownMenuItem asChild>
                    <Link to="/portal/profile" className="flex items-center gap-2 cursor-pointer">
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {isAdminOrAgent && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex items-center gap-2 cursor-pointer">
                          <Settings className="h-4 w-4" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Mobile Full-Screen Menu */}
        <div className={cn(
          "lg:hidden fixed inset-0 z-50 transition-all duration-500 ease-out",
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        )}>
          <div className="absolute inset-0 bg-black/90 backdrop-blur-3xl" />
          
          <div className="relative h-full flex flex-col pt-safe">
            {/* Header */}
            <div className="flex items-center justify-between h-16 px-4 mx-3 mt-2 flex-shrink-0">
              <Link to="/portal" className="flex items-center flex-shrink-0" onClick={() => setIsOpen(false)}>
                <img 
                  src="/lovable-uploads/20d12fb8-7a61-4b15-bf8f-cdd401ddb12d.png" 
                  alt="Bridge Agent Portal" 
                  className="h-10 sm:h-11 w-auto" 
                />
              </Link>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-3 -mr-2 text-foreground hover:text-foreground/80 transition-colors touch-manipulation min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full active:bg-white/10" 
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Menu Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-8 mx-3">
              <div className="space-y-1">
                {/* Core Section */}
                <div className="text-xs text-muted-foreground uppercase tracking-wider px-4 mb-2">Core</div>
                {coreNavItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || 
                    (item.path !== '/portal' && location.pathname.startsWith(item.path));
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={cn(
                        "flex items-center gap-4 text-lg font-light transition-all duration-300 py-4 min-h-[56px] active:bg-white/5 rounded-lg px-4 -mx-2",
                        isActive ? "text-foreground bg-white/5" : "text-foreground/70 hover:text-foreground",
                        isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                      )}
                      style={{ transitionDelay: `${index * 50}ms` }}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}

                {/* Productivity Section */}
                <div className="text-xs text-muted-foreground uppercase tracking-wider px-4 mb-2 mt-6">Productivity</div>
                {productivityItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || 
                    location.pathname.startsWith(item.path);
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={cn(
                        "flex items-center gap-4 text-lg font-light transition-all duration-300 py-4 min-h-[56px] active:bg-white/5 rounded-lg px-4 -mx-2",
                        isActive ? "text-foreground bg-white/5" : "text-foreground/70 hover:text-foreground",
                        isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                      )}
                      style={{ transitionDelay: `${(coreNavItems.length + index) * 50}ms` }}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}

                {/* Other Section */}
                <div className="text-xs text-muted-foreground uppercase tracking-wider px-4 mb-2 mt-6">Other</div>
                <Link
                  to="/portal/ai"
                  className={cn(
                    "flex items-center gap-4 text-lg font-light transition-all duration-300 py-4 min-h-[56px] active:bg-white/5 rounded-lg px-4 -mx-2",
                    location.pathname.startsWith('/portal/ai') ? "text-foreground bg-white/5" : "text-foreground/70 hover:text-foreground",
                    isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  )}
                  style={{ transitionDelay: `${(coreNavItems.length + productivityItems.length) * 50}ms` }}
                  onClick={() => setIsOpen(false)}
                >
                  <Sparkles className="h-5 w-5" />
                  AI
                </Link>
                <Link
                  to="/portal/directory"
                  className={cn(
                    "flex items-center gap-4 text-lg font-light transition-all duration-300 py-4 min-h-[56px] active:bg-white/5 rounded-lg px-4 -mx-2",
                    location.pathname.startsWith('/portal/directory') ? "text-foreground bg-white/5" : "text-foreground/70 hover:text-foreground",
                    isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  )}
                  style={{ transitionDelay: `${(coreNavItems.length + productivityItems.length + 1) * 50}ms` }}
                  onClick={() => setIsOpen(false)}
                >
                  <Users className="h-5 w-5" />
                  Directory
                </Link>
                <Link
                  to="/portal/profile"
                  className={cn(
                    "flex items-center gap-4 text-lg font-light transition-all duration-300 py-4 min-h-[56px] active:bg-white/5 rounded-lg px-4 -mx-2",
                    location.pathname.startsWith('/portal/profile') ? "text-foreground bg-white/5" : "text-foreground/70 hover:text-foreground",
                    isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  )}
                  style={{ transitionDelay: `${(coreNavItems.length + productivityItems.length + 2) * 50}ms` }}
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-5 w-5" />
                  Profile
                </Link>

                <div className="pt-6 border-t border-white/10 mt-6">
                  {isAdminOrAgent && (
                    <Link
                      to="/admin"
                      className={cn(
                        "flex items-center gap-4 text-lg font-light transition-all duration-300 py-4 min-h-[56px] active:bg-white/5 rounded-lg px-4 -mx-2 text-foreground/70 hover:text-foreground",
                        isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                      )}
                      style={{ transitionDelay: `${(allNavItems.length) * 50}ms` }}
                      onClick={() => setIsOpen(false)}
                    >
                      <Settings className="h-5 w-5" />
                      Admin Panel
                    </Link>
                  )}
                  
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleSignOut();
                    }}
                    className={cn(
                      "w-full flex items-center gap-4 text-lg font-light transition-all duration-300 py-4 min-h-[56px] active:bg-white/5 rounded-lg px-4 -mx-2 text-destructive",
                      isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                    )}
                    style={{ transitionDelay: `${(allNavItems.length + 1) * 50}ms` }}
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
