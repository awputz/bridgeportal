import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { divisionLabels } from "@/hooks/hr/useHRAgents";

interface DivisionChartProps {
  data: { division: string; count: number }[];
}

const divisionColors: Record<string, string> = {
  'investment-sales': '#a855f7',
  'commercial-leasing': '#3b82f6',
  'residential': '#22c55e',
  'capital-advisory': '#f59e0b',
};

export function DivisionChart({ data }: DivisionChartProps) {
  const chartData = data.map(d => ({
    ...d,
    name: divisionLabels[d.division as keyof typeof divisionLabels] || d.division,
    color: divisionColors[d.division] || '#64748b'
  }));

  const total = chartData.reduce((sum, d) => sum + d.count, 0);

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-lg font-light">Agents by Division</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [
                  `${value} (${total > 0 ? ((value / total) * 100).toFixed(1) : 0}%)`,
                  'Agents'
                ]}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
