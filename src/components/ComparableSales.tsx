import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";

interface ComparableSalesProps {
  borough?: string;
  assetType?: string;
  units?: number;
  propertyId?: string;
}

export const ComparableSales = ({ borough, assetType, units, propertyId }: ComparableSalesProps) => {
  const { data: comparables = [], isLoading } = useQuery({
    queryKey: ['comparable-sales', borough, assetType, units],
    queryFn: async () => {
      let query = supabase
        .from('transactions')
        .select('*')
        .eq('deal_type', 'Sale')
        .not('sale_price', 'is', null)
        .order('closing_date', { ascending: false })
        .limit(10);

      if (borough) {
        query = query.eq('borough', borough);
      }

      if (assetType) {
        query = query.eq('asset_type', assetType);
      }

      if (units) {
        const minUnits = Math.floor(units * 0.8);
        const maxUnits = Math.ceil(units * 1.2);
        query = query.gte('units', minUnits).lte('units', maxUnits);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!borough || !!assetType,
  });

  const formatCurrency = (value: number | null) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-accent" />
            Comparable Sales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading comparable sales...</p>
        </CardContent>
      </Card>
    );
  }

  if (!comparables.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-accent" />
            Comparable Sales
          </CardTitle>
          <CardDescription>Recent sales in the same market</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No comparable sales found with the specified criteria.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-accent" />
          Comparable Sales
        </CardTitle>
        <CardDescription>
          Recent {assetType || 'property'} sales{borough ? ` in ${borough}` : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Address</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Sale Price</TableHead>
                <TableHead>Units</TableHead>
                <TableHead>$/Unit</TableHead>
                <TableHead>Agent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparables.map((comp) => (
                <TableRow key={comp.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{comp.property_address}</p>
                      {comp.neighborhood && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {comp.neighborhood}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      {comp.closing_date ? format(new Date(comp.closing_date), 'MMM yyyy') : 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(comp.sale_price)}
                  </TableCell>
                  <TableCell>
                    {comp.units || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {comp.price_per_unit ? formatCurrency(comp.price_per_unit) : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {comp.agent_name}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
