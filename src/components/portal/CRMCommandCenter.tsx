import { Link } from "react-router-dom";
import { ArrowRight, LayoutGrid, TrendingUp, Building2, Home } from "lucide-react";
import { motion } from "framer-motion";
import { useDivision, Division, divisionConfigs } from "@/contexts/DivisionContext";
import { InlineDivisionSwitcher } from "./InlineDivisionSwitcher";
import { DashboardStats } from "./DashboardStats";
import { DealPipelinePreview } from "./DealPipelinePreview";
import { DashboardTasks } from "./DashboardTasks";

const divisionIcons: Record<Division, typeof TrendingUp> = {
  "investment-sales": TrendingUp,
  "commercial-leasing": Building2,
  "residential": Home,
};

export const CRMCommandCenter = () => {
  const { division, divisionConfig, isAdmin } = useDivision();
  const CurrentIcon = divisionIcons[division];

  return (
    <div className="glass-card p-5 md:p-6 space-y-5">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <LayoutGrid className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-foreground">CRM Command Center</h2>
            <p className="text-xs text-muted-foreground">
              {isAdmin ? "Manage your pipeline across divisions" : `Manage your ${divisionConfig.name} pipeline`}
            </p>
          </div>
        </div>
        <Link
          to="/portal/crm"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <span>Full CRM</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Division Switcher - Admin Only gets interactive switcher */}
      <div className="pt-1">
        {isAdmin ? (
          <InlineDivisionSwitcher compact />
        ) : (
          // Agent View: Static division label
          <div 
            className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-primary/5 w-fit"
            style={{ borderColor: `${divisionConfig.color}40` }}
          >
            <CurrentIcon className="h-4 w-4" style={{ color: divisionConfig.color }} />
            <span className="text-sm font-medium text-foreground">{divisionConfig.name}</span>
            <div 
              className="h-1.5 w-1.5 rounded-full" 
              style={{ backgroundColor: divisionConfig.color }} 
            />
          </div>
        )}
      </div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <DashboardStats />
      </motion.div>

      {/* Pipeline & Tasks Grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid md:grid-cols-2 gap-4"
      >
        <DealPipelinePreview />
        <DashboardTasks />
      </motion.div>
    </div>
  );
};
