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
  ClipboardList
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

// Google items - Mail opens Gmail externally
const googleItems = [
  { name: "Mail", path: "https://mail.google.com", icon: Mail, external: true },
  { name: "Calendar", path: "/portal/calendar", icon: Calendar, external: false },
  { name: "Drive", path: "/portal/drive", icon: FolderOpen, external: false },
];

// Essentials items
const essentialsItems = [
  { name: "CRM", path: "/portal/crm", icon: Briefcase },
  { name: "Contacts", path: "/portal/contacts", icon: Users },
  { name: "Intake", path: "/portal/intake", icon: ClipboardList },
  { name: "Tasks", path: "/portal/tasks", icon: ListTodo },
  { name: "Notes", path: "/portal/notes", icon: StickyNote },
];

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
            <div className="flex items-center justify-center space-x-5">
              {/* Dashboard */}
              <Link
                to="/portal"
                className={cn(
                  "relative z-10 flex items-center gap-2 text-[15px] font-light transition-all duration-200 hover:scale-105 cursor-pointer",
                  location.pathname === '/portal' ? "text-foreground" : "text-foreground/70 hover:text-foreground"
                )}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>

              {/* Google Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={cn(
                    "flex items-center gap-1.5 text-[15px] font-light transition-all duration-200 hover:scale-105",
                    isGoogleActive ? "text-foreground" : "text-foreground/70 hover:text-foreground"
                  )}>
                    <Mail className="h-4 w-4" />
                    Google
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-44 bg-background/95 backdrop-blur-xl border-border">
                  {googleItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = !item.external && (location.pathname === item.path || location.pathname.startsWith(item.path + '/'));
                    
                    if (item.external) {
                      return (
                        <DropdownMenuItem key={item.name} asChild>
                          <a 
                            href={item.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Icon className="h-4 w-4" />
                            {item.name}
                          </a>
                        </DropdownMenuItem>
                      );
                    }
                    
                    return (
                      <DropdownMenuItem key={item.name} asChild>
                        <Link 
                          to={item.path} 
                          className={cn(
                            "flex items-center gap-2 cursor-pointer",
                            isActive && "bg-accent"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {item.name}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Essentials Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={cn(
                    "flex items-center gap-1.5 text-[15px] font-light transition-all duration-200 hover:scale-105",
                    isEssentialsActive ? "text-foreground" : "text-foreground/70 hover:text-foreground"
                  )}>
                    <Briefcase className="h-4 w-4" />
                    Essentials
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-44 bg-background/95 backdrop-blur-xl border-border">
                  {essentialsItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                    return (
                      <DropdownMenuItem key={item.name} asChild>
                        <Link 
                          to={item.path} 
                          className={cn(
                            "flex items-center gap-2 cursor-pointer",
                            isActive && "bg-accent"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {item.name}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Tools */}
              <Link
                to="/portal/tools"
                className={cn(
                  "relative z-10 flex items-center gap-2 text-[15px] font-light transition-all duration-200 hover:scale-105 cursor-pointer",
                  isToolsActive ? "text-foreground" : "text-foreground/70 hover:text-foreground"
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
                  isCompanyActive ? "text-foreground" : "text-foreground/70 hover:text-foreground"
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
                  location.pathname.startsWith('/portal/ai') ? "text-foreground" : "text-foreground/70 hover:text-foreground"
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
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                <Search className="h-4 w-4" />
                <span className="hidden xl:inline">Search...</span>
                <kbd className="hidden xl:inline ml-1 px-1.5 py-0.5 rounded text-xs bg-background border border-border">⌘K</kbd>
              </button>
              <NotificationCenter />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="font-light text-foreground/80 hover:text-foreground gap-2">
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
                <DropdownMenuContent align="end" className="w-48 bg-background/95 backdrop-blur-xl border-border">
                  {userProfile && (
                    <div className="px-2 py-1.5 text-sm">
                      <p className="font-medium truncate">{userProfile.fullName}</p>
                      <p className="text-xs text-muted-foreground truncate">{userProfile.email}</p>
                    </div>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/portal/profile" className="flex items-center gap-2 cursor-pointer">
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/portal/settings/google" className="flex items-center gap-2 cursor-pointer">
                      <Settings className="h-4 w-4" />
                      Google Services
                    </Link>
                  </DropdownMenuItem>
                  {role === 'admin' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex items-center gap-2 cursor-pointer">
                          <Shield className="h-4 w-4" />
                          Admin Portal
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

                {/* Google Section */}
                <div className="text-xs text-muted-foreground uppercase tracking-wider px-4 mb-2 mt-6">Google</div>
                {googleItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = !item.external && (location.pathname === item.path || location.pathname.startsWith(item.path + '/'));
                  
                  if (item.external) {
                    return (
                      <a
                        key={item.name}
                        href={item.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "flex items-center gap-4 text-lg font-light transition-all duration-300 py-4 min-h-[56px] active:bg-white/5 rounded-lg px-4 -mx-2",
                          "text-foreground/70 hover:text-foreground",
                          isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                        )}
                        style={{ transitionDelay: `${(index + 1) * 50}ms` }}
                        onClick={() => setIsOpen(false)}
                      >
                        <Icon className="h-5 w-5" />
                        {item.name}
                      </a>
                    );
                  }
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={cn(
                        "flex items-center gap-4 text-lg font-light transition-all duration-300 py-4 min-h-[56px] active:bg-white/5 rounded-lg px-4 -mx-2",
                        isActive ? "text-foreground bg-white/5" : "text-foreground/70 hover:text-foreground",
                        isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                      )}
                      style={{ transitionDelay: `${(index + 1) * 50}ms` }}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}

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
