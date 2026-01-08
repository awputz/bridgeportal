import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { statusLabels } from "@/hooks/hr/useHRAgents";

interface FunnelStage {
  stage: string;
  count: number;
  rate: number;
}

interface RecruitmentFunnelProps {
  data: FunnelStage[];
}

const stageColors: Record<string, string> = {
  cold: 'bg-slate-500',
  contacted: 'bg-blue-500',
  warm: 'bg-amber-500',
  qualified: 'bg-orange-500',
  hot: 'bg-red-500',
  'offer-made': 'bg-purple-500',
  hired: 'bg-emerald-500',
};

export function RecruitmentFunnel({ data }: RecruitmentFunnelProps) {
  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-lg font-light">Recruitment Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((stage, index) => {
            const widthPercent = (stage.count / maxCount) * 100;
            const colorClass = stageColors[stage.stage] || 'bg-slate-500';
            
            return (
              <div key={stage.stage} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {statusLabels[stage.stage as keyof typeof statusLabels] || stage.stage}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-light">{stage.count}</span>
                    {index > 0 && (
                      <span className="text-xs text-muted-foreground">
                        ({stage.rate.toFixed(1)}%)
                      </span>
                    )}
                  </div>
                </div>
                <div className="h-6 bg-white/5 rounded overflow-hidden">
                  <div 
                    className={`h-full ${colorClass} transition-all duration-500 ease-out`}
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
