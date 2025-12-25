import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { 
  useAllCRMContacts, 
  useAllCRMDeals, 
  useAllCRMActivities,
  useAdminCRMStats 
} from "@/hooks/useCRMAdmin";
import { useAgentsList } from "@/hooks/useAgentMetrics";
import { AgentDisplay } from "@/components/admin/AgentDisplay";
import { Search, Users, Briefcase, Activity, DollarSign, Filter } from "lucide-react";
import { format } from "date-fns";

const formatCurrency = (value: number | null) => {
  if (!value) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const DIVISION_COLORS: Record<string, string> = {
  "Investment Sales": "bg-blue-100 text-blue-700",
  "Commercial Leasing": "bg-purple-100 text-purple-700",
  "Residential": "bg-green-100 text-green-700",
};

export default function CRMOverviewAdmin() {
  const [searchContacts, setSearchContacts] = useState("");
  const [searchDeals, setSearchDeals] = useState("");
  const [searchActivities, setSearchActivities] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<string>("all");

  const { data: contacts, isLoading: loadingContacts } = useAllCRMContacts();
  const { data: deals, isLoading: loadingDeals } = useAllCRMDeals();
  const { data: activities, isLoading: loadingActivities } = useAllCRMActivities();
  const { data: stats } = useAdminCRMStats();
  const { data: agents } = useAgentsList();

  // Filter by agent first
  const agentFilteredContacts = selectedAgent === "all" 
    ? contacts 
    : contacts?.filter(c => c.agent_id === selectedAgent);
  
  const agentFilteredDeals = selectedAgent === "all"
    ? deals
    : deals?.filter(d => d.agent_id === selectedAgent);
  
  const agentFilteredActivities = selectedAgent === "all"
    ? activities
    : activities?.filter(a => a.agent_id === selectedAgent);

  // Then filter by search
  const filteredContacts = agentFilteredContacts?.filter(c =>
    c.full_name.toLowerCase().includes(searchContacts.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchContacts.toLowerCase()) ||
    c.company?.toLowerCase().includes(searchContacts.toLowerCase()) ||
    c.agent_name?.toLowerCase().includes(searchContacts.toLowerCase())
  );

  const filteredDeals = agentFilteredDeals?.filter(d =>
    d.property_address.toLowerCase().includes(searchDeals.toLowerCase()) ||
    d.agent_name?.toLowerCase().includes(searchDeals.toLowerCase()) ||
    d.contact?.full_name?.toLowerCase().includes(searchDeals.toLowerCase())
  );

  const filteredActivities = agentFilteredActivities?.filter(a =>
    a.title.toLowerCase().includes(searchActivities.toLowerCase()) ||
    a.agent_name?.toLowerCase().includes(searchActivities.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">CRM Overview</h1>
        <p className="text-muted-foreground mt-1">
          View all agent contacts, deals, and activities
        </p>
      </div>

      {/* Agent Filter */}
      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg border">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter by Agent:</span>
        </div>
        <Select value={selectedAgent} onValueChange={setSelectedAgent}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="All Agents" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Agents</SelectItem>
            {agents?.map((agent) => (
              <SelectItem key={agent.id} value={agent.id}>
                {agent.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedAgent !== "all" && (
          <button
            onClick={() => setSelectedAgent("all")}
            className="text-sm text-muted-foreground hover:text-foreground underline"
          >
            Clear filter
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.totalContacts || 0}</p>
                <p className="text-sm text-muted-foreground">Total Contacts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Briefcase className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.activeDeals || 0}</p>
                <p className="text-sm text-muted-foreground">Active Deals</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Activity className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.pendingActivities || 0}</p>
                <p className="text-sm text-muted-foreground">Pending Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <DollarSign className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(stats?.pipelineValue || 0)}</p>
                <p className="text-sm text-muted-foreground">Pipeline Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="contacts">
        <TabsList>
          <TabsTrigger value="contacts">
            Contacts ({filteredContacts?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="deals">
            Deals ({filteredDeals?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="activities">
            Activities ({filteredActivities?.length || 0})
          </TabsTrigger>
        </TabsList>

        {/* Contacts Tab */}
        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle>All Agent Contacts</CardTitle>
              <CardDescription>Contacts across all agents and divisions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative max-w-sm mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search contacts..."
                  value={searchContacts}
                  onChange={(e) => setSearchContacts(e.target.value)}
                  className="pl-9"
                />
              </div>
              {loadingContacts ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : !filteredContacts?.length ? (
                <div className="text-center py-8 text-muted-foreground">No contacts found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contact</TableHead>
                      <TableHead>Agent</TableHead>
                      <TableHead>Division</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContacts.slice(0, 100).map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{contact.full_name}</div>
                            {contact.email && (
                              <div className="text-sm text-muted-foreground">{contact.email}</div>
                            )}
                            {contact.company && (
                              <div className="text-sm text-muted-foreground">{contact.company}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <AgentDisplay 
                            name={contact.agent_name} 
                            email={contact.agent_email}
                            size="sm"
                          />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={DIVISION_COLORS[contact.division] || ""}>
                            {contact.division}
                          </Badge>
                        </TableCell>
                        <TableCell className="capitalize">{contact.contact_type}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(contact.created_at), "MMM d, yyyy")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deals Tab */}
        <TabsContent value="deals">
          <Card>
            <CardHeader>
              <CardTitle>All Agent Deals</CardTitle>
              <CardDescription>Pipeline deals across all agents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative max-w-sm mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search deals..."
                  value={searchDeals}
                  onChange={(e) => setSearchDeals(e.target.value)}
                  className="pl-9"
                />
              </div>
              {loadingDeals ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : !filteredDeals?.length ? (
                <div className="text-center py-8 text-muted-foreground">No deals found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Agent</TableHead>
                      <TableHead>Division</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Expected Close</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDeals.slice(0, 100).map((deal) => (
                      <TableRow key={deal.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{deal.property_address}</div>
                            {deal.contact?.full_name && (
                              <div className="text-sm text-muted-foreground">
                                Contact: {deal.contact.full_name}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <AgentDisplay 
                            name={deal.agent_name} 
                            email={deal.agent_email}
                            size="sm"
                          />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={DIVISION_COLORS[deal.division] || ""}>
                            {deal.division}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {deal.stage && (
                            <Badge 
                              variant="outline" 
                              style={{ 
                                borderColor: deal.stage.color,
                                color: deal.stage.color 
                              }}
                            >
                              {deal.stage.name}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(deal.value)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {deal.expected_close 
                            ? format(new Date(deal.expected_close), "MMM d, yyyy")
                            : "—"
                          }
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <CardTitle>All Agent Activities</CardTitle>
              <CardDescription>Recent activities and tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative max-w-sm mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search activities..."
                  value={searchActivities}
                  onChange={(e) => setSearchActivities(e.target.value)}
                  className="pl-9"
                />
              </div>
              {loadingActivities ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : !filteredActivities?.length ? (
                <div className="text-center py-8 text-muted-foreground">No activities found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Activity</TableHead>
                      <TableHead>Agent</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Related To</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredActivities.slice(0, 100).map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell>
                          <div className="font-medium">{activity.title}</div>
                          {activity.description && (
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {activity.description}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <AgentDisplay 
                            name={activity.agent_name} 
                            email={activity.agent_email}
                            size="sm"
                          />
                        </TableCell>
                        <TableCell className="capitalize">{activity.activity_type}</TableCell>
                        <TableCell>
                          <Badge variant={activity.is_completed ? "default" : "outline"}>
                            {activity.is_completed ? "Completed" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {activity.contact?.full_name || activity.deal?.property_address || "—"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(activity.created_at), "MMM d, yyyy")}
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
    </div>
  );
}
