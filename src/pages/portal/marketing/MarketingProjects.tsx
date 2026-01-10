import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Plus, 
  FolderKanban, 
  Sparkles, 
  Search,
  MoreVertical,
  Edit,
  Copy,
  Download,
  Trash2
} from "lucide-react";
import { 
  useMarketingProjects, 
  useDeleteMarketingProject, 
  useDuplicateProject,
  useProjectStats
} from "@/hooks/marketing";
import { formatSafeRelativeTime } from "@/lib/dateUtils";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";

const MarketingProjects = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  
  const { data: projects, isLoading } = useMarketingProjects(
    statusFilter === "all" ? undefined : statusFilter
  );
  const { data: stats } = useProjectStats();
  const deleteProject = useDeleteMarketingProject();
  const duplicateProject = useDuplicateProject();
  
  // Apply search filter
  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    if (!searchQuery.trim()) return projects;
    const query = searchQuery.toLowerCase();
    return projects.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.type.toLowerCase().includes(query)
    );
  }, [projects, searchQuery]);

  const handleDelete = (id: string) => {
    setProjectToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      deleteProject.mutate(projectToDelete);
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  const handleDuplicate = (id: string) => {
    duplicateProject.mutate(id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/20 text-emerald-400';
      case 'published':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-amber-500/20 text-amber-400';
    }
  };

  return (
    <MarketingLayout breadcrumbs={[{ label: "Projects" }]}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-violet-500/20">
            <FolderKanban className="h-5 w-5 text-violet-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-foreground">My Projects</h1>
            <p className="text-sm text-muted-foreground font-normal">
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

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search projects..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Filters */}
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList>
          <TabsTrigger value="all" className="gap-1">
            All
            {stats && (
              <Badge variant="secondary" className="ml-1 text-xs h-5 px-1.5">
                {stats.total}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="draft" className="gap-1">
            Drafts
            {stats && (
              <Badge variant="secondary" className="ml-1 text-xs h-5 px-1.5">
                {stats.draft}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-1">
            Completed
            {stats && (
              <Badge variant="secondary" className="ml-1 text-xs h-5 px-1.5">
                {stats.completed}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="published" className="gap-1">
            Published
            {stats && (
              <Badge variant="secondary" className="ml-1 text-xs h-5 px-1.5">
                {stats.published}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search Results Info */}
      {searchQuery && (
        <p className="text-sm text-muted-foreground">
          {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found for "{searchQuery}"
        </p>
      )}

      {/* Projects Grid */}
      {isLoading ? (
        <LoadingState variant="card" message="Loading projects..." />
      ) : filteredProjects && filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <Card 
              key={project.id} 
              className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/50"
            >
              <CardContent className="p-0">
                <Link to={`/portal/marketing/edit/${project.id}`}>
                  <div className="aspect-video bg-muted flex items-center justify-center cursor-pointer overflow-hidden">
                    {project.thumbnail_url ? (
                      <img 
                        src={project.thumbnail_url} 
                        alt={project.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <FolderKanban className="h-8 w-8 text-muted-foreground/50" />
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <Link 
                      to={`/portal/marketing/edit/${project.id}`}
                      className="flex-1 min-w-0"
                    >
                      <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors duration-300">
                        {project.name}
                      </h3>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          aria-label="More options"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/portal/marketing/edit/${project.id}`)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(project.id)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        {project.output_url && (
                          <DropdownMenuItem asChild>
                            <a href={project.output_url} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </a>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(project.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-muted-foreground capitalize">
                      {project.type.replace('-', ' ')}
                    </p>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getStatusColor(project.status)}`}
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Updated {formatSafeRelativeTime(project.updated_at)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Sparkles}
          title={searchQuery ? "No projects found" : "No projects yet"}
          description={searchQuery 
            ? `No projects match "${searchQuery}". Try a different search.`
            : statusFilter === "all" 
            ? "Start creating marketing materials with our templates."
            : `No ${statusFilter} projects yet.`}
          actionLabel={!searchQuery ? "Create Project" : undefined}
          actionHref={!searchQuery ? "/portal/marketing/create" : undefined}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MarketingLayout>
  );
};

export default MarketingProjects;