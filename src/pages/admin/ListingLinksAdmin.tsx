import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, ExternalLink, Link2, Loader2 } from "lucide-react";

interface BridgeListingLink {
  id: string;
  name: string;
  category: string;
  url: string;
  parent_id: string | null;
  is_external: boolean | null;
  display_order: number | null;
  is_active: boolean | null;
}

const CATEGORIES = [
  { value: "residential", label: "Residential" },
  { value: "commercial_leasing", label: "Commercial Leasing" },
  { value: "commercial_office", label: "Commercial Office" },
  { value: "commercial_retail", label: "Commercial Retail" },
  { value: "investment_sales", label: "Investment Sales" },
];

const ListingLinksAdmin = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<BridgeListingLink | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "residential",
    url: "",
    parent_id: "",
    is_external: true,
    is_active: true,
  });

  const { data: links, isLoading } = useQuery({
    queryKey: ["admin-bridge-listing-links"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bridge_listing_links")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data as BridgeListingLink[];
    },
  });

  const parentLinks = links?.filter((l) => !l.parent_id) || [];

  const createMutation = useMutation({
    mutationFn: async (data: Omit<BridgeListingLink, "id" | "display_order">) => {
      const maxOrder = links?.length ? Math.max(...links.map(l => l.display_order || 0)) : 0;
      const { error } = await supabase
        .from("bridge_listing_links")
        .insert([{ ...data, display_order: maxOrder + 1, parent_id: data.parent_id || null }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bridge-listing-links"] });
      queryClient.invalidateQueries({ queryKey: ["bridge-listing-links"] });
      toast({ title: "Link created successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to create link", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<BridgeListingLink> }) => {
      const { error } = await supabase
        .from("bridge_listing_links")
        .update({ ...data, parent_id: data.parent_id || null })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bridge-listing-links"] });
      queryClient.invalidateQueries({ queryKey: ["bridge-listing-links"] });
      toast({ title: "Link updated successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to update link", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("bridge_listing_links")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bridge-listing-links"] });
      queryClient.invalidateQueries({ queryKey: ["bridge-listing-links"] });
      toast({ title: "Link deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete link", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      category: "residential",
      url: "",
      parent_id: "",
      is_external: true,
      is_active: true,
    });
    setEditingLink(null);
  };

  const handleEdit = (link: BridgeListingLink) => {
    setEditingLink(link);
    setFormData({
      name: link.name,
      category: link.category,
      url: link.url,
      parent_id: link.parent_id || "",
      is_external: link.is_external ?? true,
      is_active: link.is_active ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLink) {
      updateMutation.mutate({ id: editingLink.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleAdd = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const getCategoryLabel = (category: string) => {
    return CATEGORIES.find((c) => c.value === category)?.label || category;
  };

  const getParentName = (parentId: string | null) => {
    if (!parentId) return null;
    return links?.find((l) => l.id === parentId)?.name;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Listing Links</h1>
          <p className="text-muted-foreground">Manage external listing portal links</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Link
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Link2 className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">No listing links found</p>
                </TableCell>
              </TableRow>
            ) : (
              links?.map((link) => (
                <TableRow key={link.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{link.name}</span>
                      {link.is_external && (
                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getCategoryLabel(link.category)}</Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                    {link.url}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {getParentName(link.parent_id) || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={link.is_active ? "default" : "secondary"}>
                      {link.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(link)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this link?")) {
                            deleteMutation.mutate(link.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingLink ? "Edit Link" : "Add Link"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Parent Link (optional)</Label>
              <Select
                value={formData.parent_id}
                onValueChange={(value) => setFormData({ ...formData, parent_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="None (top-level)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None (top-level)</SelectItem>
                  {parentLinks
                    .filter((l) => l.id !== editingLink?.id)
                    .map((link) => (
                      <SelectItem key={link.id} value={link.id}>
                        {link.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_external}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_external: checked })}
                />
                <Label>External Link</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label>Active</Label>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {editingLink ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListingLinksAdmin;
