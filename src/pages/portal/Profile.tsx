import { useState, useEffect } from "react";
import { User, Mail, Phone, Lock, Save, CheckCircle, TrendingUp, DollarSign, Building2, Calendar, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useAgentTransactions } from "@/hooks/useAgentTransactions";
import { useAgentCommissions } from "@/hooks/useAgentCommissions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Use full number formatting - never abbreviate
const formatCurrency = (value: number) => {
  return `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
};

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
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
        
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        
        setProfile(profileData);
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-foreground mb-2">
            Agent Profile
          </h1>
          <p className="text-muted-foreground font-light">
            Your performance dashboard and account settings
          </p>
        </div>

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
                    {formatCurrency(commissions.totalEarnings)}
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
                    {formatCurrency(commissions.ytdEarnings)}
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
                <CardTitle className="font-light flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  My Transactions
                </CardTitle>
                <CardDescription>Your closed deals and commission history</CardDescription>
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
                        {transactions.slice(0, 10).map((tx) => {
                          const dealValue = tx.sale_price || tx.total_lease_value || tx.monthly_rent || 0;
                          // Use actual commission if available, otherwise show "—"
                          const hasActualCommission = tx.commission !== null && tx.commission !== undefined;
                          const commissionDisplay = hasActualCommission 
                            ? formatCurrency(tx.commission as number)
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
                                {formatCurrency(dealValue)}
                              </TableCell>
                              <TableCell className="text-right font-medium text-emerald-400">
                                {commissionDisplay}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                    {transactions.length > 10 && (
                      <p className="text-center text-sm text-muted-foreground mt-4">
                        Showing 10 of {transactions.length} transactions
                      </p>
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
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                  <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-light text-foreground">
                      {profile?.full_name || user?.email?.split("@")[0] || "Agent"}
                    </h3>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>

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
                      <span className="text-foreground">{profile?.phone || "Not set"}</span>
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
          </div>

          {/* Sidebar - Earnings by Division */}
          <div className="space-y-6">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="font-light text-sm">Earnings by Division</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {commissions.byDivision.length > 0 ? (
                  commissions.byDivision.map((div) => (
                    <div key={div.division} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <span className="text-sm text-foreground">{div.division}</span>
                        <p className="text-xs text-muted-foreground">{div.dealCount} deals</p>
                      </div>
                      <span className="text-sm font-medium text-emerald-400">
                        {formatCurrency(div.earnings)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No data yet</p>
                )}
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="font-light text-sm">Earnings by Year</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {commissions.byYear.length > 0 ? (
                  commissions.byYear.map((year) => (
                    <div key={year.year} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <span className="text-sm text-foreground">{year.year}</span>
                        <p className="text-xs text-muted-foreground">{year.dealCount} deals</p>
                      </div>
                      <span className="text-sm font-medium text-emerald-400">
                        {formatCurrency(year.earnings)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No data yet</p>
                )}
              </CardContent>
            </Card>

            <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 rounded-lg border border-green-500/20">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm text-green-400">Active</span>
              <span className="text-xs text-muted-foreground">
                since {new Date(user?.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
