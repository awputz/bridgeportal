import { lazy, Suspense, ComponentType } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load Recharts components for better bundle splitting
const LazyAreaChartComponent = lazy(() =>
  import("recharts").then((module) => ({ default: module.AreaChart }))
);

const LazyLineChartComponent = lazy(() =>
  import("recharts").then((module) => ({ default: module.LineChart }))
);

const LazyBarChartComponent = lazy(() =>
  import("recharts").then((module) => ({ default: module.BarChart }))
);

const LazyPieChartComponent = lazy(() =>
  import("recharts").then((module) => ({ default: module.PieChart }))
);

interface ChartSkeletonProps {
  height?: number;
  className?: string;
}

const ChartSkeleton = ({ height = 200, className }: ChartSkeletonProps) => (
  <Skeleton className={className} style={{ width: "100%", height }} />
);

// Wrapper components that provide Suspense boundaries
interface LazyChartWrapperProps {
  children: React.ReactNode;
  height?: number;
  className?: string;
}

export const LazyChartWrapper = ({ children, height = 200, className }: LazyChartWrapperProps) => (
  <Suspense fallback={<ChartSkeleton height={height} className={className} />}>
    {children}
  </Suspense>
);

// Re-export lazy chart components for direct use
export { 
  LazyAreaChartComponent as LazyAreaChart,
  LazyLineChartComponent as LazyLineChart,
  LazyBarChartComponent as LazyBarChart,
  LazyPieChartComponent as LazyPieChart,
};

// Export commonly used Recharts components that don't need lazy loading
export { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  Line,
  Bar,
  Pie,
  Cell,
  Legend,
} from "recharts";
