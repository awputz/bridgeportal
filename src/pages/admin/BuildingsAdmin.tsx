import { useState } from "react";
import { useBuildingsAdmin } from "@/hooks/useBuildingsAdmin";
import { Input } from "@/components/ui/input";
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Plus, Pencil, Trash2, Building2, ExternalLink } from "lucide-react";

interface BuildingForm {
  name: string;
  slug: string;
  address: string;
  borough: string;
  neighborhood: string;
  description: string;
  unit_count: number | null;
  image_url: string;
  website_url: string;
}

const defaultForm: BuildingForm = {
  name: "",
  slug: "",
  address: "",
  borough: "",
  neighborhood: "",
  description: "",
  unit_count: null,
  image_url: "",
  website_url: "",
};

export default function BuildingsAdmin() {
  const { buildings, isLoading, createBuilding, updateBuilding, deleteBuilding, toggleActive } = useBuildingsAdmin();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<BuildingForm>(defaultForm);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const filteredBuildings = buildings?.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.address.toLowerCase().includes(search.toLowerCase()) ||
      b.neighborhood?.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setForm(defaultForm);
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (building: typeof buildings extends (infer T)[] ? T : never) => {
    setForm({
      name: building.name,
      slug: building.slug,
      address: building.address,
      borough: building.borough || "",
      neighborhood: building.neighborhood || "",
      description: building.description || "",
      unit_count: building.unit_count,
      image_url: building.image_url || "",
      website_url: building.website_url || "",
    });
    setEditId(building.id);
    setShowForm(true);
  };

  const handleSubmit = () => {
    const data = {
      ...form,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
    };

    if (editId) {
      updateBuilding.mutate({ id: editId, ...data });
    } else {
      createBuilding.mutate(data);
    }
    setShowForm(false);
    setForm(defaultForm);
    setEditId(null);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      deleteBuilding.mutate(deleteTarget);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Buildings</h1>
          <p className="text-muted-foreground mt-1">
            Manage residential buildings in your portfolio
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Building
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Buildings</CardTitle>
          <CardDescription>
            {buildings?.length || 0} buildings in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search buildings..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : !filteredBuildings?.length ? (
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No buildings found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Building</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBuildings.map((building) => (
                  <TableRow key={building.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {building.image_url ? (
                          <img
                            src={building.image_url}
                            alt={building.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{building.name}</div>
                          <div className="text-sm text-muted-foreground">{building.address}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {building.neighborhood && (
                          <Badge variant="outline" className="mr-1">{building.neighborhood}</Badge>
                        )}
                        {building.borough && (
                          <span className="text-sm text-muted-foreground">{building.borough}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {building.unit_count ? (
                        <Badge variant="secondary">{building.unit_count} units</Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={building.is_active ?? true}
                        onCheckedChange={(checked) =>
                          toggleActive.mutate({ id: building.id, is_active: checked })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {building.website_url && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.open(building.website_url!, "_blank")}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => openEdit(building)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTarget(building.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Building" : "Add Building"}</DialogTitle>
            <DialogDescription>
              {editId ? "Update building details" : "Add a new building to the system"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Building name"
              />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="Auto-generated from name"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Address *</Label>
              <AddressAutocomplete
                value={form.address}
                onChange={(v) => setForm({ ...form, address: v })}
                onAddressSelect={(addr) => {
                  setForm({
                    ...form,
                    address: addr.fullAddress,
                    borough: addr.city && ["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"].includes(addr.city) 
                      ? addr.city 
                      : form.borough,
                    neighborhood: addr.neighborhood || form.neighborhood,
                  });
                }}
                placeholder="Start typing an address..."
              />
            </div>
            <div className="space-y-2">
              <Label>Borough</Label>
              <Input
                value={form.borough}
                onChange={(e) => setForm({ ...form, borough: e.target.value })}
                placeholder="e.g., Manhattan"
              />
            </div>
            <div className="space-y-2">
              <Label>Neighborhood</Label>
              <Input
                value={form.neighborhood}
                onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
                placeholder="e.g., Upper West Side"
              />
            </div>
            <div className="space-y-2">
              <Label>Unit Count</Label>
              <Input
                type="number"
                value={form.unit_count || ""}
                onChange={(e) => setForm({ ...form, unit_count: e.target.value ? parseInt(e.target.value) : null })}
                placeholder="Number of units"
              />
            </div>
            <div className="space-y-2">
              <Label>Website URL</Label>
              <Input
                value={form.website_url}
                onChange={(e) => setForm({ ...form, website_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Image URL</Label>
              <Input
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Building description..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={!form.name || !form.address}>
              {editId ? "Update" : "Create"} Building
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Building?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this building. This action cannot be undone.
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
