import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Building2, Landmark, TrendingUp, Plus, ImageIcon, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStagingProjects } from "@/hooks/marketing/useStaging";
import { CreateStagingProjectDialog } from "@/components/marketing/CreateStagingProjectDialog";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { format } from "date-fns";

type StagingType = "residential" | "commercial" | "architecture" | "investment";

const STAGING_TYPES = [
  {
    id: "residential" as StagingType,
    name: "Residential",
    description: "Stage homes, apartments, and condos for buyers",
    icon: Home,
    color: "bg-blue-500/10 text-blue-600 border-blue-200",
  },
  {
    id: "commercial" as StagingType,
    name: "Commercial",
    description: "Transform office spaces and retail locations",
    icon: Building2,
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  },
  {
    id: "architecture" as StagingType,
    name: "Architecture",
    description: "Visualize architectural designs and renovations",
    icon: Landmark,
    color: "bg-purple-500/10 text-purple-600 border-purple-200",
  },
  {
    id: "investment" as StagingType,
    name: "Investment",
    description: "Stage properties for investor presentations",
    icon: TrendingUp,
    color: "bg-amber-500/10 text-amber-600 border-amber-200",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
    case "processing":
      return <Badge variant="secondary" className="bg-blue-500 text-white"><Clock className="h-3 w-3 mr-1 animate-spin" />Processing</Badge>;
    case "failed":
      return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Failed</Badge>;
    default:
      return <Badge variant="outline">Pending</Badge>;
  }
};

export default function AIStaging() {
  const navigate = useNavigate();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<StagingType | undefined>();
  const { data: projects, isLoading } = useStagingProjects();

  const stats = {
    total: projects?.length || 0,
    processing: projects?.filter(p => p.status === "processing").length || 0,
    completed: projects?.filter(p => p.status === "completed").length || 0,
  };

  const handleTypeClick = (type: StagingType) => {
    setSelectedType(type);
    setCreateDialogOpen(true);
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/portal/marketing/staging/${projectId}`);
  };

  return (
    <MarketingLayout>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ImageIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AI Property Staging</h1>
            <p className="text-muted-foreground">
              Transform empty rooms into beautifully staged spaces using AI
            </p>
          </div>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Processing</p>
                <p className="text-2xl font-bold">{stats.processing}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staging Type Selection */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Choose Staging Type</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STAGING_TYPES.map((type) => {
            const Icon = type.icon;
            return (
              <Card
                key={type.id}
                className={`cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] border-2 ${type.color}`}
                onClick={() => handleTypeClick(type.id)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="p-3 rounded-full bg-background">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{type.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {type.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Projects */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Projects</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-32 bg-muted rounded-md mb-4" />
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="cursor-pointer transition-all hover:shadow-md"
                onClick={() => handleProjectClick(project.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{project.name}</CardTitle>
                      <CardDescription className="text-xs capitalize">
                        {project.staging_type} Staging
                      </CardDescription>
                    </div>
                    {getStatusBadge(project.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-md mb-3 flex items-center justify-center overflow-hidden">
                    <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{project.total_images} images</span>
                    <span>{project.completed_images} staged</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {format(new Date(project.created_at), "MMM d, yyyy")}
                  </p>
                </CardContent>
              </Card>
            ))}
            {/* New Project Card */}
            <Card
              className="cursor-pointer border-dashed hover:border-primary hover:bg-muted/50 transition-all"
              onClick={() => setCreateDialogOpen(true)}
            >
              <CardContent className="p-6 h-full flex flex-col items-center justify-center min-h-[200px]">
                <div className="p-4 rounded-full bg-muted mb-3">
                  <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="font-medium">Create New Project</p>
                <p className="text-xs text-muted-foreground">Start staging property images</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="pt-12 pb-12 flex flex-col items-center justify-center">
              <div className="p-4 rounded-full bg-muted mb-4">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-1">No staging projects yet</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Create your first project to start staging property images with AI
              </p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Project
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <CreateStagingProjectDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        defaultStagingType={selectedType}
      />
    </MarketingLayout>
  );
}
