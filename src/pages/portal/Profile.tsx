import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Phone, Lock, Save, TrendingUp, DollarSign, Building2, Calendar, FileText, ExternalLink, Home, FolderOpen, Users, Check, Loader2, Bell, Settings, LayoutGrid, CreditCard, ChevronRight, ClipboardList, Clock, Wallet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAgentTransactions } from "@/hooks/useAgentTransactions";
import { useAgentCommissions } from "@/hooks/useAgentCommissions";
import { formatResidentialRent, formatFullCurrency, formatCommercialPricing } from "@/lib/formatters";
import { useGmailConnection, useConnectGmail, useDisconnectGmail } from "@/hooks/useGmail";
import { useDriveConnection, useConnectDrive, useDisconnectDrive } from "@/hooks/useGoogleDrive";
import { useContactsConnection, useConnectContacts, useDisconnectContacts } from "@/hooks/useGoogleContacts";
import { useGoogleCalendarConnection, useConnectGoogleCalendar, useDisconnectGoogleCalendar } from "@/hooks/useGoogleCalendar";
import ProfileNotificationsCard from "@/components/portal/ProfileNotificationsCard";
import { useMyAgentRequests } from "@/hooks/useMyAgentRequests";
import { useMyCommissions } from "@/hooks/useMyCommissions";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FinancialsOverview, IncomeTab, ExpensesTab } from "@/components/financials";

// Format deal value based on division
const formatDealValueByDivision = (tx: any): string => {
  const division = tx.division || 'Other';
  
  if (division === 'Residential') {
    if (tx.deal_type === 'Lease' && tx.monthly_rent) {
      return formatResidentialRent(tx.monthly_rent);
    }
    return formatFullCurrency(tx.sale_price || tx.monthly_rent);
  }
  
  if (division === 'Commercial') {
    if (tx.deal_type === 'Lease') {
      if (tx.price_per_sf && tx.gross_square_feet) {
        const pricing = formatCommercialPricing(tx.price_per_sf, tx.gross_square_feet);
        return `${pricing.pricePerSF} | ${pricing.totalSF}`;
      }
      if (tx.monthly_rent) {
        return `${formatFullCurrency(tx.monthly_rent)}/month`;
      }
    }
    return formatFullCurrency(tx.sale_price || tx.total_lease_value);
  }
  
  if (division === 'Investment Sales' || division === 'Capital Advisory') {
    return formatFullCurrency(tx.sale_price);
  }
  
  return formatFullCurrency(tx.sale_price || tx.total_lease_value || tx.monthly_rent);
};

