import { useState } from "react";
import { Plus, Pencil, Trash2, ExternalLink, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAllExternalTools, useExternalToolMutations, ExternalTool } from "@/hooks/useExternalTools";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const iconOptions = ["Mail", "Users", "Calendar", "HardDrive", "MessageSquare", "Search", "TrendingUp", "Building2", "Home", "Database", "BarChart3", "FileSearch", "MapPin"];
const categoryOptions = [{ value: "research", label: "Research" }, { value: "productivity", label: "Productivity" }];

type ToolFormData = {
  name: string;
  description: string;
  url: string;
  icon: string;
  category: string;
  is_active: boolean;
  display_order: number;
};

const defaultFormData: ToolFormData = { name: "", description: "", url: "", icon: "Database", category: "research", is_active: true, display_order: 0 };

const ToolsAdmin = () => {
  const { data: tools, isLoading } = useAllExternalTools();
  const { createTool, updateTool, deleteTool } = useExternalToolMutations();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<ExternalTool | null>(null);
  const [formData, setFormData] = useState<ToolFormData>(defaultFormData);

  const handleOpenDialog = (tool?: ExternalTool) => {
    if (tool) {
      setEditingTool(tool);
      setFormData({ name: tool.name, description: tool.description || "", url: tool.url, icon: tool.icon, category: (tool as any).category || "research", is_active: tool.is_active ?? true, display_order: tool.display_order ?? 0 });
    } else {
      setEditingTool(null);
      setFormData({ ...defaultFormData, display_order: (tools?.length || 0) + 1 });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTool) {
        await updateTool.mutateAsync({ id: editingTool.id, ...formData });
        toast.success("Tool updated");
      } else {
        await createTool.mutateAsync(formData);
        toast.success("Tool created");
      }
      setIsDialogOpen(false);
    } catch { toast.error("Failed to save tool"); }
  };

  const handleDelete = async (id: string) => {
    try { await deleteTool.mutateAsync(id); toast.success("Tool deleted"); } catch { toast.error("Failed to delete"); }
  };

  const handleToggleActive = async (tool: ExternalTool) => {
    try { await updateTool.mutateAsync({ id: tool.id, is_active: !tool.is_active }); } catch { toast.error("Failed to update"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-foreground">External Tools</h1>
          <p className="text-sm text-muted-foreground">Manage quick action links</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild><Button onClick={() => handleOpenDialog()}><Plus className="h-4 w-4 mr-2" />Add Tool</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingTool ? "Edit Tool" : "Add Tool"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2"><Label>Name</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div>
              <div className="space-y-2"><Label>Description</Label><Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>
              <div className="space-y-2"><Label>URL</Label><Input type="url" value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Icon</Label><Select value={formData.icon} onValueChange={(v) => setFormData({ ...formData, icon: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{iconOptions.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label>Category</Label><Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{categoryOptions.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent></Select></div>
              </div>
              <div className="flex items-center gap-2"><Switch checked={formData.is_active} onCheckedChange={(c) => setFormData({ ...formData, is_active: c })} /><Label>Active</Label></div>
              <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button><Button type="submit">{editingTool ? "Update" : "Create"}</Button></div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}</div> : (
        <div className="space-y-2">
          {tools?.map((tool) => (
            <div key={tool.id} className="glass-card p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
                <div><span className="font-medium text-foreground">{tool.name}</span><p className="text-sm text-muted-foreground">{tool.description}</p></div>
              </div>
              <div className="flex items-center gap-2">
                <a href={tool.url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-white/5 rounded-lg"><ExternalLink className="h-4 w-4 text-muted-foreground" /></a>
                <Switch checked={tool.is_active ?? true} onCheckedChange={() => handleToggleActive(tool)} />
                <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(tool)}><Pencil className="h-4 w-4" /></Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                  <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Tool</AlertDialogTitle><AlertDialogDescription>Are you sure?</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(tool.id)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ToolsAdmin;
