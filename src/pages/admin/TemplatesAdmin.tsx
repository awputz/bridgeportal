import { useState } from "react";
import { Plus, Pencil, Trash2, ExternalLink, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAgentTemplates } from "@/hooks/useAgentTemplates";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const divisionOptions = [
  { value: "investment-sales", label: "Investment Sales" },
  { value: "commercial-leasing", label: "Commercial" },
  { value: "residential", label: "Residential" },
  { value: "marketing", label: "Marketing" },
];

const TemplatesAdmin = () => {
  const [selectedDivision, setSelectedDivision] = useState("investment-sales");
  const { data: templates, isLoading } = useAgentTemplates(selectedDivision);
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", file_url: "", file_type: "document", division: "investment-sales", is_active: true, display_order: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenDialog = (template?: any) => {
    if (template) {
      setEditingTemplate(template);
      setFormData({ name: template.name, description: template.description || "", file_url: template.file_url, file_type: template.file_type || "document", division: template.division, is_active: template.is_active ?? true, display_order: template.display_order ?? 0 });
    } else {
      setEditingTemplate(null);
      setFormData({ name: "", description: "", file_url: "", file_type: "document", division: selectedDivision, is_active: true, display_order: (templates?.length || 0) + 1 });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingTemplate) {
        await supabase.from("agent_templates").update(formData).eq("id", editingTemplate.id);
        toast.success("Template updated");
      } else {
        await supabase.from("agent_templates").insert(formData);
        toast.success("Template created");
      }
      queryClient.invalidateQueries({ queryKey: ["agent-templates"] });
      setIsDialogOpen(false);
    } catch { toast.error("Failed to save"); } finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    await supabase.from("agent_templates").delete().eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["agent-templates"] });
    toast.success("Deleted");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-light text-foreground">Templates</h1><p className="text-sm text-muted-foreground">Manage document templates</p></div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild><Button onClick={() => handleOpenDialog()}><Plus className="h-4 w-4 mr-2" />Add Template</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingTemplate ? "Edit" : "Add"} Template</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2"><Label>Name</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div>
              <div className="space-y-2"><Label>Description</Label><Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>
              <div className="space-y-2"><Label>File URL</Label><Input type="url" value={formData.file_url} onChange={(e) => setFormData({ ...formData, file_url: e.target.value })} required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Division</Label><Select value={formData.division} onValueChange={(v) => setFormData({ ...formData, division: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{divisionOptions.map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label>Type</Label><Select value={formData.file_type} onValueChange={(v) => setFormData({ ...formData, file_type: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="document">Document</SelectItem><SelectItem value="spreadsheet">Spreadsheet</SelectItem><SelectItem value="canva">Canva</SelectItem><SelectItem value="pdf">PDF</SelectItem></SelectContent></Select></div>
              </div>
              <div className="flex items-center gap-2"><Switch checked={formData.is_active} onCheckedChange={(c) => setFormData({ ...formData, is_active: c })} /><Label>Active</Label></div>
              <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button><Button type="submit" disabled={isSubmitting}>{editingTemplate ? "Update" : "Create"}</Button></div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={selectedDivision} onValueChange={setSelectedDivision}>
        <TabsList className="grid grid-cols-4 w-full max-w-lg">{divisionOptions.map((d) => <TabsTrigger key={d.value} value={d.value}>{d.label}</TabsTrigger>)}</TabsList>
        {divisionOptions.map((div) => (
          <TabsContent key={div.value} value={div.value} className="mt-6">
            {isLoading ? <div className="space-y-2">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}</div> : !templates?.length ? (
              <div className="text-center py-12 glass-card rounded-xl"><FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" /><p className="text-muted-foreground">No templates yet</p></div>
            ) : (
              <div className="space-y-2">
                {templates.map((t) => (
                  <div key={t.id} className="glass-card p-4 flex items-center justify-between gap-4">
                    <div><span className="font-medium text-foreground">{t.name}</span><p className="text-sm text-muted-foreground line-clamp-1">{t.description}</p></div>
                    <div className="flex items-center gap-2">
                      <a href={t.file_url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-white/5 rounded-lg"><ExternalLink className="h-4 w-4 text-muted-foreground" /></a>
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(t)}><Pencil className="h-4 w-4" /></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete?</AlertDialogTitle></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(t.id)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default TemplatesAdmin;
