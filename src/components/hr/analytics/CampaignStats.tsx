import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Send, Activity } from "lucide-react";

interface CampaignStatsProps {
  activeCampaigns: number;
  totalEmailsSent: number;
}

export function CampaignStats({ activeCampaigns, totalEmailsSent }: CampaignStatsProps) {
  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-lg font-light">Campaign Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="h-4 w-4 text-emerald-400" />
              Active Campaigns
            </div>
            <div className="text-2xl font-light">{activeCampaigns}</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Send className="h-4 w-4 text-blue-400" />
              Emails Sent
            </div>
            <div className="text-2xl font-light">{totalEmailsSent.toLocaleString()}</div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Mail className="h-4 w-4" />
            Email Metrics
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-white/5">
              <div className="text-xs text-muted-foreground mb-1">Open Rate</div>
              <div className="text-lg font-light">—</div>
              <div className="text-xs text-muted-foreground mt-1">Industry avg: 20%</div>
            </div>
            <div className="p-3 rounded-lg bg-white/5">
              <div className="text-xs text-muted-foreground mb-1">Reply Rate</div>
              <div className="text-lg font-light">—</div>
              <div className="text-xs text-muted-foreground mt-1">Industry avg: 5%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
