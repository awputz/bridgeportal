import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { statusLabels } from "@/hooks/hr/useHRAgents";

interface PipelineBreakdownProps {
  data: { status: string; count: number }[];
}

const statusColors: Record<string, string> = {
  cold: '#64748b',
  contacted: '#3b82f6',
  warm: '#f59e0b',
  qualified: '#f97316',
  hot: '#ef4444',
  'offer-made': '#a855f7',
  hired: '#10b981',
  lost: '#6b7280',
  'not-interested': '#475569',
};

export function PipelineBreakdown({ data }: PipelineBreakdownProps) {
  const chartData = data.map(d => ({
    ...d,
    label: statusLabels[d.status as keyof typeof statusLabels] || d.status,
    color: statusColors[d.status] || '#64748b'
  }));

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-lg font-light">Pipeline by Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 80, right: 20 }}>
              <XAxis type="number" stroke="#64748b" fontSize={12} />
              <YAxis 
                type="category" 
                dataKey="label" 
                stroke="#64748b" 
                fontSize={12}
                width={75}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
