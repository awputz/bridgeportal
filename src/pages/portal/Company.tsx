import { Link } from "react-router-dom";
import { 
  Building2, 
  Target, 
  Heart, 
  Users, 
  Globe, 
  Headphones, 
  Bell,
  ChevronRight
} from "lucide-react";

const companyItems = [
  { 
    name: "About Us", 
    path: "/portal/company/about", 
    icon: Building2, 
    description: "Our story, divisions, and headquarters",
    color: "bg-blue-500/20 text-blue-400"
  },
  { 
    name: "Mission & Vision", 
    path: "/portal/company/mission", 
    icon: Target, 
    description: "Our guiding principles and purpose",
    color: "bg-emerald-500/20 text-emerald-400"
  },
  { 
    name: "Culture & Values", 
    path: "/portal/company/culture", 
    icon: Heart, 
    description: "What we believe and how we work",
    color: "bg-rose-500/20 text-rose-400"
  },
  { 
    name: "Expectations", 
    path: "/portal/company/expectations", 
    icon: Users, 
    description: "Agent standards and professional guidelines",
    color: "bg-amber-500/20 text-amber-400"
  },
  { 
    name: "Expansion", 
    path: "/portal/company/expansion", 
    icon: Globe, 
    description: "Future markets and growth opportunities",
    color: "bg-purple-500/20 text-purple-400"
  },
  { 
    name: "Contact", 
    path: "/portal/company/contact", 
    icon: Headphones, 
    description: "Get support and department contacts",
    color: "bg-cyan-500/20 text-cyan-400"
  },
  { 
    name: "Directory", 
    path: "/portal/directory", 
    icon: Users, 
    description: "Find and connect with colleagues",
    color: "bg-indigo-500/20 text-indigo-400"
  },
  { 
    name: "Announcements", 
    path: "/portal/announcements", 
    icon: Bell, 
    description: "Company news and updates",
    color: "bg-orange-500/20 text-orange-400"
  },
];

const Company = () => {
  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground font-light">Company</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground mb-4">
            Bridge Advisory Group
          </h1>
          <p className="text-muted-foreground font-light max-w-2xl mx-auto">
            Everything you need to know about our company, culture, and team.
          </p>
        </div>

        {/* Company Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-grid">
          {companyItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="glass-card p-5 group hover:border-white/20"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-full ${item.color.split(' ')[0]} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className={`h-6 w-6 ${item.color.split(' ')[1]}`} />
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground group-hover:translate-x-1 transition-all duration-300" />
                </div>
                
                <h3 className="text-lg font-light text-foreground mb-2">
                  {item.name}
                </h3>
                
                <p className="text-sm text-muted-foreground font-light">
                  {item.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Company;
