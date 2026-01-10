import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Upload, Wand2, Download, RefreshCw, Trash2, CheckSquare, Square } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useStagingProject, useStagingProjectImages, useStageImage, useStagingTemplates, useBatchStageImages } from "@/hooks/marketing/useStaging";
import { ImageUploadZone } from "@/components/staging/ImageUploadZone";
import { StagingImageCard } from "@/components/staging/StagingImageCard";
import { BeforeAfterComparison } from "@/components/staging/BeforeAfterComparison";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
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
  const batchStageMutation = useBatchStageImages();
  
  // Selection state
  const [selectedImageIds, setSelectedImageIds] = useState<Set<string>>(new Set());
  const [selectionMode, setSelectionMode] = useState<'single' | 'batch'>('single');
  const [roomType, setRoomType] = useState<string>("living-room");
  const [stylePreference, setStylePreference] = useState<string>("modern");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  
  // For single mode, get first selected image
  const selectedImageId = selectionMode === 'single' ? Array.from(selectedImageIds)[0] || null : null;
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
  
  const handleImageClick = (imageId: string) => {
    if (selectionMode === 'batch') {
      setSelectedImageIds(prev => {
        const next = new Set(prev);
        if (next.has(imageId)) {
          next.delete(imageId);
        } else {
          next.add(imageId);
        }
        return next;
      });
    } else {
      setSelectedImageIds(new Set([imageId]));
    }
  };

  const handleSelectAllPending = () => {
    const pendingIds = images?.filter(img => img.status === 'pending').map(img => img.id) || [];
    setSelectedImageIds(new Set(pendingIds));
  };

  const handleClearSelection = () => {
    setSelectedImageIds(new Set());
  };

  const handleToggleSelectionMode = () => {
    setSelectionMode(prev => prev === 'single' ? 'batch' : 'single');
    setSelectedImageIds(new Set());
  };

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

  const handleBatchStage = () => {
    if (selectedImageIds.size === 0) {
      toast({ title: "No images selected", description: "Please select images to stage", variant: "destructive" });
      return;
    }

    batchStageMutation.mutate({
      imageIds: Array.from(selectedImageIds),
      roomType,
      stylePreference,
      templateId: selectedTemplateId || undefined,
    });

    // Clear selection after starting batch
    setSelectedImageIds(new Set());
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
    
    if (selectedImageIds.has(imageId)) {
      setSelectedImageIds(prev => {
        const next = new Set(prev);
        next.delete(imageId);
        return next;
      });
    }
    
    refetchImages();
    toast({ title: "Image deleted" });
  };
  
  if (projectLoading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 space-y-6 animate-pulse">
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
      <div className="p-4 md:p-6 lg:p-8 text-center py-12">
        <p className="text-muted-foreground">Project not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/portal/marketing/staging")}>
          Back to Staging
        </Button>
      </div>
    );
  }

  return (
    <MarketingLayout backTo="/portal/marketing/staging" backLabel="Back to AI Staging">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-light tracking-tight">{project.name}</h1>
          <p className="text-sm text-muted-foreground font-normal capitalize">
            {project.staging_type} Staging • {project.total_images} images
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={selectionMode === 'batch' ? 'default' : 'outline'}
            size="sm"
            onClick={handleToggleSelectionMode}
          >
            {selectionMode === 'batch' ? (
              <>
                <CheckSquare className="h-4 w-4 mr-2" />
                Exit Batch Mode
              </>
            ) : (
              <>
                <Square className="h-4 w-4 mr-2" />
                Select Multiple
              </>
            )}
          </Button>
          <Badge variant={project.status === "completed" ? "default" : "secondary"} className="capitalize">
            {project.status}
          </Badge>
        </div>
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
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Project Images ({images?.length || 0})</CardTitle>
              {selectionMode === 'batch' && (
                <div className="flex items-center gap-2 text-sm">
                  <Button variant="ghost" size="sm" onClick={handleSelectAllPending}>
                    Select All Pending
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleClearSelection}>
                    Clear
                  </Button>
                  <span className="text-muted-foreground">
                    {selectedImageIds.size} selected
                  </span>
                </div>
              )}
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
                      isSelected={selectedImageIds.has(image.id)}
                      isMultiSelect={selectionMode === 'batch'}
                      onClick={() => handleImageClick(image.id)}
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
          {selectionMode === 'batch' && selectedImageIds.size > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5" />
                  Batch Stage {selectedImageIds.size} Images
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Preview of selected images */}
                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                  {Array.from(selectedImageIds).slice(0, 8).map(id => {
                    const img = images?.find(i => i.id === id);
                    return img ? (
                      <div key={id} className="w-12 h-12 rounded overflow-hidden border">
                        <img src={img.original_url} alt="" loading="lazy" className="w-full h-full object-cover" />
                      </div>
                    ) : null;
                  })}
                  {selectedImageIds.size > 8 && (
                    <div className="w-12 h-12 rounded bg-muted flex items-center justify-center text-xs">
                      +{selectedImageIds.size - 8}
                    </div>
                  )}
                </div>

                {/* Settings applied to all */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Room Type (All)</Label>
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
                    <Label>Style (All)</Label>
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
                  onClick={handleBatchStage}
                  disabled={batchStageMutation.isPending}
                >
                  {batchStageMutation.isPending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Starting Batch...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Stage All {selectedImageIds.size} Images
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5" />
                  Stage Selected Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {selectedImage ? (
                  <>
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                      <img
                        src={selectedImage.original_url}
                        alt="Selected"
                        loading="lazy"
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
          )}

          {/* Before/After Comparison */}
          {selectedImage?.staged_url && selectionMode === 'single' && (
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
    </MarketingLayout>
  );
}
