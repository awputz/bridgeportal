import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FolderKanban, Sparkles } from "lucide-react";
import { useMarketingProjects } from "@/hooks/marketing";

const MarketingProjects = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { data: projects, isLoading } = useMarketingProjects(
    statusFilter === "all" ? undefined : statusFilter
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-violet-500/20">
            <FolderKanban className="h-5 w-5 text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl font-extralight text-foreground">My Projects</h1>
            <p className="text-sm text-muted-foreground">
              Manage your marketing designs and campaigns
            </p>
          </div>
        </div>
        <Button asChild className="gap-2">
          <Link to="/portal/marketing/create">
            <Plus className="h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-0">
                <div className="aspect-video bg-muted" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Link key={project.id} to={`/portal/marketing/edit/${project.id}`}>
              <Card className="overflow-hidden hover:bg-muted/50 transition-colors cursor-pointer group">
                <CardContent className="p-0">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    {project.thumbnail_url ? (
                      <img 
                        src={project.thumbnail_url} 
                        alt={project.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FolderKanban className="h-8 w-8 text-muted-foreground/50" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-foreground mb-1 truncate">
                      {project.name}
                    </h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {project.type.replace('-', ' ')} • {project.status}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-4 max-w-sm">
              {statusFilter === "all" 
                ? "Start creating marketing materials with our templates."
                : `No ${statusFilter} projects yet.`}
            </p>
            <Button asChild>
              <Link to="/portal/marketing/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MarketingProjects;
