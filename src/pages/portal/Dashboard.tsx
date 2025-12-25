import { Link } from "react-router-dom";
import { 
  Mail, 
  Users, 
  Calendar, 
  HardDrive, 
  MessageSquare, 
  Search,
  ArrowRight,
  TrendingUp,
  Building2,
  Home
} from "lucide-react";
import { QuickActionCard } from "@/components/portal/QuickActionCard";
import { useExternalTools } from "@/hooks/useExternalTools";
import { Skeleton } from "@/components/ui/skeleton";

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
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const Dashboard = () => {
  const { data: tools, isLoading } = useExternalTools();

  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-10 md:mb-14">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground mb-2">
            {getGreeting()}
          </h1>
          <p className="text-muted-foreground font-light">
            Welcome to the Bridge Agent Portal
          </p>
        </div>

        {/* Quick Actions */}
        <section className="mb-12 md:mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg md:text-xl font-light text-foreground">
              Quick Actions
            </h2>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-[140px] md:h-[160px] rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {tools?.map((tool) => {
                const Icon = iconMap[tool.icon] || Mail;
                return (
                  <QuickActionCard
                    key={tool.id}
                    name={tool.name}
                    description={tool.description || undefined}
                    icon={Icon}
                    url={tool.url}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* Templates Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg md:text-xl font-light text-foreground">
              Templates
            </h2>
            <Link 
              to="/portal/templates" 
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors font-light"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              to="/portal/templates/investment-sales"
              className="glass-card p-6 flex items-center gap-4 hover:border-white/20 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-foreground/60" />
              </div>
              <div>
                <h3 className="text-base font-light text-foreground">Investment Sales</h3>
                <p className="text-xs text-muted-foreground font-light">LOIs, exclusives, setup sheets</p>
              </div>
            </Link>
            
            <Link 
              to="/portal/templates/commercial-leasing"
              className="glass-card p-6 flex items-center gap-4 hover:border-white/20 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-foreground/60" />
              </div>
              <div>
                <h3 className="text-base font-light text-foreground">Commercial Leasing</h3>
                <p className="text-xs text-muted-foreground font-light">Tenant & landlord documents</p>
              </div>
            </Link>
            
            <Link 
              to="/portal/templates/residential"
              className="glass-card p-6 flex items-center gap-4 hover:border-white/20 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                <Home className="h-6 w-6 text-foreground/60" />
              </div>
              <div>
                <h3 className="text-base font-light text-foreground">Residential</h3>
                <p className="text-xs text-muted-foreground font-light">Rental & sales templates</p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
