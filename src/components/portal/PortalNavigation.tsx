import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LayoutDashboard, FileText, Wrench, LogOut, Settings, Users, Sparkles, Calculator, Briefcase, Wand2, User, Trophy } from "lucide-react";
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

const navItems = [
  { name: "Dashboard", path: "/portal", icon: LayoutDashboard },
  { name: "CRM", path: "/portal/crm", icon: Briefcase },
  { name: "Leaderboard", path: "/portal/leaderboard", icon: Trophy },
  { name: "Generators", path: "/portal/generators", icon: Wand2 },
  { name: "Templates", path: "/portal/templates", icon: FileText },
  { name: "Calculators", path: "/portal/calculators", icon: Calculator },
  { name: "AI", path: "/portal/ai", icon: Sparkles },
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
            <div className="flex items-center justify-center space-x-8">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || 
                  (item.path !== '/portal' && location.pathname.startsWith(item.path));
                
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-2 text-[15px] font-light transition-all duration-200 hover:scale-105",
                      isActive ? "text-foreground" : "text-foreground/70 hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Right: User Menu */}
            <div className="flex items-center justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="font-light text-foreground/80 hover:text-foreground">
                    <Settings className="h-4 w-4 mr-2" />
                    Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 glass-nav">
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
              <div className="space-y-2">
                {navItems.map((item, index) => {
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

                <div className="pt-6 border-t border-white/10 mt-6">
                  {isAdminOrAgent && (
                    <Link
                      to="/admin"
                      className={cn(
                        "flex items-center gap-4 text-lg font-light transition-all duration-300 py-4 min-h-[56px] active:bg-white/5 rounded-lg px-4 -mx-2 text-foreground/70 hover:text-foreground",
                        isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                      )}
                      style={{ transitionDelay: `${navItems.length * 50}ms` }}
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
                    style={{ transitionDelay: `${(navItems.length + 1) * 50}ms` }}
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
