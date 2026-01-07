import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Wrench, 
  LogOut, 
  Sparkles, 
  Briefcase, 
  User, 
  Building2, 
  StickyNote, 
  ListTodo, 
  Mail, 
  Users,
  FolderOpen,
  ChevronDown,
  Calendar,
  Settings,
  Shield,
  Search,
  ClipboardList,
  FileText,
  Table,
  Moon,
  Sun,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useIsAdminOrAgent } from "@/hooks/useUserRole";
import { NotificationCenter } from "./NotificationCenter";
import { useUserProfile } from "@/hooks/useGoogleServices";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";

// Google items - All open externally (expanded list for grid)
const googleItems = [
  { name: "Gmail", path: "https://mail.google.com", icon: Mail },
  { name: "Calendar", path: "https://calendar.google.com", icon: Calendar },
  { name: "Drive", path: "https://drive.google.com", icon: FolderOpen },
  { name: "Docs", path: "https://docs.google.com", icon: FileText },
  { name: "Sheets", path: "https://sheets.google.com", icon: Table },
  { name: "Contacts", path: "https://contacts.google.com", icon: Users },
];

// Essentials items with descriptions
const essentialsItems = [
  { name: "CRM", path: "/portal/crm", icon: Briefcase, description: "Pipeline management and deal tracking" },
  { name: "Contacts", path: "/portal/contacts", icon: Users, description: "Client and prospect database" },
  { name: "Deal Room", path: "/portal/deal-room", icon: Building2, description: "Active listings and proposals" },
  { name: "Intake", path: "/portal/intake", icon: ClipboardList, description: "New business opportunities" },
  { name: "Tasks", path: "/portal/tasks", icon: ListTodo, description: "Personal task management" },
  { name: "Notes", path: "/portal/notes", icon: StickyNote, description: "Quick notes and documentation" },
];

// Helper to format "Member since" date
const formatMemberSince = (dateString: string | undefined) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `Member since ${month} ${year}`;
};

interface PortalNavigationProps {
  onSearchClick?: () => void;
}

