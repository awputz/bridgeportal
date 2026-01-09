import { useState } from "react";
import { useMarketingAssets, useDeleteMarketingAsset } from "@/hooks/marketing/useMarketingAssets";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Trash2, Download, Image, User, FileSignature, Camera, MoreVertical } from "lucide-react";
import { UploadAssetDialog } from "@/components/marketing/UploadAssetDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { format } from "date-fns";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";

const assetTypes = [
  { value: "all", label: "All Assets", icon: Image },
  { value: "logo", label: "Logos", icon: Image },
  { value: "headshot", label: "Headshots", icon: User },
  { value: "photo", label: "Photos", icon: Camera },
  { value: "signature", label: "Signatures", icon: FileSignature },
];

export default function AssetLibrary() {
  const [activeTab, setActiveTab] = useState("all");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleteAsset, setDeleteAsset] = useState<{ id: string; name: string } | null>(null);

  const { data: assets, isLoading } = useMarketingAssets(activeTab === "all" ? undefined : activeTab);
  const deleteAssetMutation = useDeleteMarketingAsset();

  const handleDownload = (url: string, name: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async () => {
    if (!deleteAsset) return;
    const asset = assets?.find((a) => a.id === deleteAsset.id);
    if (asset) {
      await deleteAssetMutation.mutateAsync(asset);
    }
    setDeleteAsset(null);
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = assetTypes.find((t) => t.value === type);
    return typeConfig?.icon || Image;
  };

  return (
    <MarketingLayout>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Asset Library</h1>
          <p className="text-muted-foreground">
            Manage your branding assets, logos, headshots, and more
          </p>
        </div>
        <Button onClick={() => setUploadOpen(true)} className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Asset
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start overflow-x-auto">
          {assetTypes.map((type) => (
            <TabsTrigger key={type.value} value={type.value} className="gap-2">
              <type.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{type.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-0">
                    <div className="aspect-square bg-muted" />
                    <div className="p-3 space-y-2">
                      <div className="h-4 bg-muted rounded" />
                      <div className="h-3 bg-muted rounded w-2/3" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !assets?.length ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="rounded-full bg-muted p-4 mb-4">
                  <Image className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-1">No assets yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Upload your first {activeTab === "all" ? "asset" : activeTab} to get started
                </p>
                <Button onClick={() => setUploadOpen(true)} variant="outline" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Asset
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {assets.map((asset) => {
                const TypeIcon = getTypeIcon(asset.type);
                return (
                  <Card key={asset.id} className="group overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative aspect-square bg-muted">
                        {asset.file_url ? (
                          <img
                            src={asset.file_url}
                            alt={asset.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <TypeIcon className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {asset.file_url && (
                            <Button
                              size="icon"
                              variant="secondary"
                              onClick={() => handleDownload(asset.file_url!, asset.name)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="secondary">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {asset.file_url && (
                                <DropdownMenuItem
                                  onClick={() => handleDownload(asset.file_url!, asset.name)}
                                >
                                  <Download className="mr-2 h-4 w-4" />
                                  Download
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => setDeleteAsset({ id: asset.id, name: asset.name })}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="font-medium truncate text-sm">{asset.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(asset.created_at), "MMM d, yyyy")}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Upload Dialog */}
      <UploadAssetDialog open={uploadOpen} onOpenChange={setUploadOpen} />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteAsset} onOpenChange={() => setDeleteAsset(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Asset</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteAsset?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MarketingLayout>
  );
}
