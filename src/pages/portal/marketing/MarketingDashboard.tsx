import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Megaphone, 
  Plus, 
  Image, 
  Mail, 
  FileText, 
  Presentation,
  ArrowRight,
  Sparkles
} from "lucide-react";

const quickActions = [
  { 
    name: "Social Media", 
    description: "Instagram, Facebook, LinkedIn posts", 
    icon: Image, 
    color: "bg-pink-500/20 text-pink-400",
    path: "/portal/marketing/create?type=social-post" 
  },
  { 
    name: "Email Campaign", 
    description: "Newsletters and blasts", 
    icon: Mail, 
    color: "bg-violet-500/20 text-violet-400",
    path: "/portal/marketing/create?type=email" 
  },
  { 
    name: "Flyers & Print", 
    description: "Property flyers, postcards", 
    icon: FileText, 
    color: "bg-indigo-500/20 text-indigo-400",
    path: "/portal/marketing/create?type=flyer" 
  },
  { 
    name: "Presentations", 
    description: "Pitch decks and proposals", 
    icon: Presentation, 
    color: "bg-cyan-500/20 text-cyan-400",
    path: "/portal/marketing/create?type=presentation" 
  },
];

const MarketingDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500/20 via-violet-500/10 to-indigo-500/20 p-8 md:p-12">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-pink-500/20">
              <Megaphone className="h-6 w-6 text-pink-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extralight text-foreground">
              Marketing Center
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-xl mb-6">
            Create stunning marketing materials with AI-powered templates. 
            Design social posts, emails, flyers, and presentations in minutes.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link to="/portal/marketing/create">
                <Plus className="h-4 w-4" />
                Create a Design
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link to="/portal/marketing/media">
                <Image className="h-4 w-4" />
                Browse Templates
              </Link>
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-500/10 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="text-xl font-light text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.name} to={action.path}>
                <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer group">
                  <CardContent className="p-5">
                    <div className={`w-10 h-10 rounded-xl ${action.color.split(' ')[0]} flex items-center justify-center mb-3`}>
                      <Icon className={`h-5 w-5 ${action.color.split(' ')[1]}`} />
                    </div>
                    <h3 className="font-medium text-foreground mb-1">{action.name}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent Projects Placeholder */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-light text-foreground">Recent Projects</h2>
          <Button asChild variant="ghost" size="sm" className="gap-1">
            <Link to="/portal/marketing/projects">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-4 max-w-sm">
              Create your first marketing design using our templates and AI-powered tools.
            </p>
            <Button asChild>
              <Link to="/portal/marketing/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Design
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default MarketingDashboard;
