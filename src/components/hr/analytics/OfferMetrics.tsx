import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileText, Clock, DollarSign, CheckCircle } from "lucide-react";

interface OfferMetricsProps {
  acceptanceRate: number;
  avgTimeToSign: number;
  avgSigningBonus: number;
  offersByStatus: { status: string; count: number }[];
}

const statusLabels: Record<string, string> = {
  draft: 'Draft',
  sent: 'Sent',
  signed: 'Signed',
  declined: 'Declined'
};

const statusColors: Record<string, string> = {
  draft: 'bg-slate-500',
  sent: 'bg-blue-500',
  signed: 'bg-emerald-500',
  declined: 'bg-red-500'
};

export function OfferMetrics({ 
  acceptanceRate, 
  avgTimeToSign, 
  avgSigningBonus,
  offersByStatus 
}: OfferMetricsProps) {
  const total = offersByStatus.reduce((sum, s) => sum + s.count, 0);

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-lg font-light">Offer Performance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Acceptance Rate Gauge */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              Acceptance Rate
            </span>
            <span className="font-light">{acceptanceRate.toFixed(1)}%</span>
          </div>
          <Progress value={acceptanceRate} className="h-2" />
        </div>

        {/* Time to Sign */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-blue-400" />
            Avg Time to Sign
          </span>
          <span className="text-lg font-light">
            {avgTimeToSign.toFixed(1)} <span className="text-sm text-muted-foreground">days</span>
          </span>
        </div>

        {/* Average Bonus */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4 text-amber-400" />
            Avg Signing Bonus
          </span>
          <span className="text-lg font-light">
            ${avgSigningBonus.toLocaleString()}
          </span>
        </div>

        {/* Status Breakdown */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <FileText className="h-4 w-4" />
            Offers by Status
          </div>
          <div className="flex h-3 rounded-full overflow-hidden bg-white/5">
            {offersByStatus.map(s => (
              <div
                key={s.status}
                className={`${statusColors[s.status]} transition-all`}
                style={{ width: total > 0 ? `${(s.count / total) * 100}%` : '0%' }}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mt-2">
            {offersByStatus.map(s => (
              <div key={s.status} className="flex items-center gap-1.5 text-xs">
                <div className={`w-2 h-2 rounded-full ${statusColors[s.status]}`} />
                <span className="text-muted-foreground">{statusLabels[s.status]}</span>
                <span className="font-light">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
