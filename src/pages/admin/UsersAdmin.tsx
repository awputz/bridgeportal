import { useState } from "react";
import { useUserRolesAdmin } from "@/hooks/useUserRolesAdmin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Search, Shield, ShieldCheck, User, Plus, X, MoreHorizontal, Briefcase } from "lucide-react";
import { format } from "date-fns";

type AppRole = "admin" | "agent" | "investor" | "user";

const ROLE_COLORS: Record<AppRole, string> = {
  admin: "bg-red-500/10 text-red-600 border-red-200",
  agent: "bg-blue-500/10 text-blue-600 border-blue-200",
  investor: "bg-amber-500/10 text-amber-600 border-amber-200",
  user: "bg-gray-500/10 text-gray-600 border-gray-200",
};

const ROLE_ICONS: Record<AppRole, React.ComponentType<{ className?: string }>> = {
  admin: ShieldCheck,
  agent: Shield,
  investor: Briefcase,
  user: User,
};

export default function UsersAdmin() {
  const { users, isLoading, addRole, removeRole } = useUserRolesAdmin();
  const [search, setSearch] = useState("");
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "add" | "remove";
    userId: string;
    role: AppRole;
    userName: string;
  } | null>(null);

  const filteredUsers = users?.filter(
    (user) =>
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddRole = (userId: string, role: AppRole, userName: string) => {
    setConfirmDialog({ open: true, type: "add", userId, role, userName });
  };

  const handleRemoveRole = (userId: string, role: AppRole, userName: string) => {
    setConfirmDialog({ open: true, type: "remove", userId, role, userName });
  };

  const confirmAction = () => {
    if (!confirmDialog) return;
    
    if (confirmDialog.type === "add") {
      addRole.mutate({ userId: confirmDialog.userId, role: confirmDialog.role });
    } else {
      removeRole.mutate({ userId: confirmDialog.userId, role: confirmDialog.role });
    }
    setConfirmDialog(null);
  };

  const getAvailableRoles = (currentRoles: Array<{ role: AppRole }>) => {
    const existingRoles = currentRoles.map((r) => r.role);
    return (["admin", "agent", "investor", "user"] as const).filter((r) => !existingRoles.includes(r));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage user roles and permissions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            View and manage user roles. Admins have full access, agents can access the portal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email or name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className={ROLE_COLORS.admin}>
                <ShieldCheck className="h-3 w-3 mr-1" />
                Admin
              </Badge>
              <Badge variant="outline" className={ROLE_COLORS.agent}>
                <Shield className="h-3 w-3 mr-1" />
                Agent
              </Badge>
              <Badge variant="outline" className={ROLE_COLORS.user}>
                <User className="h-3 w-3 mr-1" />
                User
              </Badge>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading users...</div>
          ) : !filteredUsers?.length ? (
            <div className="text-center py-8 text-muted-foreground">No users found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => {
                  const availableRoles = getAvailableRoles(user.roles);
                  
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.full_name || "No name"}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.roles.length === 0 ? (
                            <span className="text-muted-foreground text-sm">No roles</span>
                          ) : (
                            user.roles.map((r) => {
                              const Icon = ROLE_ICONS[r.role];
                              return (
                                <Badge
                                  key={r.role}
                                  variant="outline"
                                  className={`${ROLE_COLORS[r.role]} cursor-pointer group`}
                                  onClick={() => handleRemoveRole(user.id, r.role, user.full_name || user.email)}
                                >
                                  <Icon className="h-3 w-3 mr-1" />
                                  {r.role}
                                  <X className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Badge>
                              );
                            })
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.created_at
                          ? format(new Date(user.created_at), "MMM d, yyyy")
                          : "—"}
                      </TableCell>
                      <TableCell>
                        {availableRoles.length > 0 && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Plus className="h-4 w-4 mr-1" />
                                Add Role
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {availableRoles.map((role) => {
                                const Icon = ROLE_ICONS[role];
                                return (
                                  <DropdownMenuItem
                                    key={role}
                                    onClick={() => handleAddRole(user.id, role, user.full_name || user.email)}
                                  >
                                    <Icon className="h-4 w-4 mr-2" />
                                    Add {role}
                                  </DropdownMenuItem>
                                );
                              })}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!confirmDialog?.open} onOpenChange={() => setConfirmDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog?.type === "add" ? "Add Role" : "Remove Role"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog?.type === "add"
                ? `Are you sure you want to add the "${confirmDialog?.role}" role to ${confirmDialog?.userName}?`
                : `Are you sure you want to remove the "${confirmDialog?.role}" role from ${confirmDialog?.userName}?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction}>
              {confirmDialog?.type === "add" ? "Add Role" : "Remove Role"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
