import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Building2, Store, Eye, MapPin, DollarSign, Ruler, Home } from "lucide-react";
import { useInvestorListings, InvestorInvestmentListing, InvestorCommercialListing } from "@/hooks/useInvestorData";

export default function InvestorListings() {
  const [activeTab, setActiveTab] = useState("investment");
  const [selectedInvestment, setSelectedInvestment] = useState<InvestorInvestmentListing | null>(null);
  const [selectedCommercial, setSelectedCommercial] = useState<InvestorCommercialListing | null>(null);

  const { data: listings, isLoading } = useInvestorListings();

  const formatCurrency = (value: number | null) => {
    if (!value) return "—";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number | null) => {
    if (!value) return "—";
    return new Intl.NumberFormat("en-US").format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Active Listings</h1>
          <p className="text-muted-foreground mt-1">View all active investment and commercial listings</p>
        </div>
        <Badge variant="outline" className="w-fit">
          <Eye className="h-3 w-3 mr-1" />
          Read-only access
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">
              {(listings?.investment.length || 0) + (listings?.commercial.length || 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Listings</div>
          </CardContent>
        </Card>
        <Card className="bg-sky-500/5 border-sky-500/20">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-sky-500">{listings?.investment.length || 0}</div>
            <div className="text-sm text-muted-foreground">Investment Sales</div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-500/5 border-emerald-500/20">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-emerald-500">{listings?.commercial.length || 0}</div>
            <div className="text-sm text-muted-foreground">Commercial Leasing</div>
          </CardContent>
        </Card>
        <Card className="bg-purple-500/5 border-purple-500/20">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-500">
              {formatCurrency(
                listings?.investment.reduce((sum, l) => sum + (l.asking_price || 0), 0) || 0
              )}
            </div>
            <div className="text-sm text-muted-foreground">Total Ask (Investment)</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="investment" className="gap-2">
            <Building2 className="h-4 w-4" />
            Investment Sales
          </TabsTrigger>
          <TabsTrigger value="commercial" className="gap-2">
            <Store className="h-4 w-4" />
            Commercial Leasing
          </TabsTrigger>
        </TabsList>

        {/* Investment Listings Tab */}
        <TabsContent value="investment" className="mt-6">
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Investment Sales Listings ({listings?.investment.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : listings?.investment.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No investment listings</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/50">
                        <TableHead>Property</TableHead>
                        <TableHead>Asset Class</TableHead>
                        <TableHead className="text-right">Asking Price</TableHead>
                        <TableHead className="text-right">Units</TableHead>
                        <TableHead className="text-right">Cap Rate</TableHead>
                        <TableHead>Location</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {listings?.investment.map((listing) => (
                        <TableRow 
                          key={listing.id} 
                          className="border-border/30 cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedInvestment(listing)}
                        >
                          <TableCell className="font-medium text-foreground max-w-[200px] truncate">
                            {listing.property_address}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{listing.asset_class}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-semibold text-foreground">
                            {formatCurrency(listing.asking_price)}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {listing.units || "—"}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {listing.cap_rate ? `${listing.cap_rate}%` : "—"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {listing.neighborhood || listing.borough || "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Commercial Listings Tab */}
        <TabsContent value="commercial" className="mt-6">
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Store className="h-4 w-4" />
                Commercial Leasing Listings ({listings?.commercial.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : listings?.commercial.length === 0 ? (
                <div className="text-center py-12">
                  <Store className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No commercial listings</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/50">
                        <TableHead>Property</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Square Feet</TableHead>
                        <TableHead className="text-right">Asking Rent</TableHead>
                        <TableHead className="text-right">$/SF</TableHead>
                        <TableHead>Location</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {listings?.commercial.map((listing) => (
                        <TableRow 
                          key={listing.id} 
                          className="border-border/30 cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedCommercial(listing)}
                        >
                          <TableCell className="font-medium text-foreground max-w-[200px] truncate">
                            {listing.property_address}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="capitalize">
                              {listing.listing_type.replace(/_/g, " ")}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {formatNumber(listing.square_footage)}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-foreground">
                            {formatCurrency(listing.asking_rent)}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {listing.rent_per_sf ? `$${listing.rent_per_sf}` : "—"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {listing.neighborhood || listing.borough || "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Investment Detail Dialog */}
      <Dialog open={!!selectedInvestment} onOpenChange={() => setSelectedInvestment(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Investment Listing Details</DialogTitle>
          </DialogHeader>
          {selectedInvestment && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Property Address
                </p>
                <p className="font-medium text-lg">{selectedInvestment.property_address}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Asset Class</p>
                  <Badge variant="secondary" className="mt-1">{selectedInvestment.asset_class}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">
                    {selectedInvestment.neighborhood || "—"}
                    {selectedInvestment.borough && `, ${selectedInvestment.borough}`}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <DollarSign className="h-3 w-3" /> Asking Price
                  </p>
                  <p className="text-xl font-bold text-foreground">
                    {formatCurrency(selectedInvestment.asking_price)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cap Rate</p>
                  <p className="font-medium">
                    {selectedInvestment.cap_rate ? `${selectedInvestment.cap_rate}%` : "—"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Home className="h-3 w-3" /> Units
                  </p>
                  <p className="font-medium">{selectedInvestment.units || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Ruler className="h-3 w-3" /> Gross SF
                  </p>
                  <p className="font-medium">{formatNumber(selectedInvestment.gross_sf)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Commercial Detail Dialog */}
      <Dialog open={!!selectedCommercial} onOpenChange={() => setSelectedCommercial(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Commercial Listing Details</DialogTitle>
          </DialogHeader>
          {selectedCommercial && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Property Address
                </p>
                <p className="font-medium text-lg">{selectedCommercial.property_address}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Listing Type</p>
                  <Badge variant="secondary" className="mt-1 capitalize">
                    {selectedCommercial.listing_type.replace(/_/g, " ")}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">
                    {selectedCommercial.neighborhood || "—"}
                    {selectedCommercial.borough && `, ${selectedCommercial.borough}`}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Ruler className="h-3 w-3" /> Square Footage
                  </p>
                  <p className="text-xl font-bold text-foreground">
                    {formatNumber(selectedCommercial.square_footage)} SF
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <DollarSign className="h-3 w-3" /> Asking Rent
                  </p>
                  <p className="font-medium">{formatCurrency(selectedCommercial.asking_rent)}/mo</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Rent per SF</p>
                <p className="font-medium">
                  {selectedCommercial.rent_per_sf ? `$${selectedCommercial.rent_per_sf}/SF` : "—"}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
