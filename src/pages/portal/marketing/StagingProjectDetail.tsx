import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Wand2, Download, RefreshCw, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useStagingProject, useStagingProjectImages, useStageImage, useStagingTemplates } from "@/hooks/marketing/useStaging";
import { ImageUploadZone } from "@/components/staging/ImageUploadZone";
import { StagingImageCard } from "@/components/staging/StagingImageCard";
import { BeforeAfterComparison } from "@/components/staging/BeforeAfterComparison";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
const ROOM_TYPES = [
  { value: "living-room", label: "Living Room" },
  { value: "bedroom", label: "Bedroom" },
  { value: "kitchen", label: "Kitchen" },
  { value: "bathroom", label: "Bathroom" },
  { value: "dining-room", label: "Dining Room" },
  { value: "office", label: "Home Office" },
  { value: "exterior", label: "Exterior" },
  { value: "lobby", label: "Lobby" },
  { value: "other", label: "Other" },
];

const STYLE_PREFERENCES = [
  { value: "modern", label: "Modern" },
  { value: "traditional", label: "Traditional" },
  { value: "minimalist", label: "Minimalist" },
  { value: "luxury", label: "Luxury" },
  { value: "industrial", label: "Industrial" },
  { value: "coastal", label: "Coastal" },
  { value: "scandinavian", label: "Scandinavian" },
  { value: "contemporary", label: "Contemporary" },
];

export default function StagingProjectDetail() {
  const { id: projectId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: project, isLoading: projectLoading } = useStagingProject(projectId!);
  const { data: images, isLoading: imagesLoading, refetch: refetchImages } = useStagingProjectImages(projectId!);
  const { data: templates } = useStagingTemplates();
  const stageImageMutation = useStageImage();
  
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [roomType, setRoomType] = useState<string>("living-room");
  const [stylePreference, setStylePreference] = useState<string>("modern");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  
  const selectedImage = images?.find(img => img.id === selectedImageId);

  // Real-time subscription for image status updates
  useEffect(() => {
    if (!projectId) return;
    
    const channel = supabase
      .channel(`staging-images-${projectId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'staging_images',
          filter: `project_id=eq.${projectId}`
        },
        (payload) => {
          const newStatus = (payload.new as { status: string }).status;
          if (newStatus === 'completed' || newStatus === 'failed') {
            queryClient.invalidateQueries({ queryKey: ['staging-project-images', projectId] });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, queryClient]);
  
  const handleStageImage = async () => {
    if (!selectedImageId) {
      toast({ title: "Select an image", description: "Please select an image to stage", variant: "destructive" });
      return;
    }
    
    // Update image with room type and style before staging
    await supabase
      .from("staging_images")
      .update({ room_type: roomType, style_preference: stylePreference })
      .eq("id", selectedImageId);
    
    stageImageMutation.mutate({
      imageId: selectedImageId,
      templateId: selectedTemplateId || undefined,
    });
  };

  const handleRetryStaging = async (imageId: string) => {
    stageImageMutation.mutate({
      imageId,
      templateId: selectedTemplateId || undefined,
    });
  };
  
  const handleImageUploaded = () => {
    refetchImages();
  };
  
  const handleDeleteImage = async (imageId: string) => {
    const image = images?.find(img => img.id === imageId);
    if (!image) return;
    
    // Delete from storage
    if (image.original_url) {
      const path = image.original_url.split("/staging-images/")[1];
      if (path) {
        await supabase.storage.from("staging-images").remove([path]);
      }
    }
    if (image.staged_url) {
      const path = image.staged_url.split("/staging-images/")[1];
      if (path) {
        await supabase.storage.from("staging-images").remove([path]);
      }
    }
    
    // Delete from database
    await supabase.from("staging_images").delete().eq("id", imageId);
    
    if (selectedImageId === imageId) {
      setSelectedImageId(null);
    }
    
    refetchImages();
    toast({ title: "Image deleted" });
  };
  
  if (projectLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/4" />
        <div className="grid grid-cols-2 gap-6">
          <div className="h-96 bg-muted rounded" />
          <div className="h-96 bg-muted rounded" />
        </div>
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Project not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/portal/marketing/staging")}>
          Back to Staging
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/portal/marketing/staging")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <p className="text-muted-foreground text-sm capitalize">
              {project.staging_type} Staging • {project.total_images} images
            </p>
          </div>
        </div>
        <Badge variant={project.status === "completed" ? "default" : "secondary"} className="capitalize">
          {project.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Upload & Gallery */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploadZone 
                projectId={projectId!} 
                onUploadComplete={handleImageUploaded}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Images ({images?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {imagesLoading ? (
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-square bg-muted rounded animate-pulse" />
                  ))}
                </div>
              ) : images && images.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {images.map((image) => (
                    <StagingImageCard
                      key={image.id}
                      image={image}
                      isSelected={selectedImageId === image.id}
                      onClick={() => setSelectedImageId(image.id)}
                      onDelete={() => handleDeleteImage(image.id)}
                      onRetry={handleRetryStaging}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No images uploaded yet</p>
                  <p className="text-sm">Upload images above to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Staging Controls */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5" />
                Stage Selected Image
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedImage ? (
                <>
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    <img
                      src={selectedImage.original_url}
                      alt="Selected"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Room Type</Label>
                      <Select value={roomType} onValueChange={setRoomType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ROOM_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Style</Label>
                      <Select value={stylePreference} onValueChange={setStylePreference}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STYLE_PREFERENCES.map((style) => (
                            <SelectItem key={style.value} value={style.value}>
                              {style.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {templates && templates.length > 0 && (
                    <div className="space-y-2">
                      <Label>Template (Optional)</Label>
                      <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Use custom prompt template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No template</SelectItem>
                          {templates.map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <Button 
                    className="w-full" 
                    onClick={handleStageImage}
                    disabled={stageImageMutation.isPending || selectedImage.status === "processing"}
                  >
                    {stageImageMutation.isPending || selectedImage.status === "processing" ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Stage Image
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Wand2 className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>Select an image to stage</p>
                  <p className="text-sm">Click on any uploaded image to select it</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Before/After Comparison */}
          {selectedImage?.staged_url && (
            <Card>
              <CardHeader>
                <CardTitle>Before / After</CardTitle>
              </CardHeader>
              <CardContent>
                <BeforeAfterComparison
                  originalUrl={selectedImage.original_url}
                  stagedUrl={selectedImage.staged_url}
                  processingTimeMs={selectedImage.processing_time_ms}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
