import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { 
  Megaphone, 
  Plus, 
  Image as ImageIcon, 
  Mail, 
  FileText, 
  Presentation,
  ArrowRight,
  Sparkles,
  Clock,
  Star,
  TrendingUp,
  MousePointerClick,
  BarChart3,
  Home,
  FolderKanban,
  User,
  Calendar,
  History
} from "lucide-react";
import { useRecentProjects, useProjectStats } from "@/hooks/marketing/useMarketingProjects";
import { useFeaturedTemplates, useMarketingTemplates } from "@/hooks/marketing/useMarketingTemplates";
import { useMarketingPerformance } from "@/hooks/marketing/useMarketingAnalytics";
import { useCRMDeals } from "@/hooks/useCRM";
import { formatDistanceToNow } from "date-fns";

const quickActions = [
  { 
    name: "AI Generators", 
    description: "Create content with AI instantly", 
    icon: Sparkles, 
    color: "bg-gradient-to-br from-purple-500 to-pink-500",
    path: "/portal/marketing/generators",
    featured: true,
  },
  { 
    name: "AI Staging", 
    description: "Virtual property staging", 
    icon: Home, 
    color: "bg-gradient-to-br from-teal-500 to-cyan-500",
    path: "/portal/marketing/staging",
    featured: true,
  },
  { 
    name: "Social Media", 
    description: "Instagram, Facebook, LinkedIn posts", 
    icon: ImageIcon, 
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

const getTypeIcon = (type: string) => {
  switch (type) {
    case "social-post":
      return ImageIcon;
    case "email":
      return Mail;
    case "flyer":
      return FileText;
    case "presentation":
      return Presentation;
    default:
      return FileText;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-500/20 text-green-400";
    case "published":
      return "bg-blue-500/20 text-blue-400";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const MarketingDashboard = () => {
  const { data: recentProjects, isLoading: projectsLoading } = useRecentProjects(6);
  const { data: stats, isLoading: statsLoading } = useProjectStats();
  const { data: featuredTemplates, isLoading: templatesLoading } = useFeaturedTemplates();
  const { data: allTemplates } = useMarketingTemplates();
  const { data: performance, isLoading: performanceLoading } = useMarketingPerformance();
  const { data: recentDeals } = useCRMDeals();

  // Get the 4 most recent deals with property addresses
  const recentProperties = (recentDeals || [])
    .filter(deal => deal.property_address)
    .slice(0, 4);

  return (
    <MarketingLayout showBackButton={false}>
      <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500/20 via-violet-500/10 to-indigo-500/20 p-8 md:p-12">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-pink-500/20">
              <Megaphone className="h-6 w-6 text-pink-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-foreground">
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
                <ImageIcon className="h-4 w-4" />
                Browse Templates
              </Link>
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-500/10 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Performance Analytics */}
      {!performanceLoading && performance && (
        <section>
          <h2 className="text-xl font-light text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Your Marketing Performance
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-semibold text-foreground">{performance.totalProjects}</p>
                <p className="text-xs text-muted-foreground">Projects</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-semibold text-foreground">{performance.emailsSent}</p>
                <p className="text-xs text-muted-foreground">Emails Sent</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-1">
                  <p className="text-2xl font-semibold text-foreground">{performance.openRate}%</p>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <p className="text-xs text-muted-foreground">Open Rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-semibold text-foreground">{performance.socialPosts}</p>
                <p className="text-xs text-muted-foreground">Social Posts</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-semibold text-foreground">{performance.flyersGenerated}</p>
                <p className="text-xs text-muted-foreground">Flyers</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-semibold text-foreground">{performance.presentationsCreated}</p>
                <p className="text-xs text-muted-foreground">Presentations</p>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Stats Overview */}
      {!statsLoading && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-semibold text-foreground">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Projects</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-semibold text-foreground">{stats.draft}</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-semibold text-foreground">{stats.completed}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-semibold text-foreground">{stats.published}</p>
              <p className="text-sm text-muted-foreground">Published</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <section>
        <h2 className="text-xl font-light text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            const isFeatured = 'featured' in action && action.featured;
            
            return (
              <Link key={action.name} to={action.path}>
                <Card className={`h-full transition-all cursor-pointer group ${
                  isFeatured 
                    ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30 hover:border-purple-400/50" 
                    : "hover:bg-muted/50"
                }`}>
                  <CardContent className="p-6">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                      isFeatured 
                        ? "bg-gradient-to-br from-purple-500 to-pink-500" 
                        : action.color.split(' ')[0]
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        isFeatured 
                          ? "text-white" 
                          : action.color.split(' ')[1]
                      }`} />
                    </div>
                    <h3 className="font-medium text-foreground mb-1">{action.name}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                    {isFeatured && (
                      <div className="mt-3 flex items-center text-xs text-purple-400 font-medium group-hover:text-purple-300">
                        Get Started
                        <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Navigate To Section */}
      <section>
        <h2 className="text-xl font-light text-foreground mb-4">Navigate To</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: "My Projects", path: "/portal/marketing/projects", icon: FolderKanban, color: "bg-violet-500/20 text-violet-400" },
            { name: "Media Library", path: "/portal/marketing/media", icon: ImageIcon, color: "bg-indigo-500/20 text-indigo-400" },
            { name: "Asset Library", path: "/portal/marketing/assets", icon: ImageIcon, color: "bg-cyan-500/20 text-cyan-400" },
            { name: "Brand Profile", path: "/portal/marketing/brand", icon: User, color: "bg-emerald-500/20 text-emerald-400" },
            { name: "Social Schedule", path: "/portal/marketing/social-schedule", icon: Calendar, color: "bg-orange-500/20 text-orange-400" },
            { name: "AI History", path: "/portal/marketing/history", icon: History, color: "bg-slate-500/20 text-slate-400" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.name} to={item.path}>
                <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.color.split(' ')[0]}`}>
                      <Icon className={`h-4 w-4 ${item.color.split(' ')[1]}`} />
                    </div>
                    <span className="text-sm font-medium text-foreground">{item.name}</span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Quick Create from Properties */}
      {recentProperties.length > 0 && (
        <section>
          <h2 className="text-xl font-light text-foreground mb-4 flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" />
            Create Marketing for Recent Properties
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentProperties.map((deal) => (
              <Card key={deal.id} className="hover:bg-muted/50 transition-colors">
                <CardContent className="p-4">
                  <p className="font-medium text-foreground truncate mb-1">
                    {deal.property_address}
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">
                    {deal.value ? `$${deal.value.toLocaleString()}` : ""}
                    {deal.deal_type && ` • ${deal.deal_type}`}
                  </p>
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline" className="flex-1">
                      <Link to={`/portal/marketing/create?type=social-post&property=${encodeURIComponent(deal.property_address)}`}>
                        <ImageIcon className="h-3 w-3 mr-1" />
                        Social
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="outline" className="flex-1">
                      <Link to={`/portal/marketing/create?type=flyer&property=${encodeURIComponent(deal.property_address)}`}>
                        <FileText className="h-3 w-3 mr-1" />
                        Flyer
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Featured Templates */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-light text-foreground flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Featured Templates
          </h2>
          <Button asChild variant="ghost" size="sm" className="gap-1">
            <Link to="/portal/marketing/media">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        {templatesLoading ? (
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="w-[250px] h-[180px] flex-shrink-0 rounded-xl" />
            ))}
          </div>
        ) : featuredTemplates && featuredTemplates.length > 0 ? (
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-4 pb-4">
              {featuredTemplates.map((template) => (
                <Link 
                  key={template.id} 
                  to={`/portal/marketing/create?template=${template.id}`}
                  className="flex-shrink-0"
                >
                  <Card className="w-[250px] hover:bg-muted/50 transition-colors cursor-pointer overflow-hidden">
                    <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      {template.thumbnail_url ? (
                        <img 
                          src={template.thumbnail_url} 
                          alt={template.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Sparkles className="h-10 w-10 text-primary/50" />
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-foreground truncate">{template.name}</h3>
                        {template.is_premium && (
                          <Badge variant="secondary" className="text-xs">Pro</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground capitalize">{template.category}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground">No featured templates yet.</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Recent Projects */}
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
        
        {projectsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[140px] rounded-xl" />
            ))}
          </div>
        ) : recentProjects && recentProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentProjects.map((project) => {
              const Icon = getTypeIcon(project.type);
              return (
                <Link key={project.id} to={`/portal/marketing/edit/${project.id}`}>
                  <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </div>
                      <h3 className="font-medium text-foreground mb-1 truncate">
                        {project.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
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
        )}
      </section>
      </div>
    </MarketingLayout>
  );
};

export default MarketingDashboard;
