import { useState } from "react";
import { useDealRoomRegistrations, useDealRoomDocuments } from "@/hooks/useDealRoomAdmin";
import { useInvestmentListingsAdmin } from "@/hooks/useListingsAdmin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";
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
import { Search, Users, FileText, Trash2, Plus, Download, Eye } from "lucide-react";
import { format } from "date-fns";

export default function DealRoomAdmin() {
  const { registrations, isLoading: loadingRegs, deleteRegistration } = useDealRoomRegistrations();
  const { documents, isLoading: loadingDocs, createDocument, deleteDocument } = useDealRoomDocuments();
  const { listings } = useInvestmentListingsAdmin();
  
  const [search, setSearch] = useState("");
  const [filterListing, setFilterListing] = useState<string>("all");
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "reg" | "doc"; id: string } | null>(null);
  const [newDoc, setNewDoc] = useState({
    listing_id: "",
    document_name: "",
    document_url: "",
    category: "financials",
  });

  const filteredRegistrations = registrations?.filter((reg) => {
    const matchesSearch =
      reg.full_name.toLowerCase().includes(search.toLowerCase()) ||
      reg.email.toLowerCase().includes(search.toLowerCase()) ||
      reg.company_name?.toLowerCase().includes(search.toLowerCase());
    const matchesListing = filterListing === "all" || reg.listing_id === filterListing;
    return matchesSearch && matchesListing;
  });

  const filteredDocuments = documents?.filter((doc) => {
    const matchesSearch = doc.document_name.toLowerCase().includes(search.toLowerCase());
    const matchesListing = filterListing === "all" || doc.listing_id === filterListing;
    return matchesSearch && matchesListing;
  });

  const handleAddDocument = () => {
    if (!newDoc.listing_id || !newDoc.document_name) return;
    createDocument.mutate(newDoc);
    setShowAddDoc(false);
    setNewDoc({ listing_id: "", document_name: "", document_url: "", category: "financials" });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "reg") {
      deleteRegistration.mutate(deleteTarget.id);
    } else {
      deleteDocument.mutate(deleteTarget.id);
    }
    setDeleteTarget(null);
  };

  const exportRegistrations = () => {
    if (!filteredRegistrations) return;
    const csv = [
      ["Name", "Email", "Phone", "Company", "Type", "Registered", "Access Count"].join(","),
      ...filteredRegistrations.map((r) =>
        [r.full_name, r.email, r.phone, r.company_name || "", r.user_type, r.registered_at, r.access_count].join(",")
      ),
    ].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "deal-room-registrations.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Deal Room Management</h1>
        <p className="text-muted-foreground mt-1">
          View registrations and manage deal room documents
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterListing} onValueChange={setFilterListing}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Filter by listing" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Listings</SelectItem>
            {listings?.map((listing) => (
              <SelectItem key={listing.id} value={listing.id}>
                {listing.property_address}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="registrations">
        <TabsList>
          <TabsTrigger value="registrations" className="gap-2">
            <Users className="h-4 w-4" />
            Registrations ({registrations?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-2">
            <FileText className="h-4 w-4" />
            Documents ({documents?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="registrations">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Deal Room Registrations</CardTitle>
                <CardDescription>Users who have registered to access deal rooms</CardDescription>
              </div>
              <Button variant="outline" onClick={exportRegistrations}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              {loadingRegs ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : !filteredRegistrations?.length ? (
                <div className="text-center py-8 text-muted-foreground">No registrations found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contact</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead>Access</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRegistrations.map((reg) => (
                      <TableRow key={reg.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{reg.full_name}</div>
                            <div className="text-sm text-muted-foreground">{reg.email}</div>
                            <div className="text-sm text-muted-foreground">{reg.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {reg.company_name || reg.brokerage_firm || "—"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{reg.user_type}</Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {(reg as any).investment_listings?.property_address || "—"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(reg.registered_at), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{reg.access_count}×</Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteTarget({ type: "reg", id: reg.id })}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Deal Room Documents</CardTitle>
                <CardDescription>Documents available in deal rooms</CardDescription>
              </div>
              <Button onClick={() => setShowAddDoc(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Document
              </Button>
            </CardHeader>
            <CardContent>
              {loadingDocs ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : !filteredDocuments?.length ? (
                <div className="text-center py-8 text-muted-foreground">No documents found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Added</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.document_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{doc.category}</Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {(doc as any).investment_listings?.property_address || "—"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {doc.created_at
                            ? format(new Date(doc.created_at), "MMM d, yyyy")
                            : "—"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={doc.is_active ? "default" : "secondary"}>
                            {doc.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {doc.document_url && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => window.open(doc.document_url!, "_blank")}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteTarget({ type: "doc", id: doc.id })}
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
        </TabsContent>
      </Tabs>

      {/* Add Document Dialog */}
      <Dialog open={showAddDoc} onOpenChange={setShowAddDoc}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Document</DialogTitle>
            <DialogDescription>Add a new document to a deal room</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Property</Label>
              <Select value={newDoc.listing_id} onValueChange={(v) => setNewDoc({ ...newDoc, listing_id: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select listing" />
                </SelectTrigger>
                <SelectContent>
                  {listings?.map((listing) => (
                    <SelectItem key={listing.id} value={listing.id}>
                      {listing.property_address}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Document Name</Label>
              <Input
                value={newDoc.document_name}
                onChange={(e) => setNewDoc({ ...newDoc, document_name: e.target.value })}
                placeholder="e.g., Rent Roll Q4 2024"
              />
            </div>
            <div className="space-y-2">
              <Label>Document URL</Label>
              <Input
                value={newDoc.document_url}
                onChange={(e) => setNewDoc({ ...newDoc, document_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={newDoc.category} onValueChange={(v) => setNewDoc({ ...newDoc, category: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="financials">Financials</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                  <SelectItem value="photos">Photos</SelectItem>
                  <SelectItem value="reports">Reports</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDoc(false)}>Cancel</Button>
            <Button onClick={handleAddDocument} disabled={!newDoc.listing_id || !newDoc.document_name}>
              Add Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.type === "reg" ? "Registration" : "Document"}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
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
