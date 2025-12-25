import { useState } from "react";
import { useInquiries, useDeleteInquiry, Inquiry } from "@/hooks/useInquiries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Trash2, Eye, Search, Loader2, Mail, Phone } from "lucide-react";
import { format } from "date-fns";

const InquiriesAdmin = () => {
  const { data: inquiries, isLoading } = useInquiries();
  const deleteInquiry = useDeleteInquiry();
  const [search, setSearch] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  const filteredInquiries = inquiries?.filter((inquiry) => {
    const searchLower = search.toLowerCase();
    return (
      inquiry.name.toLowerCase().includes(searchLower) ||
      inquiry.email.toLowerCase().includes(searchLower) ||
      inquiry.inquiry_type?.toLowerCase().includes(searchLower) ||
      inquiry.property_address?.toLowerCase().includes(searchLower)
    );
  });

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this inquiry?")) {
      await deleteInquiry.mutateAsync(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Inquiries</h1>
        <p className="text-muted-foreground">View and manage contact form submissions</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Inquiries ({filteredInquiries?.length || 0})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inquiries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInquiries?.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell className="font-medium">{inquiry.name}</TableCell>
                  <TableCell>{inquiry.email}</TableCell>
                  <TableCell>
                    {inquiry.inquiry_type && (
                      <Badge variant="secondary" className="capitalize">
                        {inquiry.inquiry_type}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {inquiry.property_address || "-"}
                  </TableCell>
                  <TableCell>{format(new Date(inquiry.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedInquiry(inquiry)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(inquiry.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!filteredInquiries?.length && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No inquiries found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Inquiry Details</DialogTitle>
          </DialogHeader>
          {selectedInquiry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{selectedInquiry.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium capitalize">{selectedInquiry.inquiry_type || "-"}</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <a
                  href={`mailto:${selectedInquiry.email}`}
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  {selectedInquiry.email}
                </a>
                {selectedInquiry.phone && (
                  <a
                    href={`tel:${selectedInquiry.phone}`}
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <Phone className="h-4 w-4" />
                    {selectedInquiry.phone}
                  </a>
                )}
              </div>

              {selectedInquiry.property_address && (
                <div>
                  <p className="text-sm text-muted-foreground">Property Address</p>
                  <p className="font-medium">{selectedInquiry.property_address}</p>
                </div>
              )}

              {selectedInquiry.neighborhoods && (
                <div>
                  <p className="text-sm text-muted-foreground">Neighborhoods</p>
                  <p className="font-medium">{selectedInquiry.neighborhoods}</p>
                </div>
              )}

              {selectedInquiry.budget && (
                <div>
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="font-medium">{selectedInquiry.budget}</p>
                </div>
              )}

              {selectedInquiry.timeline && (
                <div>
                  <p className="text-sm text-muted-foreground">Timeline</p>
                  <p className="font-medium">{selectedInquiry.timeline}</p>
                </div>
              )}

              {selectedInquiry.requirements && (
                <div>
                  <p className="text-sm text-muted-foreground">Requirements</p>
                  <p className="font-medium">{selectedInquiry.requirements}</p>
                </div>
              )}

              {selectedInquiry.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="font-medium whitespace-pre-wrap">{selectedInquiry.notes}</p>
                </div>
              )}

              <div className="text-sm text-muted-foreground pt-4 border-t">
                Submitted on {format(new Date(selectedInquiry.created_at), "MMMM d, yyyy 'at' h:mm a")}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InquiriesAdmin;
