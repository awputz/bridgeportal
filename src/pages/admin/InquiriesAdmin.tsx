import { useState, useMemo } from "react";
import { useInquiries, useDeleteInquiry, useUpdateInquiry, useMarkAsContacted, Inquiry, InquiryStatus } from "@/hooks/useInquiries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Eye, Search, Loader2, Mail, Phone, CheckCircle, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { DataTablePagination } from "@/components/admin/DataTablePagination";
import { usePagination } from "@/hooks/usePagination";

type SortDirection = "asc" | "desc" | null;

const STATUS_CONFIG: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  new: { label: "New", variant: "default" },
  contacted: { label: "Contacted", variant: "secondary" },
  qualified: { label: "Qualified", variant: "outline" },
  converted: { label: "Converted", variant: "default" },
  closed: { label: "Closed", variant: "destructive" },
};

const InquiriesAdmin = () => {
  const { data: inquiries, isLoading } = useInquiries();
  const deleteInquiry = useDeleteInquiry();
  const updateInquiry = useUpdateInquiry();
  const markAsContacted = useMarkAsContacted();
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [followUpNotes, setFollowUpNotes] = useState("");
  
  // Sorting state
  const [sortKey, setSortKey] = useState<string | null>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortKey(null);
        setSortDirection(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedInquiries = useMemo(() => {
    let filtered = inquiries?.filter((inquiry) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        inquiry.name.toLowerCase().includes(searchLower) ||
        inquiry.email.toLowerCase().includes(searchLower) ||
        inquiry.inquiry_type?.toLowerCase().includes(searchLower) ||
        inquiry.property_address?.toLowerCase().includes(searchLower);
      
      const matchesStatus = statusFilter === "all" || inquiry.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    }) || [];

    if (sortKey && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortKey as keyof Inquiry];
        const bValue = b[sortKey as keyof Inquiry];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        let comparison = 0;
        if (typeof aValue === "string" && typeof bValue === "string") {
          comparison = aValue.localeCompare(bValue);
        } else {
          comparison = String(aValue).localeCompare(String(bValue));
        }

        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return filtered;
  }, [inquiries, search, statusFilter, sortKey, sortDirection]);

  const {
    paginatedData,
    currentPage,
    totalPages,
    pageSize,
    totalItems,
    handlePageChange,
    handlePageSizeChange,
  } = usePagination(filteredAndSortedInquiries, 10);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this inquiry?")) {
      await deleteInquiry.mutateAsync(id);
    }
  };

  const handleMarkAsContacted = async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await markAsContacted.mutateAsync({ id, userId: user.id });
    }
  };

  const handleStatusChange = async (id: string, status: InquiryStatus) => {
    await updateInquiry.mutateAsync({ id, updates: { status } });
  };

  const handleSaveFollowUpNotes = async () => {
    if (selectedInquiry) {
      await updateInquiry.mutateAsync({
        id: selectedInquiry.id,
        updates: { follow_up_notes: followUpNotes },
      });
      setSelectedInquiry({ ...selectedInquiry, follow_up_notes: followUpNotes });
    }
  };

  const openInquiryDialog = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setFollowUpNotes(inquiry.follow_up_notes || "");
  };

  const SortHeader = ({ 
    children, 
    sortKeyName 
  }: { 
    children: React.ReactNode; 
    sortKeyName: string;
  }) => (
    <TableHead 
      className="cursor-pointer select-none hover:bg-muted/50"
      onClick={() => handleSort(sortKeyName)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortKey === sortKeyName && sortDirection === "asc" ? (
          <ArrowUp className="h-4 w-4" />
        ) : sortKey === sortKeyName && sortDirection === "desc" ? (
          <ArrowDown className="h-4 w-4" />
        ) : (
          <ArrowUpDown className="h-4 w-4 opacity-50" />
        )}
      </div>
    </TableHead>
  );

  const statusCounts = useMemo(() => {
    if (!inquiries) return {};
    return inquiries.reduce((acc, inquiry) => {
      const status = inquiry.status || "new";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [inquiries]);

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

      {/* Status Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={statusFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("all")}
        >
          All ({inquiries?.length || 0})
        </Button>
        {Object.entries(STATUS_CONFIG).map(([key, config]) => (
          <Button
            key={key}
            variant={statusFilter === key ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(key)}
          >
            {config.label} ({statusCounts[key] || 0})
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Inquiries ({totalItems})</CardTitle>
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
                <SortHeader sortKeyName="name">Name</SortHeader>
                <SortHeader sortKeyName="email">Email</SortHeader>
                <TableHead>Type</TableHead>
                <SortHeader sortKeyName="status">Status</SortHeader>
                <TableHead>Property</TableHead>
                <SortHeader sortKeyName="created_at">Date</SortHeader>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData?.map((inquiry) => (
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
                  <TableCell>
                    <Badge variant={STATUS_CONFIG[inquiry.status || "new"]?.variant || "default"}>
                      {STATUS_CONFIG[inquiry.status || "new"]?.label || "New"}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {inquiry.property_address || "-"}
                  </TableCell>
                  <TableCell>{format(new Date(inquiry.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {inquiry.status === "new" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMarkAsContacted(inquiry.id)}
                          title="Mark as Contacted"
                        >
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openInquiryDialog(inquiry)}
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
              {!paginatedData?.length && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No inquiries found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {totalItems > 0 && (
            <DataTablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
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

              {/* Status Select */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Status</p>
                <Select
                  value={selectedInquiry.status || "new"}
                  onValueChange={(value) => {
                    handleStatusChange(selectedInquiry.id, value as InquiryStatus);
                    setSelectedInquiry({ ...selectedInquiry, status: value });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

              {/* Follow-up Notes */}
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-2">Follow-up Notes</p>
                <Textarea
                  value={followUpNotes}
                  onChange={(e) => setFollowUpNotes(e.target.value)}
                  placeholder="Add notes about this inquiry..."
                  rows={3}
                />
                <Button 
                  size="sm" 
                  className="mt-2"
                  onClick={handleSaveFollowUpNotes}
                  disabled={updateInquiry.isPending}
                >
                  Save Notes
                </Button>
              </div>

              {/* Contact History */}
              {selectedInquiry.contacted_at && (
                <div className="text-sm text-muted-foreground border-t pt-4">
                  <p>Contacted on {format(new Date(selectedInquiry.contacted_at), "MMMM d, yyyy 'at' h:mm a")}</p>
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
