import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Phone, Lock, Save, TrendingUp, DollarSign, Building2, Calendar, FileText, ExternalLink, Home, FolderOpen, Users, Check, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useAgentTransactions } from "@/hooks/useAgentTransactions";
import { useAgentCommissions } from "@/hooks/useAgentCommissions";
import { formatResidentialRent, formatFullCurrency, formatCommercialPricing } from "@/lib/formatters";
import { useGmailConnection, useConnectGmail, useDisconnectGmail } from "@/hooks/useGmail";
import { useDriveConnection, useConnectDrive, useDisconnectDrive } from "@/hooks/useGoogleDrive";
import { useContactsConnection, useConnectContacts, useDisconnectContacts } from "@/hooks/useGoogleContacts";
import { useGoogleCalendarConnection, useConnectGoogleCalendar, useDisconnectGoogleCalendar } from "@/hooks/useGoogleCalendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

  // Password change state
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Fetch agent transactions
  const { data: transactions, isLoading: transactionsLoading } = useAgentTransactions();
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
      <div className="min-h-screen pb-24 md:pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="grid gap-6 lg:grid-cols-3">
            <Skeleton className="h-64 lg:col-span-2" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 md:pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Agent Header with Photo */}
        <Card className="glass-card border-white/10 mb-8">
          <CardContent className="pt-8 pb-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Agent Photo */}
              <Avatar className="h-28 w-28 md:h-32 md:w-32 border-4 border-primary/20">
                <AvatarImage 
                  src={teamMember?.image_url || undefined} 
                  alt={displayName}
                  className="object-cover"
                />
                <AvatarFallback className="text-3xl md:text-4xl bg-primary/20 text-primary">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>

              {/* Agent Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-extralight text-foreground mb-1">
                  {displayName}
                </h1>
                <p className="text-lg text-primary mb-3">{displayTitle}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {user?.email}
                  </div>
                  {(teamMember?.phone || profile?.phone) && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {teamMember?.phone || profile?.phone}
                    </div>
                  )}
                  {teamMember?.category && (
                    <div className="flex items-center gap-2 px-2 py-0.5 bg-white/10 rounded-full text-xs">
                      {teamMember.category}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-2xl md:text-3xl font-light text-foreground">
                    {commissions.totalDeals}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Deals</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-2xl md:text-3xl font-light text-emerald-400">
                    {formatFullCurrency(commissions.totalEarnings)}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Earnings</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Commission Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Earnings</p>
                  <p className="text-xl font-light text-foreground">
                    {formatFullCurrency(commissions.totalEarnings)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">YTD Earnings</p>
                  <p className="text-xl font-light text-foreground">
                    {formatFullCurrency(commissions.ytdEarnings)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Deals</p>
                  <p className="text-xl font-light text-foreground">
                    {commissions.totalDeals}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">YTD Deals</p>
                  <p className="text-xl font-light text-foreground">
                    {commissions.ytdDeals}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Transactions Table */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-light flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Recent Transactions
                    </CardTitle>
                    <CardDescription>Your closed deals and commission history</CardDescription>
                  </div>
                  <Link to="/portal/my-transactions">
                    <Button variant="outline" size="sm" className="gap-2">
                      View All
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
                        {transactions.slice(0, 5).map((tx) => {
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
                                <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-muted-foreground">
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
                    {transactions.length > 5 && (
                      <div className="text-center mt-4">
                        <Link to="/portal/my-transactions">
                          <Button variant="ghost" size="sm">
                            View all {transactions.length} transactions →
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Building2 className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-muted-foreground">No transactions found</p>
                    <p className="text-sm text-muted-foreground/70">
                      Transactions will appear here once they're closed
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card className="glass-card border-white/10">
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
                    <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{user?.email}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Phone</Label>
                    <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{teamMember?.phone || profile?.phone || "Not set"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Password Change */}
            <Card className="glass-card border-white/10">
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

            {/* Connected Services */}
            <ConnectedServicesCard />
          </div>

          {/* Sidebar - Exclusives + Earnings */}
          <div className="space-y-6">
            {/* My Exclusives Section */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-light text-sm flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      My Exclusives
                    </CardTitle>
                    <CardDescription className="text-xs">
                      View your assigned listings & documents
                    </CardDescription>
                  </div>
                  <Link to="/portal/my-exclusives">
                    <Button variant="ghost" size="sm" className="text-xs">
                      View All →
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link
                  to="/portal/my-exclusives"
                  className="flex items-center justify-between p-3 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground">Document Center</span>
                  </div>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </Link>
                <a
                  href="https://streeteasy.com/profile/957575-bridge-advisory-group?tab_profile=active_listings"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Home className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm text-foreground">Residential (StreetEasy)</span>
                  </div>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </a>
              </CardContent>
            </Card>

            {commissions.byDivision.length > 0 && (
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="font-light text-sm">Earnings by Division</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {commissions.byDivision.map((div) => (
                    <div key={div.division} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <span className="text-sm text-foreground">{div.division}</span>
                        <p className="text-xs text-muted-foreground">{div.dealCount} deals</p>
                      </div>
                      <span className="text-sm font-medium text-emerald-400">
                        {formatFullCurrency(div.earnings)}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {commissions.byYear.length > 0 && (
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="font-light text-sm">Earnings by Year</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {commissions.byYear.map((year) => (
                    <div key={year.year} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <span className="text-sm text-foreground">{year.year}</span>
                        <p className="text-xs text-muted-foreground">{year.dealCount} deals</p>
                      </div>
                      <span className="text-sm font-medium text-emerald-400">
                        {formatFullCurrency(year.earnings)}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <Card className="glass-card border-white/10 border-dashed">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Active since</p>
                    <p className="text-sm font-light text-foreground">
                      {user?.created_at
                        ? new Date(user.created_at).toLocaleDateString('en-US', { 
                            month: 'long', 
                            year: 'numeric' 
                          })
                        : 'Unknown'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// Connected Services Component
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
      name: 'Calendar', 
      icon: Calendar, 
      connected: !!calendarConnection?.calendar_enabled,
      onConnect: () => connectCalendar.mutate(),
      onDisconnect: () => disconnectCalendar.mutate(),
      color: 'text-blue-400'
    },
    { 
      name: 'Gmail', 
      icon: Mail, 
      connected: gmailConnection?.isConnected,
      onConnect: () => connectGmail.mutate(),
      onDisconnect: () => disconnectGmail.mutate(),
      color: 'text-red-400'
    },
    { 
      name: 'Drive', 
      icon: FolderOpen, 
      connected: driveConnection?.isConnected,
      onConnect: () => connectDrive.mutate(),
      onDisconnect: () => disconnectDrive.mutate(),
      color: 'text-yellow-400'
    },
    { 
      name: 'Contacts', 
      icon: Users, 
      connected: contactsConnection?.connected || false,
      onConnect: () => connectContacts.mutate(),
      onDisconnect: () => disconnectContacts.mutate(),
      color: 'text-green-400'
    },
  ];

  return (
    <Card className="glass-card border-white/10">
      <CardHeader>
        <CardTitle className="font-light text-sm flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Connected Services
        </CardTitle>
        <CardDescription className="text-xs">
          Connect Google services to enhance your workflow
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <div key={service.name} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <Icon className={`h-4 w-4 ${service.color}`} />
                <span className="text-sm text-foreground">{service.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {service.connected ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-400" />
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
      </CardContent>
    </Card>
  );
};

export default Profile;
