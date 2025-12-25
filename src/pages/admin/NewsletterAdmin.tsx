import { useState } from "react";
import { useNewsletterAdmin } from "@/hooks/useNewsletterAdmin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Download, Trash2, Mail, Users, UserCheck, UserX } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

export default function NewsletterAdmin() {
  const { subscriptions, isLoading, toggleActive, deleteSubscription, exportEmails } = useNewsletterAdmin();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const filteredSubscriptions = subscriptions?.filter((sub) => {
    const matchesSearch = sub.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && sub.is_active) ||
      (filterStatus === "inactive" && !sub.is_active);
    return matchesSearch && matchesStatus;
  });

  const activeCount = subscriptions?.filter((s) => s.is_active).length || 0;
  const inactiveCount = subscriptions?.filter((s) => !s.is_active).length || 0;

  const handleExport = () => {
    const emails = exportEmails();
    if (!emails) {
      toast({ title: "No active subscribers to export" });
      return;
    }

    const blob = new Blob([emails], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter-subscribers.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: `Exported ${activeCount} active subscribers` });
  };

  const handleCopyEmails = () => {
    const emails = exportEmails();
    if (!emails) {
      toast({ title: "No active subscribers to copy" });
      return;
    }

    navigator.clipboard.writeText(emails);
    toast({ title: `Copied ${activeCount} emails to clipboard` });
  };

  const handleDelete = () => {
    if (deleteTarget) {
      deleteSubscription.mutate(deleteTarget);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Newsletter Subscribers</h1>
        <p className="text-muted-foreground mt-1">
          Manage email newsletter subscriptions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{subscriptions?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Total Subscribers</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-500/10">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{activeCount}</div>
                <div className="text-sm text-muted-foreground">Active</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-gray-500/10">
                <UserX className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{inactiveCount}</div>
                <div className="text-sm text-muted-foreground">Unsubscribed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>All Subscribers</CardTitle>
            <CardDescription>
              Manage newsletter subscriptions
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCopyEmails}>
              <Mail className="h-4 w-4 mr-2" />
              Copy Emails
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("all")}
              >
                All
              </Button>
              <Button
                variant={filterStatus === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("active")}
              >
                Active
              </Button>
              <Button
                variant={filterStatus === "inactive" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("inactive")}
              >
                Unsubscribed
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : !filteredSubscriptions?.length ? (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No subscribers found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Subscribed</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscriptions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">{sub.email}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(sub.subscribed_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={sub.is_active}
                          onCheckedChange={(checked) =>
                            toggleActive.mutate({ id: sub.id, is_active: checked })
                          }
                        />
                        <Badge variant={sub.is_active ? "default" : "secondary"}>
                          {sub.is_active ? "Active" : "Unsubscribed"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTarget(sub.id)}
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

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subscriber?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this email from the subscriber list.
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