export const PortalNavigation = ({ onSearchClick }: PortalNavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdminOrAgent, role } = useIsAdminOrAgent();
  const { data: userProfile } = useUserProfile();
  const { signOut, hardLogout } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error("Sign out failed, using hard logout:", error);
      // If signOut fails for any reason, force hard logout
      hardLogout();
    }
  };

  const isToolsActive = location.pathname.startsWith('/portal/tools') ||
    location.pathname.startsWith('/portal/generators') ||
    location.pathname.startsWith('/portal/templates') ||
    location.pathname.startsWith('/portal/calculators') ||
    location.pathname.startsWith('/portal/resources') ||
    location.pathname.startsWith('/portal/requests');

  const isCompanyActive = location.pathname.startsWith('/portal/company') ||
    location.pathname === '/portal/directory' ||
    location.pathname === '/portal/announcements';

  const isGoogleActive = googleItems.some(item => 
    location.pathname === item.path || location.pathname.startsWith(item.path + '/')
  );

  const isEssentialsActive = essentialsItems.some(item => 
    location.pathname === item.path || location.pathname.startsWith(item.path + '/')
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
              className="p-3 -mr-2 text-white hover:text-white/80 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center" 
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
            <div className="flex items-center justify-center space-x-5">
              {/* Dashboard */}
              <Link
                to="/portal"
                className={cn(
                  "relative z-10 flex items-center gap-2 text-[15px] font-light transition-all duration-200 hover:scale-105 cursor-pointer",
                  location.pathname === '/portal' ? "text-white" : "text-white/70 hover:text-white"
                )}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>

              {/* Essentials Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={cn(
                    "flex items-center gap-1.5 text-[15px] font-light transition-all duration-200 hover:scale-105",
                    isEssentialsActive ? "text-white" : "text-white/70 hover:text-white"
                  )}>
                    <Briefcase className="h-4 w-4" />
                    Essentials
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-64 p-1.5 dropdown-premium border-0" sideOffset={12}>
                  {essentialsItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                    return (
                      <Link 
                        key={item.name}
                        to={item.path} 
                        className={cn(
                          "dropdown-premium-item group cursor-pointer",
                          isActive && "bg-white/10"
                        )}
                      >
                        <div className="h-7 w-7 rounded-md bg-white/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-4 w-4 text-white/80" />
                        </div>
                        <div className="min-w-0 flex-1 space-y-0">
                          <p className="text-[13px] font-medium text-white leading-none m-0">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-white/50 leading-none m-0 mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Tools */}
              <Link
                to="/portal/tools"
                className={cn(
                  "relative z-10 flex items-center gap-2 text-[15px] font-light transition-all duration-200 hover:scale-105 cursor-pointer",
                  isToolsActive ? "text-white" : "text-white/70 hover:text-white"
                )}
              >
                <Wrench className="h-4 w-4" />
                Tools
              </Link>

              {/* Company */}
              <Link
                to="/portal/company"
                className={cn(
                  "relative z-10 flex items-center gap-2 text-[15px] font-light transition-all duration-200 hover:scale-105 cursor-pointer",
                  isCompanyActive ? "text-white" : "text-white/70 hover:text-white"
                )}
              >
                <Building2 className="h-4 w-4" />
                Company
              </Link>

              {/* AI */}
              <Link
                to="/portal/ai"
                className={cn(
                  "relative z-10 flex items-center gap-2 text-[15px] font-light transition-all duration-200 hover:scale-105 cursor-pointer",
                  location.pathname.startsWith('/portal/ai') ? "text-white" : "text-white/70 hover:text-white"
                )}
              >
                <Sparkles className="h-4 w-4" />
                AI
              </Link>
            </div>

            {/* Right: Search & User Menu */}
            <div className="flex items-center justify-end gap-2">
              <button 
                onClick={onSearchClick}
                className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                title="Search (⌘K)"
              >
                <Search className="h-5 w-5" />
              </button>
              
              {/* Google Apps Launcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                    <img 
                      src="/google-brandmark.png" 
                      alt="Google Apps" 
                      className="h-6 w-6"
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[220px] p-3 bg-background/95 backdrop-blur-xl border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 px-1">Google Apps</p>
                  <div className="grid grid-cols-3 gap-2">
                    {googleItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <a
                          key={item.name}
                          href={item.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
                        >
                          <Icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                          <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors">{item.name}</span>
                        </a>
                      );
                    })}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <NotificationCenter />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="font-light text-white/80 hover:text-white hover:bg-white/10 gap-2">
                    {userProfile?.avatarUrl ? (
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={userProfile.avatarUrl} alt={userProfile.fullName || 'User'} />
                        <AvatarFallback className="text-xs">
                          {userProfile.fullName?.charAt(0) || userProfile.email?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                    <span className="hidden xl:inline">{userProfile?.fullName?.split(' ')[0] || 'Account'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 dropdown-premium border-0" sideOffset={8}>
                  {/* User Header Section */}
                  {userProfile && (
                    <div className="px-4 py-3 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 ring-1 ring-white/10 flex-shrink-0">
                          <AvatarImage src={userProfile.avatarUrl} alt={userProfile.fullName || 'User'} />
                          <AvatarFallback className="bg-white/10 text-white text-xs">
                            {userProfile.fullName?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-medium text-white truncate leading-none m-0">
                            {userProfile.fullName}
                          </p>
                          <p className="text-[11px] text-white/50 truncate leading-none m-0 mt-1">
                            {userProfile.email}
                          </p>
                          {userProfile.createdAt && (
                            <p className="text-[10px] text-white/40 leading-none m-0 mt-1">
                              {formatMemberSince(userProfile.createdAt)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Menu Items */}
                  <div className="p-2">
                    <Link 
                      to="/portal/profile"
                      className="dropdown-premium-item cursor-pointer"
                    >
                      <User className="h-4 w-4 text-white/70 flex-shrink-0" />
                      <span className="text-[13px] text-white">Profile</span>
                    </Link>
                    
                    <Link 
                      to="/portal/settings/google"
                      className="dropdown-premium-item cursor-pointer"
                    >
                      <Settings className="h-4 w-4 text-white/70 flex-shrink-0" />
                      <span className="text-[13px] text-white">Google Services</span>
                    </Link>
                    
                    <button 
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      className="dropdown-premium-item cursor-pointer w-full text-left"
                    >
                      {theme === "dark" ? (
                        <Sun className="h-4 w-4 text-white/70 flex-shrink-0" />
                      ) : (
                        <Moon className="h-4 w-4 text-white/70 flex-shrink-0" />
                      )}
                      <span className="text-[13px] text-white">
                        {theme === "dark" ? "Light Mode" : "Dark Mode"}
                      </span>
                    </button>
                    
                    <Link 
                      to="/portal/support"
                      className="dropdown-premium-item cursor-pointer"
                    >
                      <HelpCircle className="h-4 w-4 text-white/70 flex-shrink-0" />
                      <span className="text-[13px] text-white">Help & Support</span>
                    </Link>
                    
                    {role === 'admin' && (
                      <Link 
                        to="/admin"
                        className="dropdown-premium-item cursor-pointer"
                      >
                        <Shield className="h-4 w-4 text-white/70 flex-shrink-0" />
                        <span className="text-[13px] text-white">Admin Portal</span>
                      </Link>
                    )}
                    
                    <div className="h-px bg-white/10 my-2" />
                    
                    <button 
                      onClick={handleSignOut}
                      className="dropdown-premium-item cursor-pointer w-full text-left"
                    >
                      <LogOut className="h-4 w-4 text-red-400 flex-shrink-0" />
                      <span className="text-[13px] text-red-400">Sign Out</span>
                    </button>
                  </div>
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
                {/* Dashboard */}
                <Link
                  to="/portal"
                  className={cn(
                    "flex items-center gap-4 text-lg font-light transition-all duration-300 py-4 min-h-[56px] active:bg-white/5 rounded-lg px-4 -mx-2",
                    location.pathname === '/portal' ? "text-foreground bg-white/5" : "text-foreground/70 hover:text-foreground",
                    isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  )}
                  style={{ transitionDelay: '0ms' }}
                  onClick={() => setIsOpen(false)}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard
                </Link>

                {/* Google Section - Touch-friendly Grid */}
                <div className="text-xs text-muted-foreground uppercase tracking-wider px-4 mb-3 mt-6">Google Apps</div>
                <div className="grid grid-cols-3 gap-2 px-2 -mx-2">
                  {googleItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.name}
                        href={item.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "flex flex-col items-center justify-center gap-2 py-4 min-h-[72px] rounded-xl active:bg-white/10 transition-all duration-300",
                          "text-foreground/70 hover:text-foreground",
                          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                        )}
                        style={{ transitionDelay: `${(index + 1) * 50}ms` }}
                        onClick={() => setIsOpen(false)}
                      >
                        <Icon className="h-6 w-6" />
                        <span className="text-xs">{item.name}</span>
                      </a>
                    );
                  })}
                </div>

                {/* Essentials Section */}
                <div className="text-xs text-muted-foreground uppercase tracking-wider px-4 mb-2 mt-6">Essentials</div>
                {essentialsItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={cn(
                        "flex items-center gap-4 text-lg font-light transition-all duration-300 py-4 min-h-[56px] active:bg-white/5 rounded-lg px-4 -mx-2",
                        isActive ? "text-foreground bg-white/5" : "text-foreground/70 hover:text-foreground",
                        isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                      )}
                      style={{ transitionDelay: `${(index + 4) * 50}ms` }}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}

                {/* Explore Section */}
                <div className="text-xs text-muted-foreground uppercase tracking-wider px-4 mb-2 mt-6">Explore</div>
                <Link
                  to="/portal/tools"
                  className={cn(
                    "flex items-center gap-4 text-lg font-light transition-all duration-300 py-4 min-h-[56px] active:bg-white/5 rounded-lg px-4 -mx-2",
                    isToolsActive ? "text-foreground bg-white/5" : "text-foreground/70 hover:text-foreground",
                    isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  )}
                  style={{ transitionDelay: '350ms' }}
                  onClick={() => setIsOpen(false)}
                >
                  <Wrench className="h-5 w-5" />
                  Tools
                </Link>
                <Link
                  to="/portal/company"
                  className={cn(
                    "flex items-center gap-4 text-lg font-light transition-all duration-300 py-4 min-h-[56px] active:bg-white/5 rounded-lg px-4 -mx-2",
                    isCompanyActive ? "text-foreground bg-white/5" : "text-foreground/70 hover:text-foreground",
                    isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  )}
                  style={{ transitionDelay: '400ms' }}
                  onClick={() => setIsOpen(false)}
                >
                  <Building2 className="h-5 w-5" />
                  Company
                </Link>
                <Link
                  to="/portal/ai"
                  className={cn(
                    "flex items-center gap-4 text-lg font-light transition-all duration-300 py-4 min-h-[56px] active:bg-white/5 rounded-lg px-4 -mx-2",
                    location.pathname.startsWith('/portal/ai') ? "text-foreground bg-white/5" : "text-foreground/70 hover:text-foreground",
                    isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  )}
                  style={{ transitionDelay: '450ms' }}
                  onClick={() => setIsOpen(false)}
                >
                  <Sparkles className="h-5 w-5" />
                  AI
                </Link>

                {/* Account Section */}
                <div className="text-xs text-muted-foreground uppercase tracking-wider px-4 mb-2 mt-6">Account</div>
                <Link
                  to="/portal/profile"
                  className={cn(
                    "flex items-center gap-4 text-lg font-light transition-all duration-300 py-4 min-h-[56px] active:bg-white/5 rounded-lg px-4 -mx-2",
                    location.pathname.startsWith('/portal/profile') ? "text-foreground bg-white/5" : "text-foreground/70 hover:text-foreground",
                    isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  )}
                  style={{ transitionDelay: '500ms' }}
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-5 w-5" />
                  Profile
                </Link>
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className={cn(
                    "flex items-center gap-4 text-lg font-light transition-all duration-300 py-4 min-h-[56px] active:bg-white/5 rounded-lg px-4 -mx-2 w-full text-left",
                    "text-foreground/70 hover:text-foreground",
                    isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  )}
                  style={{ transitionDelay: '525ms' }}
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </button>
                {role === 'admin' && (
                  <Link
                    to="/admin"
                    className={cn(
                      "flex items-center gap-4 text-lg font-light transition-all duration-300 py-4 min-h-[56px] active:bg-white/5 rounded-lg px-4 -mx-2",
                      location.pathname.startsWith('/admin') ? "text-foreground bg-white/5" : "text-foreground/70 hover:text-foreground",
                      isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                    )}
                    style={{ transitionDelay: '550ms' }}
                    onClick={() => setIsOpen(false)}
                  >
                    <Shield className="h-5 w-5" />
                    Admin Portal
                  </Link>
                )}
              </div>
            </div>
            
            {/* Footer */}
            <div className="flex-shrink-0 p-4 mx-3 mb-safe">
              <button 
                onClick={() => {
                  handleSignOut();
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-center gap-3 text-lg font-light py-4 min-h-[56px] rounded-xl border border-white/10 text-foreground/70 hover:text-foreground hover:bg-white/5 transition-all duration-300",
                  isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                )}
                style={{ transitionDelay: '600ms' }}
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
