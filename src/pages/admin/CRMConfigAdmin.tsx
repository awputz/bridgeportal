import { useState } from "react";
import { useDealStagesAdmin } from "@/hooks/useDealStagesAdmin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DialogDescription,
  DialogFooter,
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
import { Plus, Pencil, Trash2, GripVertical, Palette } from "lucide-react";

const DIVISIONS = ["Investment Sales", "Commercial Leasing", "Residential", "Capital Advisory"];

const PRESET_COLORS = [
  "#6b7280", // gray
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#14b8a6", // teal
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#ec4899", // pink
];

interface StageForm {
  name: string;
  division: string;
  color: string;
  display_order: number;
}

const defaultForm: StageForm = {
  name: "",
  division: "Investment Sales",
  color: "#6b7280",
  display_order: 0,
};

export default function CRMConfigAdmin() {
  const { stages, isLoading, createStage, updateStage, deleteStage, toggleActive } = useDealStagesAdmin();
  const [activeDivision, setActiveDivision] = useState("Investment Sales");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<StageForm>(defaultForm);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const filteredStages = stages?.filter((s) => s.division === activeDivision);

  const openCreate = () => {
    const maxOrder = Math.max(...(filteredStages?.map((s) => s.display_order) || [0]), 0);
    setForm({ ...defaultForm, division: activeDivision, display_order: maxOrder + 1 });
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (stage: NonNullable<typeof stages>[number]) => {
    setForm({
      name: stage.name,
      division: stage.division,
      color: stage.color,
      display_order: stage.display_order,
    });
    setEditId(stage.id);
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (editId) {
      updateStage.mutate({ id: editId, ...form });
    } else {
      createStage.mutate(form);
    }
    setShowForm(false);
    setForm(defaultForm);
    setEditId(null);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      deleteStage.mutate(deleteTarget);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">CRM Configuration</h1>
        <p className="text-muted-foreground mt-1">
          Configure deal pipeline stages and CRM settings
        </p>
      </div>

      <Tabs value={activeDivision} onValueChange={setActiveDivision}>
        <TabsList className="grid grid-cols-4">
          {DIVISIONS.map((div) => (
            <TabsTrigger key={div} value={div}>
              {div}
            </TabsTrigger>
          ))}
        </TabsList>

        {DIVISIONS.map((division) => (
          <TabsContent key={division} value={division}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Pipeline Stages</CardTitle>
                  <CardDescription>
                    Configure the deal stages for {division}
                  </CardDescription>
                </div>
                <Button onClick={openCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Stage
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading...</div>
                ) : !filteredStages?.length ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No stages configured for {division}</p>
                    <Button variant="outline" className="mt-4" onClick={openCreate}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Stage
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Visual Pipeline Preview */}
                    <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                      <div className="text-sm font-medium mb-3">Pipeline Preview</div>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {filteredStages
                          .filter((s) => s.is_active)
                          .sort((a, b) => a.display_order - b.display_order)
                          .map((stage, i) => (
                            <div key={stage.id} className="flex items-center">
                              <div
                                className="px-4 py-2 rounded-full text-sm font-medium text-white whitespace-nowrap"
                                style={{ backgroundColor: stage.color }}
                              >
                                {stage.name}
                              </div>
                              {i < filteredStages.filter((s) => s.is_active).length - 1 && (
                                <div className="mx-1 text-muted-foreground">→</div>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">Order</TableHead>
                          <TableHead>Stage Name</TableHead>
                          <TableHead>Color</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStages
                          .sort((a, b) => a.display_order - b.display_order)
                          .map((stage) => (
                            <TableRow key={stage.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-mono text-sm">{stage.display_order}</span>
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">{stage.name}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-6 h-6 rounded-full border"
                                    style={{ backgroundColor: stage.color }}
                                  />
                                  <span className="font-mono text-xs text-muted-foreground">
                                    {stage.color}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={stage.is_active ?? true}
                                    onCheckedChange={(checked) =>
                                      toggleActive.mutate({ id: stage.id, is_active: checked })
                                    }
                                  />
                                  <Badge variant={stage.is_active ? "default" : "secondary"}>
                                    {stage.is_active ? "Active" : "Inactive"}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  <Button variant="ghost" size="icon" onClick={() => openEdit(stage)}>
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setDeleteTarget(stage.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Create/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Stage" : "Add Stage"}</DialogTitle>
            <DialogDescription>
              {editId ? "Update the pipeline stage" : "Add a new stage to the pipeline"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Stage Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Initial Contact, Under Contract"
              />
            </div>
            <div className="space-y-2">
              <Label>Division</Label>
              <Select value={form.division} onValueChange={(v) => setForm({ ...form, division: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIVISIONS.map((div) => (
                    <SelectItem key={div} value={div}>
                      {div}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Display Order</Label>
              <Input
                type="number"
                value={form.display_order}
                onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Color
              </Label>
              <div className="flex gap-2 flex-wrap">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      form.color === color ? "border-foreground scale-110" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setForm({ ...form, color })}
                  />
                ))}
              </div>
              <Input
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                placeholder="#6b7280"
                className="mt-2"
              />
            </div>
            <div className="pt-2">
              <Label>Preview</Label>
              <div
                className="mt-2 px-4 py-2 rounded-full text-sm font-medium text-white inline-block"
                style={{ backgroundColor: form.color }}
              >
                {form.name || "Stage Name"}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={!form.name}>
              {editId ? "Update" : "Create"} Stage
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Stage?</AlertDialogTitle>
            <AlertDialogDescription>
              This may affect existing deals in this stage. Consider deactivating instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
