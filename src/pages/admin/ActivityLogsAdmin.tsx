import { useState } from "react";
import { useActivityLogs } from "@/hooks/useActivityLogs";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Activity, Eye, Edit, Trash2, Plus, LogIn, LogOut, Settings } from "lucide-react";
import { format } from "date-fns";

const ACTION_CONFIG: Record<string, { label: string; color: string; icon: typeof Activity }> = {
  view: { label: "View", color: "bg-blue-100 text-blue-600", icon: Eye },
  create: { label: "Create", color: "bg-green-100 text-green-600", icon: Plus },
  update: { label: "Update", color: "bg-yellow-100 text-yellow-600", icon: Edit },
  delete: { label: "Delete", color: "bg-red-100 text-red-600", icon: Trash2 },
  login: { label: "Login", color: "bg-purple-100 text-purple-600", icon: LogIn },
  logout: { label: "Logout", color: "bg-gray-100 text-gray-600", icon: LogOut },
  settings: { label: "Settings", color: "bg-orange-100 text-orange-600", icon: Settings },
};

export default function ActivityLogsAdmin() {
  const { logs, isLoading } = useActivityLogs(500);
  const [search, setSearch] = useState("");
  const [filterAction, setFilterAction] = useState<string>("all");
  const [filterEntity, setFilterEntity] = useState<string>("all");

  // Get unique actions and entity types for filters
  const uniqueActions = [...new Set(logs?.map((l) => l.action) || [])];
  const uniqueEntities = [...new Set(logs?.map((l) => l.entity_type).filter(Boolean) || [])];

  const filteredLogs = logs?.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.entity_type?.toLowerCase().includes(search.toLowerCase()) ||
      log.entity_id?.toLowerCase().includes(search.toLowerCase()) ||
      JSON.stringify(log.details)?.toLowerCase().includes(search.toLowerCase());
    const matchesAction = filterAction === "all" || log.action === filterAction;
    const matchesEntity = filterEntity === "all" || log.entity_type === filterEntity;
    return matchesSearch && matchesAction && matchesEntity;
  });

  const getActionConfig = (action: string) => {
    const key = action.toLowerCase();
    for (const [k, v] of Object.entries(ACTION_CONFIG)) {
      if (key.includes(k)) return v;
    }
    return { label: action, color: "bg-gray-100 text-gray-600", icon: Activity };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Activity Logs</h1>
        <p className="text-muted-foreground mt-1">
          View the audit trail of all system actions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Activity</CardTitle>
          <CardDescription>
            Showing the last {logs?.length || 0} actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {uniqueActions.map((action) => (
                  <SelectItem key={action} value={action}>
                    {action}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterEntity} onValueChange={setFilterEntity}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entities</SelectItem>
                {uniqueEntities.map((entity) => (
                  <SelectItem key={entity} value={entity!}>
                    {entity}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading logs...</div>
          ) : !filteredLogs?.length ? (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No activity logs found</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="w-[120px]">IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => {
                    const actionConfig = getActionConfig(log.action);
                    const ActionIcon = actionConfig.icon;

                    return (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-sm text-muted-foreground">
                          {log.created_at
                            ? format(new Date(log.created_at), "MMM d, HH:mm:ss")
                            : "—"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={actionConfig.color}>
                            <ActionIcon className="h-3 w-3 mr-1" />
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {log.entity_type ? (
                            <div>
                              <div className="font-medium">{log.entity_type}</div>
                              {log.entity_id && (
                                <div className="text-xs text-muted-foreground font-mono">
                                  {log.entity_id.slice(0, 8)}...
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[300px]">
                          {log.details && Object.keys(log.details).length > 0 ? (
                            <pre className="text-xs text-muted-foreground bg-muted p-2 rounded overflow-x-auto">
                              {JSON.stringify(log.details, null, 2).slice(0, 200)}
                              {JSON.stringify(log.details).length > 200 && "..."}
                            </pre>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {log.ip_address || "—"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