interface TeamMember {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string | null;
  image_url: string | null;
  category: string;
}

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [teamMember, setTeamMember] = useState<TeamMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Password change state
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Fetch agent transactions and requests
  const { data: transactions, isLoading: transactionsLoading } = useAgentTransactions();
  const { data: agentRequests, isLoading: requestsLoading } = useMyAgentRequests();
  const { stats: commissionStats, isLoading: commissionStatsLoading } = useMyCommissions();
  const commissions = useAgentCommissions(transactions);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        
        // Get profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        
        setProfile(profileData);

        // Try to match with team_members by email
        if (user.email) {
          const { data: teamData } = await supabase
            .from("team_members")
            .select("id, name, title, email, phone, image_url, category")
            .eq("email", user.email)
            .eq("is_active", true)
            .single();
          
          if (teamData) {
            setTeamMember(teamData);
          }
        }
      }
      setIsLoading(false);
    };

    fetchUserData();
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setPasswordLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setPasswordLoading(false);

    if (error) {
      toast.error("Failed to update password: " + error.message);
    } else {
      toast.success("Password updated successfully");
      setNewPassword("");
      setConfirmPassword("");
      setIsChangingPassword(false);
    }
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = teamMember?.name || profile?.full_name || user?.email?.split("@")[0] || "Agent";
  const displayTitle = teamMember?.title || "Agent";

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
          <Skeleton className="h-10 w-48 mb-8" />
          <Skeleton className="h-48 w-full mb-6" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-5xl mx-auto page-content">
        {/* Compact Header Card */}
        <Card className="glass-card border-border/50 mb-6">
          <CardContent className="py-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              {/* Agent Photo */}
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-2 border-primary/20 flex-shrink-0">
                <AvatarImage 
                  src={teamMember?.image_url || undefined} 
                  alt={displayName}
                  className="object-cover"
                />
                <AvatarFallback className="text-2xl bg-primary/20 text-primary">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>

              {/* Agent Info */}
              <div className="flex-1 text-center sm:text-left min-w-0">
                <h1 className="text-2xl sm:text-3xl font-extralight text-foreground mb-1 truncate">
                  {displayName}
                </h1>
                <p className="text-sm text-primary mb-2">{displayTitle}</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Mail className="h-3 w-3" />
                    <span className="truncate max-w-[180px]">{user?.email}</span>
                  </div>
                  {(teamMember?.phone || profile?.phone) && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3 w-3" />
                      {teamMember?.phone || profile?.phone}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-4 sm:gap-6">
                <div className="text-center">
                  <p className="text-2xl font-light text-foreground">{commissions.totalDeals}</p>
                  <p className="text-xs text-muted-foreground">Deals</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-light text-emerald-400">
                    {formatFullCurrency(commissions.totalEarnings)}
                  </p>
                  <p className="text-xs text-muted-foreground">Earnings</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="overview" className="gap-2 text-xs sm:text-sm">
              <LayoutGrid className="h-4 w-4 hidden sm:block" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="financials" className="gap-2 text-xs sm:text-sm">
              <Wallet className="h-4 w-4 hidden sm:block" />
              Financials
            </TabsTrigger>
            <TabsTrigger value="transactions" className="gap-2 text-xs sm:text-sm">
              <CreditCard className="h-4 w-4 hidden sm:block" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="connections" className="gap-2 text-xs sm:text-sm">
              <Users className="h-4 w-4 hidden sm:block" />
              Connections
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2 text-xs sm:text-sm">
              <Settings className="h-4 w-4 hidden sm:block" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Commission Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="glass-card border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Total Earnings</p>
                      <p className="text-lg font-light text-foreground truncate">
                        {formatFullCurrency(commissions.totalEarnings)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">YTD Earnings</p>
                      <p className="text-lg font-light text-foreground truncate">
                        {formatFullCurrency(commissions.ytdEarnings)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-5 w-5 text-purple-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Total Deals</p>
                      <p className="text-lg font-light text-foreground">
                        {commissions.totalDeals}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-5 w-5 text-amber-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">YTD Deals</p>
                      <p className="text-lg font-light text-foreground">
                        {commissions.ytdDeals}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-3">
              <Link
                to="/portal/commission-request"
                className="glass-card p-5 group hover:border-white/20"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <DollarSign className="h-5 w-5 text-emerald-400" />
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-sm font-medium text-foreground mb-1">Submit Commission Request</h3>
                <p className="text-xs text-muted-foreground">Request payment for closed deals</p>
              </Link>

              <Link
                to="/portal/my-commission-requests"
                className="glass-card p-5 group hover:border-white/20"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CreditCard className="h-5 w-5 text-green-400" />
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-sm font-medium text-foreground mb-1">My Payments</h3>
                <p className="text-xs text-muted-foreground">Track your payment requests</p>
              </Link>

              <Link
                to="/portal/my-transactions"
                className="glass-card p-5 group hover:border-white/20"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="h-5 w-5 text-blue-400" />
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-sm font-medium text-foreground mb-1">Transaction History</h3>
                <p className="text-xs text-muted-foreground">View your complete deal history</p>
              </Link>
            </div>

            {/* Pending Payments & My Requests */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Pending Payments Widget */}
              <Card className="glass-card border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-light text-base flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-emerald-400" />
                      Pending Payments
                    </CardTitle>
                    <Link to="/portal/my-commission-requests">
                      <Button variant="ghost" size="sm" className="text-xs">
                        View All →
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {commissionStatsLoading ? (
                    <div className="space-y-2">
                      {[...Array(2)].map((_, i) => (
                        <Skeleton key={i} className="h-14 w-full" />
                      ))}
                    </div>
                  ) : commissionStats.pendingRequests.length > 0 ? (
                    <div className="space-y-2">
                      {commissionStats.pendingRequests.slice(0, 3).map((req) => (
                        <div key={req.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground truncate">{req.property_address}</p>
                            <p className="text-xs text-muted-foreground">
                              Submitted {format(new Date(req.created_at), "MMM d, yyyy")}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1 ml-2">
                            <span className="text-sm font-medium text-emerald-400">
                              {formatFullCurrency(req.commission_amount)}
                            </span>
                            <Badge 
                              variant="outline" 
                              className={`text-[10px] px-1.5 py-0 ${
                                req.status === "approved" 
                                  ? "border-green-500/50 text-green-400" 
                                  : req.status === "under_review" 
                                    ? "border-blue-500/50 text-blue-400" 
                                    : "border-amber-500/50 text-amber-400"
                              }`}
                            >
                              {req.status === "under_review" ? "Under Review" : req.status === "approved" ? "Approved" : "Pending"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Check className="h-8 w-8 text-emerald-400/50 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No pending payments</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* My Requests Widget */}
              <Card className="glass-card border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-light text-base flex items-center gap-2">
                      <ClipboardList className="h-4 w-4 text-blue-400" />
                      My Requests
                    </CardTitle>
                    <Link to="/portal/requests">
                      <Button variant="ghost" size="sm" className="text-xs">
                        View All →
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {requestsLoading ? (
                    <div className="space-y-2">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-14 w-full" />
                      ))}
                    </div>
                  ) : agentRequests && agentRequests.length > 0 ? (
                    <div className="space-y-2">
                      {agentRequests.slice(0, 3).map((req) => (
                        <div key={req.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground">{req.request_type}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(new Date(req.created_at), "MMM d, yyyy")}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ml-2">
                            <Badge 
                              variant="outline" 
                              className={`text-[10px] px-1.5 py-0 ${
                                req.priority === "urgent" 
                                  ? "border-red-500/50 text-red-400" 
                                  : "border-muted-foreground/30 text-muted-foreground"
                              }`}
                            >
                              {req.priority}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className={`text-[10px] px-1.5 py-0 ${
                                req.status === "completed" 
                                  ? "border-green-500/50 text-green-400" 
                                  : req.status === "in_progress" 
                                    ? "border-blue-500/50 text-blue-400" 
                                    : "border-amber-500/50 text-amber-400"
                              }`}
                            >
                              {req.status === "in_progress" ? "In Progress" : req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <ClipboardList className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No requests submitted</p>
                      <Link to="/portal/requests" className="text-xs text-primary hover:underline mt-1 inline-block">
                        Submit a request →
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity & Earnings Breakdown */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Recent Transactions Preview */}
              <Card className="glass-card border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-light text-base flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Recent Transactions
                    </CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => setActiveTab("transactions")}
                    >
                      View All →
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {transactionsLoading ? (
                    <div className="space-y-2">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : transactions && transactions.length > 0 ? (
                    <div className="space-y-2">
                      {transactions.slice(0, 3).map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground truncate">{tx.property_address}</p>
                            <p className="text-xs text-muted-foreground">{tx.division}</p>
                          </div>
                          <span className="text-sm font-medium text-emerald-400 ml-2">
                            {tx.commission ? formatFullCurrency(tx.commission) : "—"}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Building2 className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No transactions yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Earnings by Division */}
              <Card className="glass-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="font-light text-base">Earnings by Division</CardTitle>
                </CardHeader>
                <CardContent>
                  {commissions.byDivision.length > 0 ? (
                    <div className="space-y-2">
                      {commissions.byDivision.map((div) => (
                        <div key={div.division} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div>
                            <span className="text-sm text-foreground">{div.division}</span>
                            <p className="text-xs text-muted-foreground">{div.dealCount} deals</p>
                          </div>
                          <span className="text-sm font-medium text-emerald-400">
                            {formatFullCurrency(div.earnings)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <TrendingUp className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No earnings data yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* My Exclusives Quick Link */}
            <Card className="glass-card border-border/50">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">My Exclusives</p>
                      <p className="text-xs text-muted-foreground">View your listings & documents</p>
                    </div>
                  </div>
                  <Link to="/portal/my-exclusives">
                    <Button variant="outline" size="sm" className="gap-2">
                      View All
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financials Tab */}
          <TabsContent value="financials" className="space-y-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full max-w-md">
                <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                <TabsTrigger value="income" className="flex-1">Income</TabsTrigger>
                <TabsTrigger value="expenses" className="flex-1">Expenses</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <FinancialsOverview />
              </TabsContent>
              
              <TabsContent value="income" className="mt-6">
                <IncomeTab />
              </TabsContent>
              
              <TabsContent value="expenses" className="mt-6">
                <ExpensesTab />
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card className="glass-card border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-light flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      All Transactions
                    </CardTitle>
                    <CardDescription>Your complete deal history</CardDescription>
                  </div>
                  <Link to="/portal/my-transactions">
                    <Button variant="outline" size="sm" className="gap-2">
                      Full View
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {transactionsLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : transactions && transactions.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border/50">
                          <TableHead className="text-muted-foreground">Address</TableHead>
                          <TableHead className="text-muted-foreground">Division</TableHead>
                          <TableHead className="text-muted-foreground">Deal Value</TableHead>
                          <TableHead className="text-muted-foreground text-right">Commission</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map((tx) => {
                          const hasActualCommission = tx.commission !== null && tx.commission !== undefined && tx.commission > 0;
                          const commissionDisplay = hasActualCommission 
                            ? formatFullCurrency(tx.commission as number)
                            : "—";
                          return (
                            <TableRow key={tx.id} className="border-border/30">
                              <TableCell className="font-medium text-foreground">
                                <div>
                                  <p className="truncate max-w-[200px]">{tx.property_address}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {[tx.neighborhood, tx.borough].filter(Boolean).join(", ") || 
                                     (tx.closing_date ? new Date(tx.closing_date).toLocaleDateString() : '')}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                                  {tx.division || 'Other'}
                                </span>
                              </TableCell>
                              <TableCell className="text-foreground">
                                {formatDealValueByDivision(tx)}
                              </TableCell>
                              <TableCell className="text-right font-medium text-emerald-400">
                                {commissionDisplay}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Building2 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-muted-foreground">No transactions found</p>
                    <p className="text-sm text-muted-foreground/70">
                      Transactions will appear here once they're closed
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Earnings by Year */}
            {commissions.byYear.length > 0 && (
              <Card className="glass-card border-border/50">
                <CardHeader>
                  <CardTitle className="font-light text-base">Earnings by Year</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {commissions.byYear.map((year) => (
                      <div key={year.year} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                        <div>
                          <span className="text-lg font-light text-foreground">{year.year}</span>
                          <p className="text-xs text-muted-foreground">{year.dealCount} deals</p>
                        </div>
                        <span className="text-lg font-medium text-emerald-400">
                          {formatFullCurrency(year.earnings)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Connections Tab */}
          <TabsContent value="connections" className="space-y-6">
            <ConnectedServicesCard />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            {/* Account Info */}
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="font-light flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Email</Label>
                    <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{user?.email}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Phone</Label>
                    <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{teamMember?.phone || profile?.phone || "Not set"}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Member Since</Label>
                  <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">
                      {user?.created_at
                        ? new Date(user.created_at).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric',
                            year: 'numeric' 
                          })
                        : 'Unknown'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Password Change */}
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="font-light flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Security
                </CardTitle>
                <CardDescription>Change your password</CardDescription>
              </CardHeader>
              <CardContent>
                {isChangingPassword ? (
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        required
                        minLength={8}
                      />
                      <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        required
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setIsChangingPassword(false);
                          setNewPassword("");
                          setConfirmPassword("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={passwordLoading}>
                        {passwordLoading ? "Updating..." : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Update Password
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <Button variant="outline" onClick={() => setIsChangingPassword(true)}>
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Notifications */}
            <ProfileNotificationsCard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Connected Services Component - Now Full Width
const ConnectedServicesCard = () => {
  const { data: calendarConnection } = useGoogleCalendarConnection();
  const { data: gmailConnection } = useGmailConnection();
  const { data: driveConnection } = useDriveConnection();
  const { data: contactsConnection } = useContactsConnection();
  
  const connectCalendar = useConnectGoogleCalendar();
  const disconnectCalendar = useDisconnectGoogleCalendar();
  const connectGmail = useConnectGmail();
  const disconnectGmail = useDisconnectGmail();
  const connectDrive = useConnectDrive();
  const disconnectDrive = useDisconnectDrive();
  const connectContacts = useConnectContacts();
  const disconnectContacts = useDisconnectContacts();

  const services = [
    { 
      name: 'Google Calendar', 
      description: 'Sync your calendar events',
      icon: Calendar, 
      connected: !!calendarConnection?.calendar_enabled,
      onConnect: () => connectCalendar.mutate(),
      onDisconnect: () => disconnectCalendar.mutate(),
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    { 
      name: 'Gmail', 
      description: 'Access your email inbox',
      icon: Mail, 
      connected: gmailConnection?.isConnected,
      onConnect: () => connectGmail.mutate(),
      onDisconnect: () => disconnectGmail.mutate(),
      color: 'text-red-400',
      bgColor: 'bg-red-500/20'
    },
    { 
      name: 'Google Drive', 
      description: 'Access your files and documents',
      icon: FolderOpen, 
      connected: driveConnection?.isConnected,
      onConnect: () => connectDrive.mutate(),
      onDisconnect: () => disconnectDrive.mutate(),
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20'
    },
    { 
      name: 'Google Contacts', 
      description: 'Sync your contacts with CRM',
      icon: Users, 
      connected: contactsConnection?.connected || false,
      onConnect: () => connectContacts.mutate(),
      onDisconnect: () => disconnectContacts.mutate(),
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
  ];

  return (
    <Card className="glass-card border-border/50">
      <CardHeader>
        <CardTitle className="font-light flex items-center gap-2">
          <Users className="h-5 w-5" />
          Google Workspace Connections
        </CardTitle>
        <CardDescription>
          Connect Google services to enhance your workflow
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div key={service.name} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${service.bgColor} flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${service.color}`} />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-foreground">{service.name}</span>
                    <p className="text-xs text-muted-foreground">{service.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {service.connected ? (
                    <>
                      <div className="flex items-center gap-1 text-emerald-400">
                        <Check className="h-4 w-4" />
                        <span className="text-xs">Connected</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-muted-foreground hover:text-destructive"
                        onClick={service.onDisconnect}
                      >
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={service.onConnect}
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default Profile;
